
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const EmailVerificationHandler = () => {
  const location = useLocation();
  const { refreshSession } = useAuth();
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      if (location.search.includes('email_confirmed=true')) {
        await refreshSession();
        // Redirect will be handled in AuthContext
      }
    };
    
    handleEmailConfirmation();
  }, [location, refreshSession]);
  
  return null;
};

export default EmailVerificationHandler;
