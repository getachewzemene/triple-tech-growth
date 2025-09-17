import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, checkCourseAccess, getActivePlaybackSessions, createPlaybackSession } from '@/lib/auth';
import { createPlaybackToken, generateSessionId, hashIpAddress, checkRateLimit } from '@/lib/playback';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate short-lived playback token for authenticated users
 * Security: Validates user access, enforces rate limits and concurrent stream limits
 * Returns JWT token valid for 60-120 seconds for secure video access
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting and logging
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    const userAgent = request.headers.get('user-agent') || '';

    // Check authentication - any authenticated user can request tokens
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { courseId } = body;

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Rate limiting: prevent token abuse (10 requests per minute per user)
    if (!checkRateLimit(session.user.id!, 10, 1)) {
      return NextResponse.json(
        { error: 'Too many token requests. Please wait before requesting again.' },
        { status: 429 }
      );
    }

    // Verify course exists and user has access
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this course (enrollment or admin)
    const hasAccess = await checkCourseAccess(session.user.id!, courseId);
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied. Please enroll in this course first.' },
        { status: 403 }
      );
    }

    // Check concurrent stream limit (max 2 active sessions per user)
    const activeSessions = await getActivePlaybackSessions(session.user.id!);
    
    if (activeSessions >= 2) {
      return NextResponse.json(
        { 
          error: 'Maximum concurrent streams reached. Please close other video sessions.',
          maxConcurrentStreams: 2
        },
        { status: 429 }
      );
    }

    // Generate unique session ID for this playback session
    const sessionId = generateSessionId();

    // Create playback session record for tracking and concurrent limit enforcement
    await createPlaybackSession({
      userId: session.user.id!,
      courseId,
      sessionId,
      userAgent,
      ipAddress: hashIpAddress(clientIP), // Hash IP for privacy
    });

    // Generate short-lived playback token (90 seconds default)
    const playbackToken = createPlaybackToken({
      userId: session.user.id!,
      courseId,
      sessionId,
      userAgent,
      expiresInSeconds: 90, // Short expiry for security
    });

    // Log playback token generation for security monitoring
    console.log(`Playback token generated for user ${session.user.id} course ${courseId} session ${sessionId}`);

    return NextResponse.json({
      playbackToken,
      sessionId,
      expiresIn: 90,
      maxConcurrentStreams: 2,
    });

  } catch (error) {
    console.error('Playback token generation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate playback token' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Revoke playback session (optional endpoint for explicit session cleanup)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Deactivate the specific session
    await prisma.playbackSession.updateMany({
      where: {
        sessionId,
        userId: session.user.id!,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Session revocation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to revoke session' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Get user's active playback sessions
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's active sessions
    const activeSessions = await prisma.playbackSession.findMany({
      where: {
        userId: session.user.id!,
        isActive: true,
        lastActiveAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        lastActiveAt: 'desc',
      },
    });

    return NextResponse.json({
      activeSessions: activeSessions.length,
      maxConcurrentStreams: 2,
      sessions: activeSessions.map(s => ({
        sessionId: s.sessionId,
        courseId: s.courseId,
        courseTitle: s.course.title,
        startedAt: s.startedAt,
        lastActiveAt: s.lastActiveAt,
      })),
    });

  } catch (error) {
    console.error('Failed to fetch active sessions:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch active sessions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}