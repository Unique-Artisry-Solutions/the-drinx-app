
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useLoginForm = (onSuccess?: () => void, onClose?: () => void, userType: 'individual' | 'establishment' = 'individual') => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, isLoading, refreshSession } = useAuth();

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
        // Admin login logic
        if (identifier === 'admin@spiritless.com' && password === 'admin123') {
          localStorage.setItem('admin_authenticated', 'true');
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
        // Check if identifier is an email or username
        const isEmail = identifier.includes('@');
        
        if (isEmail) {
          // Regular email login
          await signIn(identifier, password);
        } else {
          // Username login - first get the email associated with the username
          const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', identifier)
            .single();
            
          if (error || !data) {
            throw new Error('Username not found');
          }
            
          // Get the user's email from auth.users using the id
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(data.id);
          
          if (userError || !userData.user) {
            throw new Error('User not found');
          }
            
          // Now sign in with the email
          await signIn(userData.user.email || '', password);
        }
        
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect based on user type
          const storedUserType = localStorage.getItem('user_type');
          if (storedUserType === 'establishment') {
            navigate('/', { replace: true });
          } else {
            navigate('/explore', { replace: true });
          }
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setFormError(error.message || 'Failed to login');
      
      // Show resend verification option if email not verified
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
    isAdminLogin,
    isLoading,
    toggleAdminLogin,
    handleResendVerification,
    handleLogin
  };
};
