import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPresignedPartUrl } from "@/lib/s3";

/**
 * Generate presigned URL for multipart upload part
 * Admin-only endpoint for resumable upload parts
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
    const { key, uploadId, partNumber } = body;

    // Validate required fields
    if (!key || !uploadId || !partNumber) {
      return NextResponse.json(
        { error: "Key, upload ID, and part number are required" },
        { status: 400 },
      );
    }

    // Validate part number
    if (partNumber < 1 || partNumber > 10000) {
      return NextResponse.json(
        { error: "Part number must be between 1 and 10000" },
        { status: 400 },
      );
    }

    // Generate presigned URL for the part
    const uploadUrl = await getPresignedPartUrl({
      key,
      uploadId,
      partNumber,
    });

    return NextResponse.json({
      uploadUrl,
      partNumber,
      expiresIn: parseInt(process.env.PRESIGNED_URL_EXPIRY_SECONDS || "300"),
    });
  } catch (error) {
    console.error("Multipart part URL generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate part upload URL" },
      { status: 500 },
    );
  }
}
