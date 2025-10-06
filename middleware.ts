import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for production security headers and request handling
 * This runs on all requests before they reach the application
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers (additional to next.config.js)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Content Security Policy (adjust as needed for your app)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://www.google-analytics.com https://*.cloudfront.net;
    frame-src 'self' https://www.youtube.com https://player.vimeo.com;
    media-src 'self' https://*.cloudfront.net blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  // Only set CSP in production to avoid dev issues
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Content-Security-Policy", cspHeader);
  }

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
