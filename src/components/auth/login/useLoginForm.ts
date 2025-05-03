
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';

export const useLoginForm = (onSuccess?: () => void, onClose?: () => void, userType: 'individual' | 'establishment' | 'promoter' = 'individual') => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, isLoading, refreshSession } = useAuth();
  
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

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    setFormError('');
  };

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
      if (isAdminLogin) {
        console.log("Attempting admin login");
        if (identifier === 'admin@spiritless.com' && password === 'admin123') {
          console.log("Admin credentials verified, setting admin session");
          localStorage.setItem('admin_authenticated', 'true');
          localStorage.setItem('admin_username', 'Admin');
          localStorage.setItem('admin_session_created', new Date().toISOString());
          
          toast({
            title: 'Admin login successful',
            description: 'Welcome to the admin dashboard',
          });
          navigate('/admin/dashboard');
          return;
        } else {
          throw new Error('Invalid admin credentials');
        }
      } else {
        console.log(`Attempting regular login with identifier: ${identifier}`);
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
        } else if (savedRedirect) {
          console.log("Redirecting to saved path:", savedRedirect);
          navigate(savedRedirect);
        } else {
          const storedUserType = localStorage.getItem('user_type');
          console.log("Login redirect - user type:", storedUserType);
          
          if (storedUserType === 'establishment') {
            navigate('/establishment/dashboard', { replace: true });
          } else if (storedUserType === 'promoter') {
            navigate('/promoter/dashboard', { replace: true });
          } else {
            navigate('/explore', { replace: true });
          }
        }
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

  const handleBypassLogin = async (type: 'individual' | 'establishment' | 'promoter' | 'admin') => {
    console.log(`Initiating bypass login for ${type} user type from useLoginForm`);
    
    try {
      // Generate a proper UUID for the bypass user
      const bypassUserId = crypto.randomUUID ? crypto.randomUUID() : 'bypass-' + Math.random().toString(36).substring(2, 15);
      
      // Set admin bypass in localStorage with consistent data
      localStorage.setItem('admin_bypass', 'true');
      localStorage.setItem('bypass_user_id', bypassUserId);
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_type', type);
      
      // Consistent email formats
      const email = type === 'admin' ? 'admin@spiritless.com' : 
        type === 'individual' ? 'bypass-user@spiritless.com' : 
        type === 'promoter' ? 'bypass-promoter@spiritless.com' :
        'bypass-establishment@spiritless.com';
        
      localStorage.setItem('user_email', email);
      
      // Consistent username formats
      const username = type === 'admin' ? 'admin' : 
        type === 'individual' ? 'bypass-user' : 
        type === 'promoter' ? 'bypass-promoter' :
        'bypass-establishment';
        
      localStorage.setItem('user_username', username);
      
      // Set appropriate role-specific information
      if (type === 'establishment') {
        localStorage.setItem('establishment_name', 'Bypass Establishment');
      } else if (type === 'promoter') {
        localStorage.setItem('promoter_name', 'Bypass Promoter');
      } else if (type === 'admin') {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_username', 'Admin');
        localStorage.setItem('admin_session_created', new Date().toISOString());
      }
      
      // Force a refresh of the session to apply bypass
      console.log("Refreshing session to apply bypass login");
      await refreshSession();
      
      toast({
        title: 'Bypass Login Activated',
        description: `You are now logged in as ${type === 'admin' ? 'an administrator' : 
          type === 'individual' ? 'a user' : 
          type === 'promoter' ? 'a promoter' :
          'a business'} for testing purposes.`,
      });
      
      // Check for saved redirect
      const savedRedirect = localStorage.getItem('auth_redirect');
      console.log("Saved redirect path:", savedRedirect);
      localStorage.removeItem('auth_redirect');
      
      // Redirect based on user type or saved path
      if (savedRedirect) {
        console.log(`Redirecting to saved path: ${savedRedirect}`);
        navigate(savedRedirect);
      } else if (type === 'admin') {
        console.log("Redirecting to admin dashboard");
        navigate('/admin/system-breakdown');
      } else if (type === 'establishment') {
        console.log("Redirecting to establishment dashboard");
        navigate('/establishment/dashboard');
      } else if (type === 'promoter') {
        console.log("Redirecting to promoter dashboard");
        navigate('/promoter/dashboard');
      } else {
        console.log("Redirecting to explore page");
        navigate('/explore');
      }
    } catch (error) {
      console.error("Error during bypass login:", error);
      toast({
        title: 'Login Error',
        description: 'An error occurred during bypass login. Please try again.',
        variant: 'destructive',
      });
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
    isAdminLogin,
    isLoading,
    toggleAdminLogin,
    handleResendVerification,
    handleLogin,
    handleBypassLogin,
    redirectTo
  };
};
