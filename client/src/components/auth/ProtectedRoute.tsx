import React, { ReactNode } from 'react';
import { Navigate } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requiredRole?: string;
}

export default function ProtectedRoute({ 
  children, 
  fallback = null, 
  redirectTo = '/login',
  requiredRole
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access if required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Role-based route protection
export const AdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin" redirectTo="/login">
    {children}
  </ProtectedRoute>
);

export const DesignerRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="designer" redirectTo="/login">
    {children}
  </ProtectedRoute>
);

export const ManagerRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="manager" redirectTo="/login">
    {children}
  </ProtectedRoute>
);
