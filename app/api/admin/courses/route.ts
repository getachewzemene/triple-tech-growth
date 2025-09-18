import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// const prisma = new PrismaClient();

// Validation schema for course creation
const createCourseSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  priceCents: z.number().int().min(0),
  thumbnailKey: z.string().optional(),
  instructor: z.string().min(1).max(100),
  lessons: z.array(z.object({
    title: z.string().min(1).max(200),
    contentType: z.enum(['VIDEO', 'PDF']),
    s3Key: z.string().min(1),
    order: z.number().int().min(1),
  })).min(1).max(50),
  // Legacy fields for backward compatibility
  detail: z.string().optional(),
  s3Key: z.string().optional(),
  videoSize: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
});

/**
 * Admin-only API route to create a new course record with lessons
 * Security: Validates admin privileges and course data before database insertion
 * Creates Course record and associated Lesson records in transaction
 * Links uploaded content files (S3 keys) with course and lesson metadata
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin privileges
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify admin role - only admins can create courses
    if (!(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = createCourseSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid course data',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { slug, title, description, priceCents, thumbnailKey, instructor, lessons, detail, s3Key, videoSize, duration } = validationResult.data;

    // Check if slug is already taken
    // For demo purposes, create mock check
    // In production, check database for existing slug
    const existingCourse = null; // await prisma.course.findUnique({ where: { slug } });
    
    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course slug already exists' },
        { status: 409 }
      );
    }

    // Validate file types for all lesson content
    for (const lesson of lessons) {
      if (lesson.contentType === 'VIDEO' && !isValidVideoType(lesson.s3Key)) {
        return NextResponse.json(
          { error: `Invalid video file type for lesson: ${lesson.title}` },
          { status: 400 }
        );
      }
      if (lesson.contentType === 'PDF' && !isValidPdfType(lesson.s3Key)) {
        return NextResponse.json(
          { error: `Invalid PDF file type for lesson: ${lesson.title}` },
          { status: 400 }
        );
      }
    }

    // Create course with lessons in database transaction
    // For demo purposes, create mock data
    // In production, use Prisma transaction
    const courseId = `course_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const course = {
      id: courseId,
      slug,
      title,
      description,
      priceCents,
      thumbnailKey: thumbnailKey || null,
      isPublished: false, // New courses start as unpublished
      instructor,
      // Legacy fields for backward compatibility
      detail: detail || description,
      s3Key: s3Key || (lessons.length > 0 ? lessons[0].s3Key : null),
      videoUrl: process.env.NEXT_PUBLIC_CDN_BASE_URL && s3Key
        ? `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${s3Key}`
        : null,
      size: videoSize || null,
      duration: duration || null,
      isProtected: true,
      drmEnabled: false,
      transcodeStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.user.id,
    };

    // Create lessons for the course
    const createdLessons = lessons.map((lesson, index) => ({
      id: `lesson_${Date.now()}_${index}_${Math.random().toString(36).substring(7)}`,
      courseId: courseId,
      title: lesson.title,
      contentType: lesson.contentType,
      s3Key: lesson.s3Key,
      order: lesson.order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // In production, use Prisma transaction:
    /*
    const result = await prisma.$transaction(async (tx) => {
      const newCourse = await tx.course.create({
        data: {
          slug,
          title,
          description,
          priceCents,
          thumbnailKey,
          isPublished: false,
          instructor,
          detail,
          s3Key,
          // ... other fields
          createdBy: session.user.id,
        },
      });

      const newLessons = await Promise.all(
        lessons.map((lesson) =>
          tx.lesson.create({
            data: {
              courseId: newCourse.id,
              title: lesson.title,
              contentType: lesson.contentType,
              s3Key: lesson.s3Key,
              order: lesson.order,
            },
          })
        )
      );

      return { course: newCourse, lessons: newLessons };
    });
    */

    console.log('Course and lessons created:', { course, lessons: createdLessons });

    return NextResponse.json({
      success: true,
      message: 'Course and lessons created successfully',
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        price: formatPrice(course.priceCents),
        isPublished: course.isPublished,
        lessonsCount: createdLessons.length,
      },
      lessons: createdLessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        contentType: lesson.contentType,
        order: lesson.order,
      })),
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get all courses (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin privileges
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify admin role
    if (!(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    // For demo purposes, return mock courses
    // In production, query database
    const courses = [
      {
        id: 'course_123',
        slug: 'video-editing-masterclass',
        title: 'Video Editing Masterclass',
        description: 'Learn professional video editing techniques',
        priceCents: 29900,
        isPublished: true,
        lessonsCount: 12,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      courses,
      total: courses.length,
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Validate if the file is a valid video type
 */
function isValidVideoType(s3Key: string): boolean {
  const allowedExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  const extension = s3Key.toLowerCase().substring(s3Key.lastIndexOf('.'));
  return allowedExtensions.includes(extension);
}

/**
 * Validate if the file is a valid PDF type
 */
function isValidPdfType(s3Key: string): boolean {
  const extension = s3Key.toLowerCase().substring(s3Key.lastIndexOf('.'));
  return extension === '.pdf';
}

/**
 * Format price in cents to display format
 */
function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(2)}`;
}

/**
 * Reject all other HTTP methods
 */
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}