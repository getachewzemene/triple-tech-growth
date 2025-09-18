import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

/**
 * Get public course details by slug
 * Security: Public endpoint but only shows full content links if user has active enrollment
 * Returns course metadata, lessons list, and conditional access to content
 */
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Get course by slug
    // For demo purposes, create mock course data
    // In production, query database: await prisma.course.findUnique({ where: { slug } })
    const course = {
      id: 'course_123',
      slug: slug,
      title: 'Advanced Video Editing Masterclass',
      description: 'Master professional video editing techniques with industry-standard tools and workflows.',
      priceCents: 29900, // $299.00
      thumbnailKey: 'thumbnails/video-editing-course.jpg',
      isPublished: true,
      instructor: 'Sarah Johnson',
      duration: 8 * 60 * 60, // 8 hours in seconds
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (!course.isPublished) {
      return NextResponse.json(
        { error: 'Course not available' },
        { status: 404 }
      );
    }

    // Get course lessons
    // For demo purposes, create mock lessons
    // In production, query database: await prisma.lesson.findMany({ where: { courseId: course.id } })
    const lessons = [
      {
        id: 'lesson_1',
        title: 'Introduction to Video Editing',
        contentType: 'VIDEO',
        order: 1,
        duration: 1800, // 30 minutes
      },
      {
        id: 'lesson_2',
        title: 'Editing Software Overview',
        contentType: 'VIDEO',
        order: 2,
        duration: 2400, // 40 minutes
      },
      {
        id: 'lesson_3',
        title: 'Course Materials PDF',
        contentType: 'PDF',
        order: 3,
        duration: null,
      },
    ];

    // Check user's enrollment status
    let enrollment = null;
    let hasActiveEnrollment = false;

    if (userId) {
      // For demo purposes, create mock enrollment check
      // In production, query database: await prisma.enrollment.findUnique({...})
      enrollment = {
        id: 'enrollment_123',
        userId: userId,
        courseId: course.id,
        status: 'active', // This would come from database
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };

      hasActiveEnrollment = enrollment?.status === 'active';
    }

    // Prepare response data based on enrollment status
    const responseData = {
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        price: formatPrice(course.priceCents),
        priceCents: course.priceCents,
        thumbnailUrl: course.thumbnailKey 
          ? `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${course.thumbnailKey}`
          : null,
        instructor: course.instructor,
        duration: formatDuration(course.duration),
        isPublished: course.isPublished,
      },
      lessons: lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        contentType: lesson.contentType,
        order: lesson.order,
        duration: lesson.duration ? formatDuration(lesson.duration) : null,
        // Only provide content access if user has active enrollment
        hasAccess: hasActiveEnrollment,
        // Content URLs only available with active enrollment
        ...(hasActiveEnrollment && {
          contentUrl: generateContentUrl(lesson.id, course.id),
        }),
      })),
      enrollment: enrollment ? {
        status: enrollment.status,
        enrolledAt: enrollment.createdAt,
        approvedAt: enrollment.approvedAt,
      } : null,
      userAccess: {
        isAuthenticated: !!userId,
        hasActiveEnrollment,
        canEnroll: !hasActiveEnrollment,
        enrollmentRequired: !hasActiveEnrollment,
      },
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error fetching course details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Format price in cents to display format
 */
function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(2)}`;
}

/**
 * Format duration in seconds to human-readable format
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Generate content URL for a lesson (only for enrolled users)
 * In production, this would generate playback tokens or signed URLs
 */
function generateContentUrl(lessonId: string, courseId: string): string {
  // For video content, return player URL with token
  // For PDF content, return signed download URL
  return `/api/player/manifest?courseId=${courseId}&lessonId=${lessonId}`;
}