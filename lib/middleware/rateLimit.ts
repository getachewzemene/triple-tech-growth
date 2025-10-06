import { NextResponse } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production for distributed systems)
const store: RateLimitStore = {};

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

/**
 * Simple rate limiting middleware
 * For production, consider using Redis or a dedicated rate limiting service
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = {
    interval: 60000, // 1 minute
    uniqueTokenPerInterval: 10,
  }
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now();
  const tokenKey = identifier;

  if (!store[tokenKey] || store[tokenKey].resetTime < now) {
    store[tokenKey] = {
      count: 0,
      resetTime: now + config.interval,
    };
  }

  store[tokenKey].count += 1;

  const success = store[tokenKey].count <= config.uniqueTokenPerInterval;
  const remaining = Math.max(
    0,
    config.uniqueTokenPerInterval - store[tokenKey].count
  );

  return {
    success,
    limit: config.uniqueTokenPerInterval,
    remaining,
    reset: store[tokenKey].resetTime,
  };
}

/**
 * Rate limit middleware for API routes
 */
export async function withRateLimit(
  request: Request,
  config?: RateLimitConfig
): Promise<NextResponse | null> {
  // Get identifier from IP or user session
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  
  const result = await rateLimit(ip, config);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toString(),
          "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null; // No rate limit hit, continue
}
