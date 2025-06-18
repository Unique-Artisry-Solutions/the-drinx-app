
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { Layout } from '@/components/Layout';

interface RouteProtectionWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: ('individual' | 'establishment' | 'promoter' | 'admin')[];
  redirectTo?: string;
}

const RouteProtectionWrapper: React.FC<RouteProtectionWrapperProps> = ({
  children,
  requireAuth = false,
  allowedUserTypes = [],
  redirectTo = '/landing'
}) => {
  const location = useLocation();
  const { isDevelopment, isInitialized } = useDevelopmentMode();
  const { userType, isAuthenticated, isLoading } = useDevAuthBypass();

  // Show loading while auth is being determined
  if (isLoading || !isInitialized) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check user type restrictions
  if (allowedUserTypes.length > 0 && userType && !allowedUserTypes.includes(userType)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Wrap protected content with Layout
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default RouteProtectionWrapper;
