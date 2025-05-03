
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const useLoginState = (pageId: string) => {
  const [requiredUserType, setRequiredUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const location = useLocation();
  
  // Check for userType in the location state
  useEffect(() => {
    const state = location.state as { 
      userType?: 'individual' | 'establishment' | 'promoter', 
      message?: string 
    };

    console.log(`[LOGIN PAGE ${pageId}] Location state:`, state);
    
    if (state?.userType) {
      console.log(`[LOGIN PAGE ${pageId}] Setting required user type from state:`, state.userType);
      setRequiredUserType(state.userType);
    }
    
    // If there's a redirect message, display it
    if (state?.message) {
      setErrorMessage(state.message);
    }
  }, [location, pageId]);
  
  // Handle retry/reconnect
  const handleRetryConnection = useCallback(async () => {
    setIsRecovering(true);
    console.log(`[LOGIN PAGE ${pageId}] Attempting to recover connection...`);
    
    try {
      // Try a simple healthcheck request
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error(`[LOGIN PAGE ${pageId}] Recovery connection test failed:`, error);
        setErrorMessage('Still unable to connect. Please check your internet connection.');
      } else {
        console.log(`[LOGIN PAGE ${pageId}] Recovery connection test successful`);
        setErrorMessage(null);
      }
    } catch (error) {
      console.error(`[LOGIN PAGE ${pageId}] Error during recovery:`, error);
      setErrorMessage('Connection issue persists. Please try again later.');
    } finally {
      setIsRecovering(false);
    }
  }, [pageId]);

  return {
    requiredUserType,
    errorMessage,
    setErrorMessage,
    isRecovering,
    handleRetryConnection
  };
};
