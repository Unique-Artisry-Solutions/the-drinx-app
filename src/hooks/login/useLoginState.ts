
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useLoginState = (pageId: string) => {
  const [requiredUserType, setRequiredUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  return {
    requiredUserType,
    errorMessage,
    setErrorMessage
  };
};
