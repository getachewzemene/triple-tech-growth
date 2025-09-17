import { getServerSession } from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * NextAuth configuration with credential-based authentication
 * In production, consider adding OAuth providers
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          // For demo purposes, we'll use a simple password check
          // In production, use bcrypt.compare with hashed passwords
          const isValid = credentials.password === 'triple123' && user.isAdmin;

          if (isValid) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              isAdmin: user.isAdmin,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
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
    signIn: '/admin/login',
  },
};

/**
 * Server-side function to check if user is authenticated and has admin privileges
 * Use this in API routes that require admin access
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Authentication required');
  }

  if (!(session.user as any).isAdmin) {
    throw new Error('Admin privileges required');
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
    throw new Error('Authentication required');
  }

  return session.user;
}

/**
 * Check if user has access to a specific course
 * Admins have access to all courses, regular users need enrollment
 */
export async function checkCourseAccess(userId: string, courseId: string): Promise<boolean> {
  try {
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.isAdmin) {
      return true;
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return enrollment?.status === 'approved';
  } catch (error) {
    console.error('Error checking course access:', error);
    return false;
  }
}

/**
 * Get user's active playback sessions for concurrent stream limiting
 */
export async function getActivePlaybackSessions(userId: string): Promise<number> {
  try {
    const activeSessions = await prisma.playbackSession.count({
      where: {
        userId,
        isActive: true,
        lastActiveAt: {
          // Consider sessions active if last activity was within 5 minutes
          gte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    return activeSessions;
  } catch (error) {
    console.error('Error getting active sessions:', error);
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
    await prisma.playbackSession.upsert({
      where: { sessionId },
      update: {
        lastActiveAt: new Date(),
        isActive: true,
        userAgent,
        ipAddress,
      },
      create: {
        userId,
        courseId,
        sessionId,
        userAgent,
        ipAddress,
        isActive: true,
      },
    });
  } catch (error) {
    console.error('Error creating playback session:', error);
    throw new Error('Failed to create playback session');
  }
}

/**
 * Deactivate a playback session
 */
export async function deactivatePlaybackSession(sessionId: string): Promise<void> {
  try {
    await prisma.playbackSession.update({
      where: { sessionId },
      data: { isActive: false },
    });
  } catch (error) {
    console.error('Error deactivating session:', error);
    // Don't throw as this is cleanup
  }
}

/**
 * Cleanup old inactive sessions
 * Call this periodically to maintain database hygiene
 */
export async function cleanupOldSessions(): Promise<void> {
  try {
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    await prisma.playbackSession.deleteMany({
      where: {
        OR: [
          { isActive: false },
          { lastActiveAt: { lt: cutoffDate } },
        ],
      },
    });
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
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
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}