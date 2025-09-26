import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { completeMultipartUpload } from "@/lib/s3";

/**
 * Complete multipart upload by combining all parts
 * Admin-only endpoint for finalizing resumable uploads
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
    const { key, uploadId, parts } = body;

    // Validate required fields
    if (!key || !uploadId || !Array.isArray(parts)) {
      return NextResponse.json(
        { error: "Key, upload ID, and parts array are required" },
        { status: 400 },
      );
    }

    // Validate parts format
    for (const part of parts) {
      if (!part.ETag || !part.PartNumber) {
        return NextResponse.json(
          { error: "Each part must have ETag and PartNumber" },
          { status: 400 },
        );
      }
    }

    // Sort parts by part number
    const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);

    // Complete multipart upload
    await completeMultipartUpload({
      key,
      uploadId,
      parts: sortedParts,
    });

    console.log(`Multipart upload completed: ${key}`);

    return NextResponse.json({
      message: "Multipart upload completed successfully",
      key,
      location: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    });
  } catch (error) {
    console.error("Multipart upload completion error:", error);

    return NextResponse.json(
      { error: "Failed to complete multipart upload" },
      { status: 500 },
    );
  }
}
