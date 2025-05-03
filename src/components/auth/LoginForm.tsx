
import React, { useState, useEffect } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import LoginFormFields from './login/LoginFormFields';
import LoginFormActions from './login/LoginFormActions';
import { supabase } from '@/lib/supabase';
import { enableAdminBypass, redirectAfterLogin } from '@/utils/adminBypass';
import { useAuth } from '@/contexts/auth';

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
  const location = useLocation();
  const { toast } = useToast();
  const { signIn } = useAuth();

  // Check for redirects in location state
  useEffect(() => {
    const state = location.state as { from?: string };
    if (state?.from) {
      console.log("Login page - Setting redirect from location state:", state.from);
      localStorage.setItem('auth_redirect', state.from);
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
          
          // Ensure we finish setting local storage before navigation
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            } else {
              navigate('/admin/system-breakdown', { replace: true });
            }
          }, 100);
          return;
        } else {
          throw new Error('Invalid admin credentials');
        }
      } else {
        console.log(`Attempting regular login with identifier: ${identifier}`);
        
        // Use the signIn method from useAuth
        await signIn(identifier, password);
        console.log("Login successful, preparing to redirect");
        
        // Give the system time to properly set authentication state
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            // Use the unified redirect function with a small delay
            // This ensures that the session is fully established before redirecting
            redirectAfterLogin();
          }
        }, 300);
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
      
      // Ensure bypass settings are applied before navigation
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          // Use the unified redirect function
          redirectAfterLogin();
        }
      }, 100);
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
