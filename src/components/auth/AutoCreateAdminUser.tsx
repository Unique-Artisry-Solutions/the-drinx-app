
import React, { useEffect, useState, useRef } from 'react';
import { useTestUserCreation } from './hooks/useTestUserCreation';
import { TEST_CREDENTIALS } from './constants/testUsers';
import { debouncedToast } from '@/utils/debouncedToast';
import { useDevelopmentMode } from '@/hooks/useDevelopmentMode';

const AutoCreateAdminUser: React.FC = () => {
  const { createTestUser } = useTestUserCreation();
  const { isDevelopment, isInitialized } = useDevelopmentMode();
  const [hasCreated, setHasCreated] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const creationAttemptedRef = useRef(false);
  const sessionKey = 'admin_creation_attempted';

  useEffect(() => {
    // Only run in development mode
    if (!isDevelopment || !isInitialized) {
      console.log('AutoCreateAdminUser: Skipping - not in development mode or not initialized', {
        isDevelopment,
        isInitialized
      });
      return;
    }

    // Check if we've already attempted creation in this session
    const sessionAttempted = sessionStorage.getItem(sessionKey);
    if (sessionAttempted || creationAttemptedRef.current || hasCreated) {
      console.log('AutoCreateAdminUser: Skipping - already attempted this session', {
        sessionAttempted: !!sessionAttempted,
        creationAttemptedRef: creationAttemptedRef.current,
        hasCreated
      });
      return;
    }

    const createAdminUser = async () => {
      // Mark that we've attempted creation
      creationAttemptedRef.current = true;
      sessionStorage.setItem(sessionKey, 'true');

      try {
        console.log('AutoCreateAdminUser: Starting admin user creation...');
        await createTestUser(TEST_CREDENTIALS.admin);
        setHasCreated(true);
        
        // Only show toast once per session
        if (!toastShown) {
          setToastShown(true);
          debouncedToast.success(
            'Admin User Created',
            'Admin test account has been created successfully. You can now log in with admin@spiritless.com / admin123',
            { duration: 8000 }
          );
        }
      } catch (error) {
        console.log('AutoCreateAdminUser: Admin user creation failed (likely already exists):', error);
        
        // Show info toast only once per session
        if (!toastShown) {
          setToastShown(true);
          debouncedToast.info(
            'Admin User Ready',
            'Admin account may already exist. Try logging in with admin@spiritless.com / admin123',
            { duration: 5000 }
          );
        }
      }
    };

    createAdminUser();
  }, [createTestUser, hasCreated, isDevelopment, isInitialized, toastShown]);

  return null; // This component doesn't render anything
};

export default AutoCreateAdminUser;
