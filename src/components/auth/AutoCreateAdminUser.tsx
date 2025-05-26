
import React, { useEffect } from 'react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';

const AutoCreateAdminUser: React.FC = () => {
  const { isDevelopment, isInitialized } = useDevelopmentMode();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isDevelopment || !isInitialized || isLoading || user?.user_metadata?.user_type === 'admin') {
      return;
    }
    
    // Dev admin creation would go here if needed
    console.log('Dev mode active - admin creation available');
  }, [isDevelopment, isInitialized, isLoading, user]);

  return null;
};

export default AutoCreateAdminUser;
