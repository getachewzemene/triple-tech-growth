import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPresignedPutUrl } from "@/lib/s3";
import { z } from "zod";

// Validation schema for proof upload URL request
const proofUploadSchema = z.object({
  key: z.string().min(1),
  contentType: z.string().min(1),
  fileSize: z.number().int().min(1),
});

/**
 * Authenticated user API route to generate presigned S3 upload URLs for payment proofs
 * Security: Validates user authentication, file type (images/PDF), and size limits
 * Returns short-lived (5min) presigned PUT URL for direct S3 upload
 * Enforces 10MB file size limit and validates MIME types
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication - any authenticated user can upload proof
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = proofUploadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid upload request",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { key, contentType, fileSize } = validationResult.data;

    // Validate file size (10MB limit for payment proofs)
    const maxSizeBytes = parseInt(
      process.env.MAX_PROOF_UPLOAD_BYTES || "10485760",
    ); // 10MB
    if (fileSize > maxSizeBytes) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${formatFileSize(maxSizeBytes)}`,
        },
        { status: 400 },
      );
    }

    // Validate content type for payment proofs (images and PDF only)
    if (!isValidProofContentType(contentType)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only images (JPEG, PNG, GIF) and PDF files are allowed for payment proofs.",
        },
        { status: 400 },
      );
    }

    // Generate user-specific S3 key for security
    const userId = session.user.id;
    const timestamp = Date.now();
    const safeKey = `proofs/${userId}/${timestamp}/${key.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Generate presigned URL with 5-minute expiry for security
    const uploadUrl = await getPresignedPutUrl({
      key: safeKey,
      contentType,
      expires: parseInt(process.env.PRESIGNED_URL_EXPIRY_SECONDS || "300"),
    });

    // Return the upload URL and S3 key for tracking
    return NextResponse.json({
      uploadUrl,
      s3Key: safeKey,
      expiresIn: 300, // 5 minutes
      maxFileSize: maxSizeBytes,
      acceptedTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ],
    });
  } catch (error) {
    console.error("Error generating proof upload URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Validate if content type is acceptable for payment proofs
 * Security: Only allow images and PDF files to prevent malware uploads
 */
function isValidProofContentType(contentType: string): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];

  return allowedTypes.includes(contentType.toLowerCase());
}

/**
 * Format file size in bytes to human-readable format
 */
function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Reject all other HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to generate upload URLs." },
    { status: 405 },
  );
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
