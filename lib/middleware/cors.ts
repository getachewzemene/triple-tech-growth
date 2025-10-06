import { NextResponse } from "next/server";

export interface CorsOptions {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * CORS middleware for API routes
 */
export function corsHeaders(options: CorsOptions = {}): Headers {
  const headers = new Headers();

  const {
    origin = process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders = [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders = ["Content-Length", "Content-Type"],
    credentials = true,
    maxAge = 86400, // 24 hours
  } = options;

  // Set Access-Control-Allow-Origin
  if (Array.isArray(origin)) {
    headers.set("Access-Control-Allow-Origin", origin.join(", "));
  } else {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  // Set other CORS headers
  headers.set("Access-Control-Allow-Methods", methods.join(", "));
  headers.set("Access-Control-Allow-Headers", allowedHeaders.join(", "));
  headers.set("Access-Control-Expose-Headers", exposedHeaders.join(", "));
  headers.set("Access-Control-Max-Age", maxAge.toString());

  if (credentials) {
    headers.set("Access-Control-Allow-Credentials", "true");
  }

  return headers;
}

/**
 * Handle CORS preflight requests
 */
export function handleCors(
  request: Request,
  options?: CorsOptions
): NextResponse | null {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(options),
    });
  }

  return null; // Not a preflight request
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  options?: CorsOptions
): NextResponse {
  const corsHeadersMap = corsHeaders(options);
  corsHeadersMap.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}
