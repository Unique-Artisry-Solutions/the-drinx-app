
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
  userType?: 'individual' | 'establishment';
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

  const handleBypassLogin = (type: 'individual' | 'establishment') => {
    // Set admin bypass in localStorage
    localStorage.setItem('admin_bypass', 'true');
    localStorage.setItem('user_authenticated', 'true');
    localStorage.setItem('user_type', type);
    localStorage.setItem('user_email', type === 'individual' ? 'bypass-user@example.com' : 'bypass-business@example.com');
    localStorage.setItem('user_username', type === 'individual' ? 'bypass-user' : 'bypass-business');
    
    // Force a refresh of the session to apply bypass
    refreshSession().then(() => {
      toast({
        title: 'Admin Bypass Enabled',
        description: `You are now logged in as a ${type === 'individual' ? 'user' : 'business'} for testing purposes.`,
      });
      
      // Redirect based on user type
      if (type === 'establishment') {
        navigate('/');
      } else {
        navigate('/explore');
      }
    });
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
