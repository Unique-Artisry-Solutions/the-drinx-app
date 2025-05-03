
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import LoginFormError from './LoginFormError';

interface LoginFormFieldsProps {
  identifier: string;
  setIdentifier: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  formError: string;
  showResendVerification: boolean;
  isResendingEmail: boolean;
  handleResendVerification: () => void;
  isAdminLogin: boolean;
  toggleAdminLogin: () => void;
  resetError: () => void;
  attemptRecovery?: () => void;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  identifier,
  setIdentifier,
  password,
  setPassword,
  formError,
  showResendVerification,
  isResendingEmail,
  handleResendVerification,
  isAdminLogin,
  toggleAdminLogin,
  resetError,
  attemptRecovery
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="identifier">
          {isAdminLogin ? 'Admin Email' : 'Email or Username'}
        </label>
        <Input
          id="identifier"
          type="text"
          placeholder={isAdminLogin ? "Enter admin email" : "Enter your email or username"}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          autoComplete={isAdminLogin ? "off" : "email"}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
          autoComplete={isAdminLogin ? "off" : "current-password"}
          required
        />
      </div>

      <LoginFormError 
        formError={formError}
        isResendingEmail={isResendingEmail}
        showResendVerification={showResendVerification}
        handleResendVerification={handleResendVerification}
        resetError={resetError}
        attemptRecovery={attemptRecovery}
      />

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="admin-login" 
          checked={isAdminLogin} 
          onCheckedChange={toggleAdminLogin}
          className="data-[state=checked]:bg-spiritless-pink data-[state=checked]:border-spiritless-pink"
        />
        <label
          htmlFor="admin-login"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Admin login
        </label>
      </div>
    </div>
  );
};

export default LoginFormFields;
