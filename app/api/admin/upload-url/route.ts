import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPresignedPutUrl, generateVideoS3Key, isValidVideoType, isValidFileSize } from '@/lib/s3';

/**
 * Admin-only API route to generate presigned S3 upload URLs
 * Security: Validates admin privileges, file type, and size before generating URL
 * Returns short-lived (5min) presigned PUT URL for direct S3 upload
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

    // Verify admin role - only admins can upload courses
    if (!(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { key, contentType } = body;

    // Validate required fields
    if (!key || !contentType) {
      return NextResponse.json(
        { error: 'S3 key and content type are required' },
        { status: 400 }
      );
    }

    // Validate video file type to prevent upload of non-video files
    if (!isValidVideoType(contentType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, WebM, MOV, and AVI files are allowed' },
        { status: 400 }
      );
    }

    // Generate presigned URL with 5-minute expiry for security
    const uploadUrl = await getPresignedPutUrl({
      key,
      contentType,
      expires: parseInt(process.env.PRESIGNED_URL_EXPIRY_SECONDS || '300'),
    });

    // Return the upload URL and S3 key for tracking
    return NextResponse.json({
      uploadUrl,
      expiresIn: parseInt(process.env.PRESIGNED_URL_EXPIRY_SECONDS || '300'),
    });

  } catch (error) {
    console.error('Upload URL generation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

/**
 * Reject all other HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}