"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthModal } from "@/app/providers/AuthModalProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    if (!isAuthenticated) {
      // Open the global authentication modal instead of redirecting
      try {
        openAuthModal("login");
      } catch (e) {
        // Fallback to redirect if modal provider is not present
        router.push(requireAdmin ? "/admin/login" : "/");
      }
      return;
    }

    if (requireAdmin && !user?.isAdmin) {
      router.push("/admin/login");
      return;
    }
  }, [isAuthenticated, user, requireAdmin, router, openAuthModal]);

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !user?.isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
