'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(requireAdmin ? "/admin/login" : "/");
      return;
    }

    if (requireAdmin && !user?.isAdmin) {
      router.push("/admin/login");
      return;
    }
  }, [isAuthenticated, user, requireAdmin, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !user?.isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;