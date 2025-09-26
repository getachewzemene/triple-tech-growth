import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createMultipartUpload, isValidVideoType } from "@/lib/s3";

/**
 * Create multipart upload for large video files
 * Admin-only endpoint for initiating resumable uploads
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin privileges
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { key, contentType } = body;

    // Validate required fields
    if (!key || !contentType) {
      return NextResponse.json(
        { error: "S3 key and content type are required" },
        { status: 400 },
      );
    }

    // Validate video file type
    if (!isValidVideoType(contentType)) {
      return NextResponse.json(
        { error: "Invalid file type. Only video files are allowed" },
        { status: 400 },
      );
    }

    // Create multipart upload
    const uploadId = await createMultipartUpload({ key, contentType });

    return NextResponse.json({
      uploadId,
      key,
      message: "Multipart upload created successfully",
    });
  } catch (error) {
    console.error("Multipart upload creation error:", error);

    return NextResponse.json(
      { error: "Failed to create multipart upload" },
      { status: 500 },
    );
  }
}
