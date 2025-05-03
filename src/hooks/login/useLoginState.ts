
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { emergencyResetAllStorage } from '@/utils/sessionCleaner';

export const useLoginState = (pageId: string) => {
  const [requiredUserType, setRequiredUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [connectionTimeoutId, setConnectionTimeoutId] = useState<number | null>(null);
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
    
    // Set a connection health check timeout
    const timeoutId = window.setTimeout(() => {
      // Check if we're still on the page and seemingly stuck
      console.log(`[LOGIN PAGE ${pageId}] Connection health check triggered`);
      
      // Perform a simple connectivity test to Supabase
      testConnection().catch(err => {
        console.error(`[LOGIN PAGE ${pageId}] Connection test failed:`, err);
        setErrorMessage("Unable to connect to the authentication server. Check your internet connection or try again later.");
      });
    }, 5000); // 5 seconds timeout
    
    setConnectionTimeoutId(timeoutId);
    
    return () => {
      if (connectionTimeoutId) {
        clearTimeout(connectionTimeoutId);
      }
    };
  }, [location, pageId]);
  
  // Test connection to Supabase
  const testConnection = useCallback(async () => {
    try {
      console.log(`[LOGIN PAGE ${pageId}] Testing connection to Supabase...`);
      
      // Try calling the ping edge function with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      // Use invoke instead of directly accessing the URL
      const { data, error } = await supabase.functions.invoke('ping_connection', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (error) {
        throw new Error(`Connection test failed: ${error.message}`);
      }
      
      console.log(`[LOGIN PAGE ${pageId}] Connection test successful:`, data);
      return true;
    } catch (error: any) {
      console.error(`[LOGIN PAGE ${pageId}] Connection test error:`, error);
      if (error.name === 'AbortError') {
        throw new Error('Connection test timed out');
      }
      throw error;
    }
  }, [pageId]);
  
  // Handle retry/reconnect with improved error handling
  const handleRetryConnection = useCallback(async () => {
    setIsRecovering(true);
    console.log(`[LOGIN PAGE ${pageId}] Attempting to recover connection...`);
    
    try {
      // Try our edge function ping first
      await testConnection();
      
      // If that works, try a simple auth check
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error(`[LOGIN PAGE ${pageId}] Recovery session check failed:`, error);
        setErrorMessage('Still unable to connect to authentication service. Please check your internet connection.');
        
        // If we still have issues, consider a storage reset to break any potential loops
        const shouldReset = window.confirm(
          'Would you like to reset your authentication state? This can help resolve persistent login issues.'
        );
        
        if (shouldReset) {
          const resetResult = emergencyResetAllStorage();
          if (resetResult.success) {
            window.location.href = '/login'; // Reload the login page
          } else {
            console.error(`[LOGIN PAGE ${pageId}] Reset failed:`, resetResult.message);
          }
        }
      } else {
        console.log(`[LOGIN PAGE ${pageId}] Recovery connection test successful`);
        setErrorMessage(null);
        
        // If we have a current session, refresh the page to ensure clean state
        if (data.session) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(`[LOGIN PAGE ${pageId}] Error during recovery:`, error);
      setErrorMessage('Connection issue persists. Please try again later or check your network settings.');
    } finally {
      setIsRecovering(false);
    }
  }, [pageId, testConnection]);

  return {
    requiredUserType,
    errorMessage,
    setErrorMessage,
    isRecovering,
    handleRetryConnection
  };
};
