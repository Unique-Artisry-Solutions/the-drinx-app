
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
      
      if (location.search.includes('email_confirmed=true')) {
        console.log('Email confirmed parameter detected');
        // Refresh the session to get the updated verification status
        await refreshSession();
        
        toast({
          title: 'Email verified successfully',
          description: 'Your email has been verified. You can now sign in.',
        });
        
        // Redirect to explore page
        navigate('/explore');
      }
      
      setIsChecking(false);
    };
    
    handleEmailConfirmation();
  }, [location, refreshSession, navigate, toast]);
  
  // This component doesn't render anything visible
  return null;
};

export default EmailVerificationHandler;
