/**
 * Sentry Error Tracking Configuration
 * 
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Uncomment the code below
 * 4. Set SENTRY_DSN in environment variables
 */

/*
import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Adjust this value in production
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      
      // Set sampling rate for profiling
      profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      
      environment: process.env.NODE_ENV,
      
      // Ignore certain errors
      ignoreErrors: [
        "ResizeObserver loop limit exceeded",
        "Non-Error promise rejection captured",
      ],
      
      // Enable Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      integrations: [
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      beforeSend(event, hint) {
        // Filter out certain events
        const error = hint.originalException;
        
        // Don't send errors from bot requests
        if (event.request?.headers?.["user-agent"]?.includes("bot")) {
          return null;
        }
        
        return event;
      },
    });
  }
}

// Helper function to capture exceptions
export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      contexts: context ? { custom: context } : undefined,
    });
  } else {
    console.error("Error captured:", error, context);
  }
}

// Helper function to capture messages
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level}]`, message);
  }
}

// Helper to set user context
export function setUserContext(user: { id: string; email?: string; username?: string }) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser(user);
  }
}

// Helper to clear user context
export function clearUserContext() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser(null);
  }
}
*/

// Placeholder functions when Sentry is not configured
export function initSentry() {
  console.log("Sentry not configured. Install @sentry/nextjs to enable error tracking.");
}

export function captureException(error: Error, context?: Record<string, any>) {
  console.error("Error captured:", error, context);
}

export function captureMessage(message: string, level: string = "info") {
  console.log(`[${level}]`, message);
}

export function setUserContext(user: { id: string; email?: string; username?: string }) {
  console.log("User context set:", user.id);
}

export function clearUserContext() {
  console.log("User context cleared");
}
