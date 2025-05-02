
import React from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import LoginFormFields from './login/LoginFormFields';
import LoginFormActions from './login/LoginFormActions';
import { useLoginForm } from './login/useLoginForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshSession } = useAuth();
  
  const {
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
  } = useLoginForm(onSuccess, onClose, userType);

  const handleBypassLogin = async (type: 'individual' | 'establishment' | 'admin' | 'promoter') => {
    console.log(`Initiating bypass login for ${type} user type`);
    
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
      
      // Check for saved redirect path
      const savedRedirect = localStorage.getItem('auth_redirect');
      console.log("Saved redirect path:", savedRedirect);
      
      // Clear the saved redirect as we're handling it now
      localStorage.removeItem('auth_redirect');
      
      // Redirect based on user type
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
          isLoading={isLoading}
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
