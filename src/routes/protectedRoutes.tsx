
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'admin' | 'establishment' | 'promoter' | 'individual';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const { isDevelopment, devMode } = useDevelopmentMode();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // In development mode, allow dev bypass
  if (isDevelopment && devMode) {
    // If a specific user type is required, check dev mode matches
    if (requiredUserType && devMode !== requiredUserType) {
      return <Navigate to="/debug" replace />;
    }
    return <>{children}</>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required user type
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/explore" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
