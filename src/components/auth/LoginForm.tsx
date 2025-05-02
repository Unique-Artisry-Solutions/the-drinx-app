
import React from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import LoginFormFields from './login/LoginFormFields';
import LoginFormActions from './login/LoginFormActions';
import { useLoginForm } from './login/useLoginForm';

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
    handleLogin,
    handleBypassLogin
  } = useLoginForm(onSuccess, onClose, userType);

  // Log form render for debugging
  const formId = React.useId();
  React.useEffect(() => {
    console.log(`[LOGIN FORM ${formId}] Rendering login form for userType: ${userType}`);
    
    // Check URL parameters for debug mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug_auth') === 'true') {
      console.log(`[LOGIN FORM ${formId}] Auth debugging enabled. Current localStorage:`, {
        userAuthenticated: localStorage.getItem('user_authenticated'),
        userType: localStorage.getItem('user_type'),
        adminAuthenticated: localStorage.getItem('admin_authenticated'),
        adminBypass: localStorage.getItem('admin_bypass')
      });
      
      console.log(`[LOGIN FORM ${formId}] Current sessionStorage:`, {
        loginSuccess: sessionStorage.getItem('login_success'),
        loginTimestamp: sessionStorage.getItem('login_success_timestamp'),
        loginUserType: sessionStorage.getItem('login_user_type'),
        loginAttemptId: sessionStorage.getItem('login_attempt_id')
      });
    }
  }, [userType, formId]);

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
