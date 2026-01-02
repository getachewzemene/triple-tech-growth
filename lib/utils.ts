import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract file ID from various Google Drive URL formats
 * Supports:
 * - https://drive.google.com/file/d/{fileId}/view
 * - https://drive.google.com/file/d/{fileId}/view?usp=sharing
 * - https://drive.google.com/open?id={fileId}
 * - https://drive.google.com/uc?id={fileId}
 * - Direct file ID string
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;

  // If it's already just a file ID (no slashes or protocol)
  if (/^[a-zA-Z0-9_-]+$/.test(url) && url.length > 20) {
    return url;
  }

  // Match /file/d/{fileId}/ pattern
  const filePattern = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch) {
    return fileMatch[1];
  }

  // Match id={fileId} pattern in query string
  const idPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
  const idMatch = url.match(idPattern);
  if (idMatch) {
    return idMatch[1];
  }

  return null;
}

/**
 * Check if a URL is a valid Google Drive video URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.includes("drive.google.com") ||
    url.includes("docs.google.com/file") ||
    /^[a-zA-Z0-9_-]{25,}$/.test(url) // Just a file ID
  );
}

/**
 * Convert a Google Drive URL to an embeddable video URL
 * Returns the preview/embed URL that can be used in an iframe
 */
export function getGoogleDriveEmbedUrl(url: string): string | null {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;

  // Use the preview endpoint which works well for video playback
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Get the direct download URL for a Google Drive file
 * Note: This only works for files that have link sharing enabled
 */
export function getGoogleDriveDirectUrl(url: string): string | null {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;

  // Direct download/stream URL
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}
