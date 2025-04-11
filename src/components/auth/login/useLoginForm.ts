import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        
        if (onSuccess) {
          onSuccess();
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
