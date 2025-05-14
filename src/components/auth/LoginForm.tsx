
import React, { useState, useCallback } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import LoginFormFields from './login/LoginFormFields';
import LoginFormActions from './login/LoginFormActions';
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
  const { toast } = useToast();
  const { signIn, sendVerificationEmail } = useAuth();

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
      await sendVerificationEmail(identifier);
      
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

  const performRedirect = useCallback(() => {
    console.log("Preparing to redirect after login success");
    
    // Check for saved redirect path
    const savedRedirect = localStorage.getItem('auth_redirect');
    console.log("Saved redirect path:", savedRedirect);
    
    if (onSuccess) {
      console.log("Using onSuccess callback");
      onSuccess();
    } else if (savedRedirect) {
      console.log("Redirecting to saved path:", savedRedirect);
      navigate(savedRedirect, { replace: true });
      localStorage.removeItem('auth_redirect');
    } else {
      console.log("Using default redirect based on user type");
      // Default redirect based on user type
      const storedUserType = localStorage.getItem('user_type');
      
      if (storedUserType === 'establishment') {
        navigate('/establishment/dashboard', { replace: true });
      } else if (storedUserType === 'promoter') {
        navigate('/promoter/dashboard', { replace: true });
      } else {
        navigate('/explore', { replace: true });
      }
    }
  }, [navigate, onSuccess]);

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
          
          // Redirect to admin dashboard
          navigate('/admin/system-breakdown', { replace: true });
          return;
        } else {
          throw new Error('Invalid admin credentials');
        }
      } else {
        console.log(`Attempting regular login with identifier: ${identifier}`);
        
        // Use the signIn method from useAuth
        const { error } = await signIn(identifier, password);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Login successful',
          description: 'Welcome back!'
        });
        
        // Successful login - redirect happens via the AuthProvider effect
        performRedirect();
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
      
      // Add artificial delay to reduce flickering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Explicitly trigger redirect
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
          isLoading={isSubmitting}
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
