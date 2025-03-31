
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

const EmailVerificationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSession, isEmailVerified } = useAuth();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      console.log('Email verification handler triggered', location.search);
      setIsChecking(true);
      
      // Check for email_confirmed in URL parameter
      if (location.search.includes('email_confirmed=true')) {
        console.log('Email confirmed parameter detected');
        
        try {
          // Refresh the session to get the updated verification status
          await refreshSession();
          
          toast({
            title: 'Email verified successfully',
            description: 'Your email has been verified. You can now access all features.',
          });
          
          // Explicitly redirect to explore page
          console.log('Redirecting to explore page');
          navigate('/explore', { replace: true });
        } catch (error) {
          console.error('Error during email confirmation:', error);
          toast({
            title: 'Verification error',
            description: 'There was a problem verifying your email. Please try again.',
            variant: 'destructive',
          });
        }
      }
      
      setIsChecking(false);
    };
    
    handleEmailConfirmation();
  }, [location, refreshSession, navigate, toast]);
  
  return null;
};

export default EmailVerificationHandler;
