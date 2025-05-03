
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { handleAuthRedirect } from '@/utils/redirectUtils';

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
      console.log("[LOGIN HOOK] Found saved redirect:", savedRedirect);
    }
    
    // Get any userType from location state
    const locationState = location.state as { userType?: 'individual' | 'establishment' | 'promoter' };
    if (locationState?.userType) {
      console.log("[LOGIN HOOK] Setting user type from location state:", locationState.userType);
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
      console.error("[LOGIN HOOK] Email verification error:", error);
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
    
    // Generate a unique login attempt ID for tracking this login process
    const loginAttemptId = `login_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[LOGIN ${loginAttemptId}] Starting login process at ${new Date().toISOString()}`);
    console.log(`[LOGIN ${loginAttemptId}] User type requested: ${userType}`);
    
    try {
      if (isAdminLogin) {
        console.log(`[LOGIN ${loginAttemptId}] Attempting admin login`);
        if (identifier === 'admin@spiritless.com' && password === 'admin123') {
          console.log(`[LOGIN ${loginAttemptId}] Admin credentials verified, setting admin session`);
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
        console.log(`[LOGIN ${loginAttemptId}] Attempting regular login with identifier: ${identifier}`);
        const isEmail = identifier.includes('@');
        
        // Set login tracking flags in localStorage for consistent access
        localStorage.setItem('login_attempt_id', loginAttemptId);
        localStorage.setItem('login_attempt_timestamp', Date.now().toString());
        localStorage.setItem('login_requested_usertype', userType);
        
        // Store the auth redirect for later use (after login success)
        const savedRedirect = localStorage.getItem('auth_redirect');
        
        if (isEmail) {
          console.log(`[LOGIN ${loginAttemptId}] Logging in with email`);
          await signIn(identifier, password);
          console.log(`[LOGIN ${loginAttemptId}] Email login successful`);
        } else {
          console.log(`[LOGIN ${loginAttemptId}] Logging in with username`);
          const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', identifier)
            .single();
            
          if (error || !data) {
            console.error(`[LOGIN ${loginAttemptId}] Username lookup error:`, error);
            throw new Error('Username not found');
          }
            
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(data.id);
          
          if (userError || !userData.user) {
            console.error(`[LOGIN ${loginAttemptId}] User lookup error:`, userError);
            throw new Error('User not found');
          }
            
          console.log(`[LOGIN ${loginAttemptId}] Username found, attempting login with email`);
          await signIn(userData.user.email || '', password);
          console.log(`[LOGIN ${loginAttemptId}] Username login successful`);
        }
        
        // Login was successful, check if the user_type matches the expected type
        const loggedInType = localStorage.getItem('user_type');
        console.log(`[LOGIN ${loginAttemptId}] Login successful, user type is: ${loggedInType}, expected: ${userType}`);
        
        // If userType is specified and doesn't match, attempt to switch roles
        if (userType && loggedInType !== userType && userType !== 'individual') {
          console.log(`[LOGIN ${loginAttemptId}] User type mismatch, attempting to switch to ${userType} role`);
          try {
            const { error } = await supabase.rpc('switch_active_role', { role_to_activate: userType });
            if (error) throw error;
            
            // Update localStorage after successful role switch
            localStorage.setItem('user_type', userType);
            console.log(`[LOGIN ${loginAttemptId}] Successfully switched to ${userType} role`);
          } catch (roleError) {
            console.warn(`[LOGIN ${loginAttemptId}] Could not switch to ${userType} role:`, roleError);
            // Continue with login even if role switch fails
          }
        }
        
        // Set login success flags in localStorage for persistence
        localStorage.setItem('login_success', 'true');
        localStorage.setItem('login_success_timestamp', Date.now().toString());
        
        // Store userType at login time
        const storedUserType = localStorage.getItem('user_type');
        localStorage.setItem('login_user_type', storedUserType || '');
        console.log(`[LOGIN ${loginAttemptId}] Stored login user type in localStorage: ${storedUserType}`);
        
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        
        // Handle callback or redirection
        if (onSuccess) {
          onSuccess();
        } else {
          // Use centralized auth redirect handler
          handleAuthRedirect(
            { id: '1' }, // User is authenticated at this point
            navigate,
            {
              savedRedirect,
              userType: storedUserType,
              source: `login_form_${loginAttemptId}`
            }
          );
        }
      }
    } catch (error: any) {
      console.error(`[LOGIN ${loginAttemptId}] Login error:`, error);
      setFormError(error.message || 'Failed to login');
      
      // Clear login tracking flags on error
      localStorage.removeItem('login_attempt_id');
      localStorage.removeItem('login_attempt_timestamp');
      localStorage.removeItem('login_requested_usertype');
      
      if (error.message && error.message.includes('Email not verified')) {
        setShowResendVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBypassLogin = async (type: 'individual' | 'establishment' | 'promoter' | 'admin') => {
    const bypassAttemptId = `bypass_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[BYPASS ${bypassAttemptId}] Initiating bypass login for ${type} user type`);
    
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
      console.log(`[BYPASS ${bypassAttemptId}] Refreshing session to apply bypass login`);
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
      console.log(`[BYPASS ${bypassAttemptId}] Saved redirect path:`, savedRedirect);
      
      // Use centralized auth redirect handler
      handleAuthRedirect(
        { id: bypassUserId }, // Mock user object
        navigate,
        {
          savedRedirect,
          userType: type,
          source: `bypass_${bypassAttemptId}`
        }
      );
    } catch (error) {
      console.error(`[BYPASS ${bypassAttemptId}] Error during bypass login:`, error);
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
