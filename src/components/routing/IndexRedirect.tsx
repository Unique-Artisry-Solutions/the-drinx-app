
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { getHomePathForUserType } from '@/utils/navigationResolver';

const IndexRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, userType, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return; // Wait for auth to stabilize
    }

    if (isAuthenticated && userType) {
      const homePath = getHomePathForUserType(userType);
      navigate(homePath, { replace: true });
    } else {
      navigate('/landing', { replace: true });
    }
  }, [navigate, isAuthenticated, userType, isLoading]);

  // Show loading while determining where to redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default IndexRedirect;
