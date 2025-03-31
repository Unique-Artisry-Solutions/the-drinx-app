
import React from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import LoginFormFields from './login/LoginFormFields';
import LoginFormActions from './login/LoginFormActions';
import { useLoginForm } from './login/useLoginForm';

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
        />
      </CardFooter>
    </form>
  );
};

export default LoginForm;
