
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { getHomePathForUserType } from '@/utils/navigationResolver';

const IndexRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, userType, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('IndexRedirect - Auth state:', {
      isLoading,
      isAuthenticated,
      userType,
      hasUser: !!user
    });

    if (isLoading) {
      console.log('IndexRedirect - Still loading, waiting...');
      return; // Wait for auth to stabilize
    }

    if (isAuthenticated && userType) {
      const homePath = getHomePathForUserType(userType);
      console.log('IndexRedirect - Authenticated user, redirecting to:', homePath);
      navigate(homePath, { replace: true });
    } else {
      console.log('IndexRedirect - Unauthenticated user, redirecting to landing');
      navigate('/landing', { replace: true });
    }
  }, [navigate, isAuthenticated, userType, isLoading]);

  // Show loading while determining where to redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
};

export default IndexRedirect;
