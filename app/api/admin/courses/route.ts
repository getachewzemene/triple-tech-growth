import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// const prisma = new PrismaClient();

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

    // For demo purposes, create a mock course object
    // In production, this would save to database
    const course = {
      id: `course_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      title,
      detail,
      instructor,
      s3Key,
      videoUrl: process.env.NEXT_PUBLIC_CDN_BASE_URL 
        ? `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${s3Key}`
        : null,
      size: videoSize,
      duration,
      isProtected: true,
      drmEnabled: false,
      transcodeStatus: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: session.user.id!,
    };

    // Log course creation for audit trail
    console.log(`Course created: ${course.id} by admin ${session.user.id}`);

    // TODO: Trigger transcoding pipeline here
    // - Send message to SQS/Redis queue with course ID and S3 key
    // - Worker will pick up and process video for HLS/DASH
    // - Update transcodeStatus to 'processing' then 'completed'

    return NextResponse.json(course);

  } catch (error) {
    console.error('Course creation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create course' },
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

    if (!(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    // For demo purposes, return empty array
    // In production, this would query the database
    const courses = [];

    return NextResponse.json(courses);

  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
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