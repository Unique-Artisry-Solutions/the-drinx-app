
import React, { useState } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import LoginFormFields from './login/LoginFormFields';
import LoginFormActions from './login/LoginFormActions';
import { supabase } from '@/lib/supabase';
import { enableAdminBypass, redirectAfterLogin } from '@/utils/adminBypass';

interface LoginFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  userType?: 'individual' | 'establishment' | 'promoter';
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onClose, 
  userType = 'individual' 
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

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
          
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/admin/system-breakdown', { replace: true });
          }
          return;
        } else {
          throw new Error('Invalid admin credentials');
        }
      } else {
        console.log(`Attempting regular login with identifier: ${identifier}`);
        const isEmail = identifier.includes('@');
        
        if (isEmail) {
          console.log("Logging in with email");
          const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password
          });
          
          if (error) {
            throw error;
          }
          
          if (!data.user.email_confirmed_at) {
            console.log("Email not verified");
            setShowResendVerification(true);
            throw new Error('Email not verified. Please check your inbox for the verification link.');
          }
          
          handleLoginSuccess(data.user);
        } else {
          // This is a simplified mock version for demo purposes
          // In production, you'd need a proper username lookup 
          console.log("Username login not supported in this version");
          throw new Error('Username login is not supported. Please use your email address.');
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
  
  const handleLoginSuccess = (user: any) => {
    console.log("Login successful:", user);
    
    localStorage.setItem('user_authenticated', 'true');
    localStorage.setItem('user_email', user.email || '');
    
    // Extract user_type from metadata if available
    const userType = user.user_metadata?.user_type || 'individual';
    localStorage.setItem('user_type', userType);
    
    // Extract username from metadata if available
    if (user.user_metadata?.username) {
      localStorage.setItem('user_username', user.user_metadata.username);
    }
    
    toast({
      title: 'Login successful',
      description: 'Welcome back!',
    });
    
    if (onSuccess) {
      onSuccess();
    } else {
      redirectAfterLogin();
    }
  };

  const handleBypassLogin = async (type: 'individual' | 'establishment' | 'admin' | 'promoter') => {
    console.log(`Initiating bypass login for ${type} user type`);
    
    try {
      // Enable the bypass with the specified user type
      enableAdminBypass(type);
      
      toast({
        title: 'Bypass Login Activated',
        description: `You are now logged in as ${type === 'admin' ? 'an administrator' : 
          type === 'individual' ? 'a user' : 
          type === 'promoter' ? 'a promoter' :
          'a business'} for testing purposes.`,
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Use the unified redirect function
        redirectAfterLogin();
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

  return (
    <form onSubmit={handleLogin}>
      <CardContent>
        <LoginFormFields 
          identifier={identifier}
          setIdentifier={setIdentifier}
          password={password}
          setPassword={setPassword}
          formError={formError}
          showResendVerification={showResendVerification}
          isResendingEmail={isResendingEmail}
          handleResendVerification={handleResendVerification}
          isAdminLogin={isAdminLogin}
          toggleAdminLogin={toggleAdminLogin}
        />
      </CardContent>
      
      <CardFooter>
        <LoginFormActions 
          isLoading={false}
          isSubmitting={isSubmitting}
          isAdminLogin={isAdminLogin}
          userType={userType}
          onClose={onClose}
          onBypassLogin={handleBypassLogin}
        />
      </CardFooter>
    </form>
  );
};

export default LoginForm;
