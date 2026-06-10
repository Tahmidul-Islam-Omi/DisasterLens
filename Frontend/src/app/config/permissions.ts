import type { Role } from '../types';

// ──────────────────────────────────────────────────────────────
// Route Permissions Configuration
// Defines which roles can access which routes
// ──────────────────────────────────────────────────────────────

/**
 * Public routes - accessible without authentication
 */
export const PUBLIC_ROUTES = [
  '/',
  '/district-weather',
  '/disaster-details',
  '/view-alert',
  '/login',
] as const;

/**
 * Route permissions map
 * Key: route path
 * Value: array of roles that can access the route
 */
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  // Volunteer-only routes
  '/volunteer-dashboard': ['Volunteer'],
  '/log-activity': ['Volunteer'],
  '/field-report': ['Volunteer'],
  '/add-coverage': ['Volunteer'],
  
  // Shared routes: Volunteer + LocalAuthority
  '/community-status': ['Volunteer', 'LocalAuthority'],
  '/missing-persons': ['Volunteer', 'LocalAuthority'],
  
  // LocalAuthority-only routes
  '/volunteer-coverage': ['Volunteer', 'LocalAuthority', 'Admin'],
  '/local-authority-dashboard': ['LocalAuthority'],
  '/volunteer-management': ['LocalAuthority'],
  '/task-management': ['LocalAuthority'],
  '/member-list': ['LocalAuthority'],
  '/community-responses': ['LocalAuthority'],
  '/event-log': ['LocalAuthority'],
  '/notify-community': ['LocalAuthority'],
  
  // Shared routes: LocalAuthority + Admin
  '/create-alert': ['LocalAuthority', 'Admin'],
  
  // Admin-only routes
  '/geospatial-risk': ['Admin'],
  '/infrastructure-exposure': ['Admin'],
  '/vulnerable-communities': ['LocalAuthority', 'Admin'],
  '/risk-pipeline': ['Admin'],
  '/register-authority': ['Admin'],
  '/query': ['Admin'],
  '/impact-summary': ['Admin'],
  '/incident-logs': ['Admin'],
};

/**
 * Check if a route is public (no auth required)
 */
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.includes(path as any);
}

/**
 * Check if a user role has permission to access a route
 */
export function hasRoutePermission(path: string, userRole: Role | null): boolean {
  // Public routes are accessible to everyone
  if (isPublicRoute(path)) {
    return true;
  }

  // If not authenticated, no access to protected routes
  if (!userRole) {
    return false;
  }

  // Check if route has specific permissions
  const allowedRoles = ROUTE_PERMISSIONS[path];
  
  // If route not in permissions map, deny access by default
  if (!allowedRoles) {
    return false;
  }

  // Check if user's role is in the allowed roles
  return allowedRoles.includes(userRole);
}

/**
 * Get the default redirect path for a role after login
 */
export function getDefaultRouteForRole(role: Role): string {
  switch (role) {
    case 'Admin':
      return '/';
    case 'LocalAuthority':
      return '/volunteer-coverage';
    case 'Volunteer':
      return '/volunteer-dashboard';
    default:
      return '/';
  }
}
