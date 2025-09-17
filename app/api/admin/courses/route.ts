import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for course creation
const createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  detail: z.string().min(1).max(2000),
  instructor: z.string().min(1).max(100),
  s3Key: z.string().min(1),
  videoSize: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
});

/**
 * Admin-only API route to create a new course record
 * Security: Validates admin privileges and course data before database insertion
 * Links uploaded video file (S3 key) with course metadata
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

    const { title, detail, instructor, s3Key, videoSize, duration } = validationResult.data;

    // Check if a course with the same title already exists
    const existingCourse = await prisma.course.findFirst({
      where: { title }
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: 'A course with this title already exists' },
        { status: 409 }
      );
    }

    // Create the course record in the database
    const course = await prisma.course.create({
      data: {
        title,
        detail,
        instructor,
        s3Key,
        size: videoSize,
        duration,
        createdBy: session.user.id!,
        // Set defaults for security fields
        isProtected: true,
        drmEnabled: false, // Can be enabled later based on business requirements
        transcodeStatus: 'pending', // Will be updated by transcoding pipeline
      },
    });

    // Generate initial video URL (will be replaced after transcoding)
    const videoUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL 
      ? `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${s3Key}`
      : null;

    // Update course with video URL if CDN is configured
    if (videoUrl) {
      await prisma.course.update({
        where: { id: course.id },
        data: { videoUrl },
      });
    }

    // Log course creation for audit trail
    console.log(`Course created: ${course.id} by admin ${session.user.id}`);

    // TODO: Trigger transcoding pipeline here
    // - Send message to SQS/Redis queue with course ID and S3 key
    // - Worker will pick up and process video for HLS/DASH
    // - Update transcodeStatus to 'processing' then 'completed'

    return NextResponse.json({
      id: course.id,
      title: course.title,
      detail: course.detail,
      instructor: course.instructor,
      s3Key: course.s3Key,
      videoUrl: course.videoUrl,
      duration: course.duration,
      size: course.size,
      isProtected: course.isProtected,
      transcodeStatus: course.transcodeStatus,
      createdAt: course.createdAt,
    });

  } catch (error) {
    console.error('Course creation error:', error);
    
    // Handle specific database errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Course with this data already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
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

    if (!(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    // Get all courses with enrollment counts
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            enrollments: true,
            playbackSessions: true,
          },
        },
      },
    });

    return NextResponse.json(courses);

  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
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