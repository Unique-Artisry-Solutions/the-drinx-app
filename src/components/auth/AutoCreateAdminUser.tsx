import React, { useEffect } from 'react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { supabaseClient } from '@/lib/supabaseClient';

const AutoCreateAdminUser: React.FC = () => {
  const { isDevelopment, isInitialized } = useDevelopmentMode();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isDevelopment || !isInitialized || isLoading) return;
    
    const createAdminUser = async () => {
      if (user?.user_metadata?.user_type === 'admin') return;
      
      try {
        const { data: existingAdmin } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('user_type', 'admin')
          .single();
          
        if (!existingAdmin) {
          console.log('Creating dev admin user...');
          // Create admin user logic here
        }
      } catch (error) {
        console.error('Error checking/creating admin user:', error);
      }
    };

    createAdminUser();
  }, [isDevelopment, isInitialized, isLoading, user]);

  return null;
};

export default AutoCreateAdminUser;
