
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
        if (identifier === 'admin@spiritless.com' && password === 'admin123') {
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
        const isEmail = identifier.includes('@');
        
        if (isEmail) {
          await signIn(identifier, password);
        } else {
          const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', identifier)
            .single();
            
          if (error || !data) {
            throw new Error('Username not found');
          }
            
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(data.id);
          
          if (userError || !userData.user) {
            throw new Error('User not found');
          }
            
          await signIn(userData.user.email || '', password);
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

  const handleBypassLogin = (type: 'individual' | 'establishment' | 'promoter' | 'admin') => {
    // Set admin bypass in localStorage
    localStorage.setItem('admin_bypass', 'true');
    localStorage.setItem('user_authenticated', 'true');
    localStorage.setItem('user_type', type);
    
    if (type === 'admin') {
      localStorage.setItem('user_email', 'admin@spiritless.com');
      localStorage.setItem('user_username', 'admin');
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_username', 'Admin');
      localStorage.setItem('admin_session_created', new Date().toISOString());
    } else if (type === 'promoter') {
      localStorage.setItem('user_email', 'bypass-promoter@spiritless.com');
      localStorage.setItem('user_username', 'bypass-promoter');
      localStorage.setItem('promoter_name', 'Bypass Promoter');
    } else if (type === 'establishment') {
      localStorage.setItem('user_email', 'bypass-business@example.com');
      localStorage.setItem('user_username', 'bypass-business');
      localStorage.setItem('establishment_name', 'Bypass Establishment');
    } else {
      localStorage.setItem('user_email', 'bypass-user@example.com');
      localStorage.setItem('user_username', 'bypass-user');
    }
    
    // Force a refresh of the session to apply bypass
    refreshSession().then(() => {
      toast({
        title: 'Admin Bypass Enabled',
        description: `You are now logged in as ${type === 'admin' ? 'an administrator' : 
          type === 'individual' ? 'a user' : 
          type === 'promoter' ? 'a promoter' :
          'a business'} for testing purposes.`,
      });
      
      console.log("Bypass login activated for type:", type);
      
      // Check for saved redirect
      const savedRedirect = localStorage.getItem('auth_redirect');
      localStorage.removeItem('auth_redirect');
      
      // Redirect based on user type or saved path
      if (savedRedirect) {
        navigate(savedRedirect);
      } else if (type === 'admin') {
        navigate('/admin/system-breakdown');
      } else if (type === 'establishment') {
        navigate('/establishment/dashboard');
      } else if (type === 'promoter') {
        navigate('/promoter/dashboard');
      } else {
        navigate('/explore');
      }
    });
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
