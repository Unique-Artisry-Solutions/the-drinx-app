
import React, { useEffect, useState } from 'react';
import { useTestUserCreation } from './hooks/useTestUserCreation';
import { TEST_CREDENTIALS } from './constants/testUsers';
import { debouncedToast } from '@/utils/debouncedToast';

const AutoCreateAdminUser: React.FC = () => {
  const { createTestUser } = useTestUserCreation();
  const [hasCreated, setHasCreated] = useState(false);

  useEffect(() => {
    const createAdminUser = async () => {
      if (hasCreated) return;
      
      try {
        console.log('Auto-creating admin user...');
        await createTestUser(TEST_CREDENTIALS.admin);
        setHasCreated(true);
        
        debouncedToast.success(
          'Admin User Created',
          'Admin test account has been created successfully. You can now log in with admin@spiritless.com / admin123',
          { duration: 8000 }
        );
      } catch (error) {
        console.error('Failed to create admin user:', error);
        debouncedToast.info(
          'Admin User Ready',
          'Admin account may already exist. Try logging in with admin@spiritless.com / admin123',
          { duration: 5000 }
        );
      }
    };

    createAdminUser();
  }, [createTestUser, hasCreated]);

  return null; // This component doesn't render anything
};

export default AutoCreateAdminUser;
