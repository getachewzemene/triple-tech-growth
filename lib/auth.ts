import { getServerSession } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

/**
 * NextAuth configuration with credential-based authentication
 * In production, consider adding OAuth providers
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // For demo purposes, use hardcoded admin credentials
          // In production, check against database
          if (
            credentials.email === "admin" &&
            credentials.password === "triple123"
          ) {
            return {
              id: "admin_001",
              email: "admin@tripleacademy.com",
              name: "Admin User",
              isAdmin: true,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};

/**
 * Server-side function to check if user is authenticated and has admin privileges
 * Use this in API routes that require admin access
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  if (!(session.user as any).isAdmin) {
    throw new Error("Admin privileges required");
  }

  return session.user;
}

/**
 * Server-side function to check if user is authenticated
 * Use this in API routes that require any authenticated user
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  return session.user;
}

/**
 * Check if user has access to a specific course
 * Admins have access to all courses, regular users need enrollment
 */
export async function checkCourseAccess(
  userId: string,
  courseId: string,
): Promise<boolean> {
  try {
    // For demo purposes, allow admin access to all courses
    // In production, check database for enrollment status
    return true;
  } catch (error) {
    console.error("Error checking course access:", error);
    return false;
  }
}

/**
 * Get user's active playback sessions for concurrent stream limiting
 */
export async function getActivePlaybackSessions(
  userId: string,
): Promise<number> {
  try {
    // For demo purposes, return 0
    // In production, query database for active sessions
    return 0;
  } catch (error) {
    console.error("Error getting active sessions:", error);
    return 0;
  }
}

/**
 * Create or update a playback session
 */
export async function createPlaybackSession({
  userId,
  courseId,
  sessionId,
  userAgent,
  ipAddress,
}: {
  userId: string;
  courseId: string;
  sessionId: string;
  userAgent?: string;
  ipAddress?: string;
}): Promise<void> {
  try {
    // For demo purposes, just log the session creation
    // In production, save to database
    console.log("Creating playback session:", { userId, courseId, sessionId });
  } catch (error) {
    console.error("Error creating playback session:", error);
    throw new Error("Failed to create playback session");
  }
}

/**
 * Deactivate a playback session
 */
export async function deactivatePlaybackSession(
  sessionId: string,
): Promise<void> {
  try {
    // For demo purposes, just log the deactivation
    // In production, update database
    console.log("Deactivating playback session:", sessionId);
  } catch (error) {
    console.error("Error deactivating session:", error);
    // Don't throw as this is cleanup
  }
}

/**
 * Cleanup old inactive sessions
 * Call this periodically to maintain database hygiene
 */
export async function cleanupOldSessions(): Promise<void> {
  try {
    // For demo purposes, just log the cleanup
    // In production, delete old sessions from database
    console.log("Cleaning up old sessions");
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
  }
}

/**
 * Hash password for storage (use in user registration)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
