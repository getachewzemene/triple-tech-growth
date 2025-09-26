import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface PlaybackTokenPayload {
  userId: string;
  courseId: string;
  sessionId: string;
  uaHash: string; // User agent hash for additional security
  iat: number;
  exp: number;
}

/**
 * Generate a short-lived playback token for video access
 * Token expires in 60-120 seconds to minimize exposure
 */
export function createPlaybackToken({
  userId,
  courseId,
  sessionId,
  userAgent,
  expiresInSeconds = 90, // Default 90 seconds
}: {
  userId: string;
  courseId: string;
  sessionId: string;
  userAgent: string;
  expiresInSeconds?: number;
}): string {
  // Hash user agent for token binding without storing full UA string
  const uaHash = crypto
    .createHash("sha256")
    .update(userAgent)
    .digest("hex")
    .substring(0, 16); // Use first 16 chars for space efficiency

  const payload: Omit<PlaybackTokenPayload, "iat" | "exp"> = {
    userId,
    courseId,
    sessionId,
    uaHash,
  };

  const secret = process.env.PLAYBACK_JWT_SECRET;
  if (!secret) {
    throw new Error("PLAYBACK_JWT_SECRET environment variable is required");
  }

  return jwt.sign(payload, secret, {
    expiresIn: expiresInSeconds,
    issuer: "tripleacademy",
    audience: "video-player",
  });
}

/**
 * Verify and decode a playback token
 * Returns payload if valid, throws error if invalid/expired
 */
export function verifyPlaybackToken(
  token: string,
  userAgent: string,
): PlaybackTokenPayload {
  const secret = process.env.PLAYBACK_JWT_SECRET;
  if (!secret) {
    throw new Error("PLAYBACK_JWT_SECRET environment variable is required");
  }

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: "tripleacademy",
      audience: "video-player",
    }) as PlaybackTokenPayload;

    // Verify user agent hash matches
    const expectedUaHash = crypto
      .createHash("sha256")
      .update(userAgent)
      .digest("hex")
      .substring(0, 16);

    if (decoded.uaHash !== expectedUaHash) {
      throw new Error("User agent mismatch");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid playback token");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Playback token expired");
    }
    throw error;
  }
}

/**
 * Generate CloudFront signed URL for video manifest access
 * Short-lived URL that expires in 5 minutes
 */
export function generateSignedManifestUrl(
  manifestPath: string,
  expiresInSeconds: number = 300,
): string {
  const cloudFrontDomain = process.env.NEXT_PUBLIC_CDN_BASE_URL;
  const keypairId = process.env.CLOUDFRONT_KEYPAIR_ID;
  const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY;

  if (!cloudFrontDomain || !keypairId || !privateKey) {
    throw new Error("CloudFront configuration missing");
  }

  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const url = `${cloudFrontDomain}/${manifestPath}`;

  // Create CloudFront policy
  const policy = {
    Statement: [
      {
        Resource: url,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": expires,
          },
        },
      },
    ],
  };

  const policyString = JSON.stringify(policy);
  const policyBase64 = Buffer.from(policyString)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  // Sign the policy
  const signature = crypto
    .createSign("RSA-SHA1")
    .update(policyString)
    .sign(privateKey, "base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${url}?Policy=${policyBase64}&Signature=${signature}&Key-Pair-Id=${keypairId}`;
}

/**
 * Generate CloudFront signed cookies for HLS/DASH segments
 * More efficient than signed URLs for streaming with many segments
 */
export function generateSignedCookies(
  resourcePath: string,
  expiresInSeconds: number = 300,
): Record<string, string> {
  const keypairId = process.env.CLOUDFRONT_KEYPAIR_ID;
  const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY;

  if (!keypairId || !privateKey) {
    throw new Error("CloudFront configuration missing");
  }

  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;

  const policy = {
    Statement: [
      {
        Resource: resourcePath,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": expires,
          },
        },
      },
    ],
  };

  const policyString = JSON.stringify(policy);
  const policyBase64 = Buffer.from(policyString)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const signature = crypto
    .createSign("RSA-SHA1")
    .update(policyString)
    .sign(privateKey, "base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return {
    "CloudFront-Policy": policyBase64,
    "CloudFront-Signature": signature,
    "CloudFront-Key-Pair-Id": keypairId,
  };
}

/**
 * Generate session ID for tracking playback sessions
 */
export function generateSessionId(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Hash IP address for privacy-preserving logging
 */
export function hashIpAddress(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + process.env.PLAYBACK_JWT_SECRET)
    .digest("hex")
    .substring(0, 12);
}

/**
 * Rate limiting helper for playback token requests
 * Simple in-memory rate limiter - for production, use Redis
 */
const tokenRequestCounts = new Map<
  string,
  { count: number; resetTime: number }
>();

export function checkRateLimit(
  userId: string,
  maxRequests: number = 10,
  windowMinutes: number = 1,
): boolean {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const resetTime = now + windowMs;

  const current = tokenRequestCounts.get(userId);

  if (!current || now > current.resetTime) {
    tokenRequestCounts.set(userId, { count: 1, resetTime });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

/**
 * Cleanup expired rate limit entries
 * Call this periodically to prevent memory leaks
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [userId, data] of tokenRequestCounts.entries()) {
    if (now > data.resetTime) {
      tokenRequestCounts.delete(userId);
    }
  }
}
