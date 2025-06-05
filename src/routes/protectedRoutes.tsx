
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'individual' | 'establishment' | 'promoter' | 'admin';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredUserType,
  fallbackPath = '/landing'
}) => {
  const location = useLocation();
  const { isDevelopment, isInitialized } = useDevelopmentMode();
  const { userType, isAuthenticated, isLoading } = useDevAuthBypass();

  // Show loading while auth is being determined
  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check user type if specified
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
