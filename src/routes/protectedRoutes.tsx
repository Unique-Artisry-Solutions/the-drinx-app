
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

  // Show loading while checking auth - but don't block too long
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  // In development mode, allow dev bypass
  if (isDevelopment && devMode) {
    // If a specific user type is required, check dev mode matches
    if (requiredUserType && devMode !== requiredUserType) {
      console.log('🚫 Dev mode mismatch:', { required: requiredUserType, current: devMode });
      return <Navigate to="/debug" replace />;
    }
    console.log('✅ Dev bypass active for:', devMode);
    return <>{children}</>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required user type
  if (requiredUserType && userType !== requiredUserType) {
    console.log('🚫 User type mismatch:', { required: requiredUserType, current: userType });
    return <Navigate to="/explore" replace />;
  }

  console.log('✅ Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
