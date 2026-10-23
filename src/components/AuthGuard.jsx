import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, hasRole } from '../utils/auth';

/**
 * AuthGuard Component
 * 
 * Enforces both authentication and role-based authorization for protected routes.
 * 
 * Flow:
 * 1. If not logged in -> redirect to /login
 * 2. If logged in but role not allowed -> redirect to /access-denied
 * 3. If authorized -> render child component
 */
export default function AuthGuard({ children, allowedRoles }) {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();

  if (!authenticated || !currentUser) {
    // Preserve attempted URL to enable post-login redirect if needed
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If specific roles are required, verify match
  if (allowedRoles && allowedRoles.length > 0) {
    const isAuthorized = hasRole(allowedRoles);

    if (!isAuthorized) {
      return (
        <Navigate
          to="/access-denied"
          state={{
            attemptedPath: location.pathname,
            userRole: currentUser.role,
            userName: currentUser.name,
            allowedRoles: Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles],
          }}
          replace
        />
      );
    }
  }

  return children;
}
