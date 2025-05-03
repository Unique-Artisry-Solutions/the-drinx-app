
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { emergencyResetAllStorage } from '@/utils/sessionCleaner';

export const useLoginState = (pageId: string) => {
  const [requiredUserType, setRequiredUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [connectionTimeoutId, setConnectionTimeoutId] = useState<number | null>(null);
  const [connectionCheckCount, setConnectionCheckCount] = useState(0);
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
    
    // Set a connection health check timeout - progressive intervals
    const timeoutId = window.setTimeout(() => {
      // Check if we're still on the page and seemingly stuck
      console.log(`[LOGIN PAGE ${pageId}] Connection health check triggered`);
      
      // Increment the check count
      setConnectionCheckCount(prev => prev + 1);
      
      // Perform a simple connectivity test to Supabase
      testConnection().catch(err => {
        console.error(`[LOGIN PAGE ${pageId}] Connection test failed:`, err);
        setErrorMessage("Unable to connect to the authentication server. Check your internet connection or try again later.");
      });
    }, connectionCheckCount === 0 ? 5000 : 10000); // First check after 5s, subsequent checks every 10s
    
    setConnectionTimeoutId(timeoutId);
    
    return () => {
      if (connectionTimeoutId) {
        clearTimeout(connectionTimeoutId);
      }
    };
  }, [location, pageId, connectionCheckCount, connectionTimeoutId]);
  
  // Test connection to Supabase with enhanced error handling
  const testConnection = useCallback(async () => {
    try {
      console.log(`[LOGIN PAGE ${pageId}] Testing connection to Supabase... (Attempt #${connectionCheckCount + 1})`);
      
      // Create an AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      // Use invoke method without passing the signal directly
      // The Supabase Functions API doesn't support AbortController signals directly
      const fetchPromise = supabase.functions.invoke('ping_connection', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Race the fetch promise against a timeout promise
      const result = await Promise.race([
        fetchPromise,
        new Promise((_, reject) => {
          // If the timeout triggers before the fetch completes, this will reject
          const abortListener = () => reject(new Error('Connection test timed out'));
          controller.signal.addEventListener('abort', abortListener);
          
          // Clean up the abort listener if fetch completes first
          setTimeout(() => {
            controller.signal.removeEventListener('abort', abortListener);
          }, 0);
        })
      ]);
      
      clearTimeout(timeoutId);
      
      // Now handle the result from the fetch
      const { data, error } = result as { data: any, error: any };
      
      if (error) {
        throw new Error(`Connection test failed: ${error.message}`);
      }
      
      console.log(`[LOGIN PAGE ${pageId}] Connection test successful:`, data);
      
      // If we had an error message before but now connection works, clear it
      if (errorMessage && errorMessage.includes("Unable to connect")) {
        setErrorMessage(null);
      }
      
      return true;
    } catch (error: any) {
      console.error(`[LOGIN PAGE ${pageId}] Connection test error:`, error);
      
      // Add detail to error message based on the type of error
      let errorDetail = '';
      if (error.name === 'AbortError') {
        errorDetail = ': Request timed out';
      } else if (error.name === 'FetchError' || error.message.includes('fetch')) {
        errorDetail = ': Network error';
      }
      
      // Only set error message if we don't already have one or this is the first test
      if (!errorMessage || connectionCheckCount === 0) {
        setErrorMessage(`Unable to connect to the authentication server${errorDetail}. Please check your internet connection or try again later.`);
      }
      
      throw error;
    }
  }, [pageId, connectionCheckCount, errorMessage]);
  
  // Handle retry/reconnect with improved error handling
  const handleRetryConnection = useCallback(async () => {
    setIsRecovering(true);
    console.log(`[LOGIN PAGE ${pageId}] Attempting to recover connection...`);
    
    try {
      // Try our edge function ping first
      await testConnection();
      
      // If that works, try a simple auth check with timeout protection
      const authCheckPromise = supabase.auth.getSession();
      const authTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth session check timed out')), 5000);
      });
      
      const { data, error } = await Promise.race([
        authCheckPromise,
        authTimeoutPromise
      ]) as { data: any, error: any };
      
      if (error) {
        console.error(`[LOGIN PAGE ${pageId}] Recovery session check failed:`, error);
        setErrorMessage('Still unable to connect to authentication service. Please check your internet connection.');
        
        // If we're experiencing consistent issues, offer a reset option
        if (connectionCheckCount >= 2) {
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
      
      // Provide more specific error information based on the error type
      let errorMessage = 'Connection issue persists. Please try again later or check your network settings.';
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          errorMessage = 'Connection timed out. The server might be experiencing high load or network issues.';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setIsRecovering(false);
    }
  }, [pageId, testConnection, connectionCheckCount]);

  return {
    requiredUserType,
    errorMessage,
    setErrorMessage,
    isRecovering,
    handleRetryConnection,
    connectionCheckCount
  };
};
