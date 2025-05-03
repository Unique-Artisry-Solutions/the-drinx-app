
import React, { useEffect } from 'react';
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
    handleBypassLogin,
    resetError,
    attemptRecovery
  } = useLoginForm(onSuccess, onClose, userType);

  // Log form render for debugging
  const formId = React.useId();
  
  useEffect(() => {
    console.log(`[LOGIN FORM ${formId}] Rendering login form for userType: ${userType}`);
    
    // Clear any stuck login attempts on component mount
    const stuckLogin = localStorage.getItem('login_stuck_timestamp');
    if (stuckLogin) {
      const stuckTime = parseInt(stuckLogin);
      const now = Date.now();
      // If login has been stuck for more than 1 minute, clear it
      if (now - stuckTime > 60000) {
        console.log(`[LOGIN FORM ${formId}] Clearing stuck login state`);
        localStorage.removeItem('login_stuck_timestamp');
        localStorage.removeItem('login_attempt_id');
        localStorage.removeItem('login_attempt_timestamp');
        // Also make sure the global loading state is cleared
        window.isLoading = false;
      }
    }
    
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
    
    return () => {
      // Clear any potential stuck states when form unmounts
      localStorage.removeItem('login_stuck_timestamp');
    };
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
          resetError={resetError}
          attemptRecovery={attemptRecovery}
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
