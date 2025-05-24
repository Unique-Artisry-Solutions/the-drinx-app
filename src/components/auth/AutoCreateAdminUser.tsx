import React, { useEffect, useState, useRef } from 'react';
import { useTestUserCreation } from './hooks/useTestUserCreation';
import { TEST_CREDENTIALS } from './constants/testUsers';
import { debouncedToast } from '@/utils/debouncedToast';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

const AutoCreateAdminUser: React.FC = () => {
  const { createTestUser } = useTestUserCreation();
  const { isDevelopment, isInitialized, isStateStable } = useDevelopmentMode();
  const [hasAttempted, setHasAttempted] = useState(false);
  const creationAttemptedRef = useRef(false);
  const toastShownRef = useRef(false);
  const sessionKey = 'admin_creation_attempted';
  const toastSessionKey = 'admin_toast_shown';

  useEffect(() => {
    // Only run in development mode with stable state
    if (!isDevelopment || !isInitialized || !isStateStable) {
      console.log('AutoCreateAdminUser: Skipping - conditions not met', {
        isDevelopment,
        isInitialized,
        isStateStable
      });
      return;
    }

    // Check session storage for previous attempts
    const sessionAttempted = sessionStorage.getItem(sessionKey);
    const sessionToastShown = sessionStorage.getItem(toastSessionKey);
    
    // Skip if already attempted in this session or component instance
    if (sessionAttempted || creationAttemptedRef.current || hasAttempted) {
      console.log('AutoCreateAdminUser: Already attempted in this session');
      return;
    }

    const createAdminUser = async () => {
      // Mark attempt immediately to prevent duplicates
      creationAttemptedRef.current = true;
      setHasAttempted(true);
      sessionStorage.setItem(sessionKey, 'true');

      try {
        console.log('AutoCreateAdminUser: Creating admin user...');
        await createTestUser(TEST_CREDENTIALS.admin);
        
        // Only show success toast if not shown in this session
        if (!sessionToastShown && !toastShownRef.current) {
          toastShownRef.current = true;
          sessionStorage.setItem(toastSessionKey, 'true');
          debouncedToast.success(
            'Admin User Created',
            'Admin test account ready. Login: admin@spiritless.com / admin123',
            { duration: 6000 }
          );
        }
      } catch (error) {
        console.log('AutoCreateAdminUser: Creation failed (likely exists):', error);
        
        // Show minimal info toast only once per session
        if (!sessionToastShown && !toastShownRef.current) {
          toastShownRef.current = true;
          sessionStorage.setItem(toastSessionKey, 'true');
          debouncedToast.info(
            'Admin Account Ready',
            'Login with admin@spiritless.com / admin123',
            { duration: 4000 }
          );
        }
      }
    };

    // Small delay to ensure all components are mounted
    const timeoutId = setTimeout(() => {
      createAdminUser();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [createTestUser, isDevelopment, isInitialized, isStateStable, hasAttempted]);

  return null; // This component doesn't render anything
};

export default AutoCreateAdminUser;
