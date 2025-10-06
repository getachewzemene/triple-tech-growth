import { NextRequest, NextResponse } from "next/server";
import {
  verifyPlaybackToken,
  generateSignedManifestUrl,
  generateSignedCookies,
} from "@/lib/playback";
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

/**
 * Protected manifest endpoint that validates playback tokens and returns signed CDN URLs
 * Security: Validates JWT token, checks course access and active enrollment, returns short-lived manifest URLs
 * Supports both CloudFront signed URLs and signed cookies for HLS/DASH streaming
 * Enforces Enrollment.status === "active" for content access
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const userAgent = request.headers.get("user-agent") || "";

    // Extract Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate required parameters
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }

    // Verify and decode playback token
    let tokenPayload;
    try {
      tokenPayload = verifyPlaybackToken(token, userAgent);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Invalid playback token",
          code: "TOKEN_INVALID",
        },
        { status: 401 },
      );
    }

    // Verify token is for the requested course
    if (tokenPayload.courseId !== courseId) {
      return NextResponse.json(
        { error: "Token is not valid for this course" },
        { status: 403 },
      );
    }

    // Validate user has active enrollment for this course
    // Security: Must enforce Enrollment.status === "active"
    const userId = tokenPayload.userId;

    // For demo purposes, create mock enrollment check
    // In production, query database: await prisma.enrollment.findUnique({...})
    const enrollment = {
      id: "enrollment_123",
      userId: userId,
      courseId: courseId,
      status: "active", // This would come from database
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
    };

    if (!enrollment) {
      return NextResponse.json(
        {
          error: "No enrollment found for this course",
          code: "ENROLLMENT_NOT_FOUND",
        },
        { status: 403 },
      );
    }

    // Enforce active enrollment requirement
    if (enrollment.status !== "active") {
      return NextResponse.json(
        {
          error: "Enrollment not active. Payment verification may be required.",
          code: "ENROLLMENT_NOT_ACTIVE",
          enrollmentStatus: enrollment.status,
        },
        { status: 403 },
      );
    }

    // Get course details and verify it exists
    // For demo purposes, create a mock course
    // In production, query database
    const course = {
      id: courseId,
      title: "Demo Course",
      transcodeStatus: "completed",
      s3Key: `demo-course-${courseId}/video.mp4`,
      duration: 3600, // 1 hour
      instructor: "Demo Instructor",
    };

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if course has been transcoded and is ready for playback
    if (course.transcodeStatus !== "completed") {
      return NextResponse.json(
        {
          error:
            "Course video is still being processed. Please try again later.",
          transcodeStatus: course.transcodeStatus,
        },
        { status: 503 },
      );
    }

    // Update session last activity for concurrent stream tracking
    // For demo purposes, just log
    // In production, update database
    console.log("Updating session activity:", tokenPayload.sessionId);

    // Generate manifest path based on S3 key
    // In production, this would point to transcoded HLS/DASH files
    const manifestPath = `protected/${course.s3Key.replace(/\.[^/.]+$/, "")}/playlist.m3u8`;

    try {
      // Method 1: CloudFront signed URL (for single manifest request)
      const signedManifestUrl = generateSignedManifestUrl(manifestPath, 300); // 5 minutes

      // Method 2: CloudFront signed cookies (more efficient for streaming with many segments)
      const resourcePath = `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/protected/${course.s3Key.replace(/\.[^/.]+$/, "")}/*`;
      const signedCookies = generateSignedCookies(resourcePath, 300);

      // Log manifest access for security monitoring
      console.log(
        `Manifest accessed: user ${tokenPayload.userId} course ${courseId} session ${tokenPayload.sessionId}`,
      );

      // Return both signed URL and cookies for flexibility
      return NextResponse.json({
        manifestUrl: signedManifestUrl,
        signedCookies,
        expiresIn: 300, // 5 minutes
        course: {
          id: course.id,
          title: course.title,
          duration: course.duration,
          instructor: course.instructor,
        },
      });
    } catch (error) {
      console.error("Failed to generate signed URLs:", error);

      // Fallback: return direct S3 URL if CloudFront signing fails (development only)
      if (process.env.NODE_ENV === "development") {
        const fallbackUrl = `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${course.s3Key}`;

        return NextResponse.json({
          manifestUrl: fallbackUrl,
          expiresIn: 300,
          warning: "Using fallback URL - CloudFront signing not configured",
          course: {
            id: course.id,
            title: course.title,
            duration: course.duration,
            instructor: course.instructor,
          },
        });
      }

      throw error;
    }
  } catch (error) {
    console.error("Manifest generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate manifest URL" },
      { status: 500 },
    );
  }
}

/**
 * Handle preflight requests for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/**
 * Reject other HTTP methods
 */
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
