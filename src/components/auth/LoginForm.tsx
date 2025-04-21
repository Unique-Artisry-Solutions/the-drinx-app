
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

  const handleBypassLogin = (type: 'individual' | 'establishment' | 'admin' | 'promoter') => {
    // Set admin bypass in localStorage
    localStorage.setItem('admin_bypass', 'true');
    localStorage.setItem('user_authenticated', 'true');
    localStorage.setItem('user_type', type);
    localStorage.setItem('user_email', type === 'admin' ? 'admin@spiritless.com' : 
      type === 'individual' ? 'bypass-user@example.com' : 
      type === 'promoter' ? 'bypass-promoter@spiritless.com' :
      'bypass-business@example.com');
    localStorage.setItem('user_username', type === 'admin' ? 'admin' : 
      type === 'individual' ? 'bypass-user' : 
      type === 'promoter' ? 'bypass-promoter' :
      'bypass-business');
    
    // Set establishment name for establishment users
    if (type === 'establishment') {
      localStorage.setItem('establishment_name', 'Bypass Establishment');
    }
    
    // Set promoter name for promoter users
    if (type === 'promoter') {
      localStorage.setItem('promoter_name', 'Bypass Promoter');
    }
    
    // Set admin authentication flag if it's an admin bypass
    if (type === 'admin') {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_username', 'Admin');
      localStorage.setItem('admin_session_created', new Date().toISOString());
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
      
      // Redirect based on user type
      if (type === 'admin') {
        navigate('/admin/system-breakdown');
      } else if (type === 'establishment') {
        navigate('/establishment/dashboard');
      } else if (type === 'promoter') {
        // Redirect directly to promoter dashboard 
        navigate('/promoter/dashboard');
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
