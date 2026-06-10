import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { hasRoutePermission } from '../config/permissions';
import { ForbiddenView } from '../pages/ForbiddenView';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication and/or specific role permissions.
 * 
 * Behavior:
 * - If user is not authenticated → redirect to /login with return URL
 * - If user is authenticated but lacks permission → show 403 Forbidden page
 * - If user has permission → render children
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Wait for auth restoration to finish before deciding redirect.
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-600">
        Loading session...
      </div>
    );
  }

  // Not authenticated - redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has permission for this route
  const hasPermission = hasRoutePermission(location.pathname, user?.role || null);

  // Authenticated but no permission - show 403 page
  if (!hasPermission) {
    return <ForbiddenView />;
  }

  // Has permission - render the protected content
  return <>{children}</>;
}
