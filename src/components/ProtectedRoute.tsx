import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // If admin route is required, redirect to admin login
    if (requireAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
    // For regular protected routes, user should see login modal via app logic
    return <Navigate to="/" replace />;
  }

  // Check if admin access is required but user is not admin
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;