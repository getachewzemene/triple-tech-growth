import {
  S3Client,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client with AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface PresignedUrlParams {
  key: string;
  contentType: string;
  expires?: number; // expiry in seconds, default from env
}

/**
 * Generate a presigned PUT URL for direct S3 upload
 * Used for single-file uploads up to 5GB
 */
export async function getPresignedPutUrl({
  key,
  contentType,
  expires = parseInt(process.env.PRESIGNED_URL_EXPIRY_SECONDS || "300"),
}: PresignedUrlParams): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    // Add server-side encryption
    ServerSideEncryption: "AES256",
    // Prevent public access
    ACL: "private",
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expires,
    });
    return signedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate upload URL");
  }
}

export interface MultipartUploadParams {
  key: string;
  contentType: string;
}

/**
 * Create a multipart upload for large files (>100MB recommended)
 * Returns uploadId for subsequent part uploads
 */
export async function createMultipartUpload({
  key,
  contentType,
}: MultipartUploadParams): Promise<string> {
  const command = new CreateMultipartUploadCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    ServerSideEncryption: "AES256",
    ACL: "private",
  });

  try {
    const response = await s3Client.send(command);
    if (!response.UploadId) {
      throw new Error("Failed to create multipart upload");
    }
    return response.UploadId;
  } catch (error) {
    console.error("Error creating multipart upload:", error);
    throw new Error("Failed to create multipart upload");
  }
}

export interface PresignedPartUrlParams {
  key: string;
  uploadId: string;
  partNumber: number;
  expires?: number;
}

/**
 * Generate presigned URL for uploading a specific part in multipart upload
 */
export async function getPresignedPartUrl({
  key,
  uploadId,
  partNumber,
  expires = parseInt(process.env.PRESIGNED_URL_EXPIRY_SECONDS || "300"),
}: PresignedPartUrlParams): Promise<string> {
  const command = new UploadPartCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expires,
    });
    return signedUrl;
  } catch (error) {
    console.error("Error generating presigned part URL:", error);
    throw new Error("Failed to generate part upload URL");
  }
}

export interface CompletedPart {
  ETag: string;
  PartNumber: number;
}

export interface CompleteMultipartParams {
  key: string;
  uploadId: string;
  parts: CompletedPart[];
}

/**
 * Complete multipart upload by combining all uploaded parts
 */
export async function completeMultipartUpload({
  key,
  uploadId,
  parts,
}: CompleteMultipartParams): Promise<void> {
  const command = new CompleteMultipartUploadCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Error completing multipart upload:", error);
    throw new Error("Failed to complete multipart upload");
  }
}

/**
 * Abort multipart upload (cleanup on failure)
 */
export async function abortMultipartUpload(
  key: string,
  uploadId: string,
): Promise<void> {
  const command = new AbortMultipartUploadCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    UploadId: uploadId,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Error aborting multipart upload:", error);
    // Don't throw here as this is cleanup
  }
}

/**
 * Generate S3 key for video uploads with timestamp and random suffix for uniqueness
 */
export function generateVideoS3Key(filename: string, userId: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 15);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

  return `uploads/${userId}/${timestamp}_${randomSuffix}_${sanitizedFilename}`;
}

/**
 * Validate file type for video uploads
 */
export function isValidVideoType(contentType: string): boolean {
  const allowedTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime", // .mov files
    "video/x-msvideo", // .avi files
  ];

  return allowedTypes.includes(contentType);
}

/**
 * Validate file size against maximum allowed
 */
export function isValidFileSize(size: number): boolean {
  const maxSize = parseInt(process.env.MAX_VIDEO_UPLOAD_BYTES || "1610612736"); // 1.5GB default
  return size <= maxSize;
}
