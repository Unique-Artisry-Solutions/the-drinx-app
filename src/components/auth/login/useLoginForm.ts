
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { supabase } from '@/lib/supabase';

export const useLoginForm = (onSuccess?: () => void, onClose?: () => void, userType: 'individual' | 'establishment' | 'promoter' = 'individual') => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { goToAfterLogin } = useAppNavigation();
  const { toast } = useToast();
  const { signIn, isLoading } = useAuth();
  
  // Check if there's a saved redirect destination
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  
  useEffect(() => {
    // Get any redirect path stored in localStorage
    const savedRedirect = localStorage.getItem('auth_redirect');
    if (savedRedirect) {
      setRedirectTo(savedRedirect);
      console.log("Found saved redirect:", savedRedirect);
    }
    
    // Get any userType from location state
    const locationState = location.state as { userType?: 'individual' | 'establishment' | 'promoter' };
    if (locationState?.userType) {
      console.log("Setting user type from location state:", locationState.userType);
    }
  }, [location]);

  const handleResendVerification = async () => {
    if (!identifier) {
      setFormError('Please enter your email address');
      return;
    }
    
    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: identifier,
        options: {
          emailRedirectTo: `${window.location.origin}/?email_confirmed=true`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link',
      });
    } catch (error: any) {
      console.error("Email verification error:", error);
      setFormError(error.message || 'Failed to resend verification email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    setShowResendVerification(false);
    
    try {
      console.log(`Attempting login with identifier: ${identifier}`);
      const isEmail = identifier.includes('@');
      
      if (isEmail) {
        console.log("Logging in with email");
        await signIn(identifier, password);
        console.log("Email login successful");
      } else {
        console.log("Logging in with username");
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', identifier)
          .single();
          
        if (error || !data) {
          console.error("Username lookup error:", error);
          throw new Error('Username not found');
        }
          
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(data.id);
        
        if (userError || !userData.user) {
          console.error("User lookup error:", userError);
          throw new Error('User not found');
        }
          
        console.log("Username found, attempting login with email");
        await signIn(userData.user.email || '', password);
        console.log("Username login successful");
      }
      
      // Login was successful, check if the user_type matches the expected type
      const loggedInType = localStorage.getItem('user_type');
      console.log(`Login successful, user type is: ${loggedInType}, expected: ${userType}`);
      
      // If userType is specified and doesn't match, attempt to switch roles
      if (userType && loggedInType !== userType && userType !== 'individual') {
        console.log(`User type mismatch, attempting to switch to ${userType} role`);
        try {
          await supabase.rpc('switch_active_role', { role_to_activate: userType });
          localStorage.setItem('user_type', userType);
          console.log(`Successfully switched to ${userType} role`);
        } catch (roleError) {
          console.warn(`Could not switch to ${userType} role:`, roleError);
          // Continue with login even if role switch fails
        }
      }
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      // Clear the saved redirect
      const savedRedirect = localStorage.getItem('auth_redirect');
      localStorage.removeItem('auth_redirect');
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Use the navigation hook for consistent navigation
        goToAfterLogin(localStorage.getItem('user_type'), savedRedirect);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setFormError(error.message || 'Failed to login');
      
      if (error.message.includes('Email not verified')) {
        setShowResendVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    formError,
    isSubmitting,
    isResendingEmail,
    showResendVerification,
    isLoading,
    handleResendVerification,
    handleLogin,
    redirectTo
  };
};
