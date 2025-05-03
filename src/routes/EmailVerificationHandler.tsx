
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

const EmailVerificationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Log the entire URL and search parameters for debugging
      console.log('Email verification handler triggered with URL:', window.location.href);
      console.log('Search params:', location.search);
      
      setIsChecking(true);
      
      // Check for any of the possible email verification parameters
      // Different Supabase versions might use different parameters
      const hasConfirmation = location.search.includes('email_confirmed=true') || 
                             location.search.includes('type=signup') ||
                             location.search.includes('type=recovery');
      
      if (hasConfirmation) {
        console.log('Email confirmation parameter detected in URL');
        
        try {
          // Refresh the session to get the updated verification status
          const result = await refreshSession();
          console.log('Session refresh result:', result);
          
          // Check if the user is now verified
          if (result.isEmailVerified) {
            console.log('Email is verified, proceeding to explore page');
            
            toast({
              title: 'Email verified successfully',
              description: 'Your email has been verified. You can now access all features.',
            });
            
            // Explicitly redirect to explore page with replace to prevent
            // the user from navigating back to this URL
            console.log('Redirecting to explore page');
            navigate('/explore', { replace: true });
          } else {
            console.log('Email not verified after refresh, staying on current page');
            toast({
              title: 'Verification pending',
              description: 'Your email verification is still being processed. Please try again in a moment.',
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Error during email confirmation:', error);
          toast({
            title: 'Verification error',
            description: 'There was a problem verifying your email. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        console.log('No email confirmation parameter found in URL');
      }
      
      setIsChecking(false);
    };
    
    handleEmailConfirmation();
  }, [location, refreshSession, navigate, toast]);
  
  // Return null as this is a utility component
  return null;
};

export default EmailVerificationHandler;
