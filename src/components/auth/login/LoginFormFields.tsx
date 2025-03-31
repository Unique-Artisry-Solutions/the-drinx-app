
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

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
  toggleAdminLogin
}) => {
  return (
    <div className="space-y-4 pt-6">
      {isAdminLogin && (
        <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mb-4">
          <p className="text-sm text-amber-800">
            You are logging in as an administrator
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="identifier">
          Email or Username
        </label>
        <Input
          id="identifier"
          type="text"
          placeholder="Enter your email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <a href="#" className="text-xs text-spiritless-pink hover:text-spiritless-pink/90">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-spiritless-pink/20 focus-visible:ring-spiritless-pink"
        />
      </div>
      
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={toggleAdminLogin}
          className="text-xs text-spiritless-pink hover:text-spiritless-pink/90 p-0 h-auto"
        >
          {isAdminLogin ? 'Switch to user login' : 'Admin login'}
        </Button>
      </div>
      
      {formError && (
        <div className="text-red-500 text-sm mt-2">{formError}</div>
      )}
      
      {showResendVerification && (
        <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
          <p className="text-sm text-amber-800 mb-2">
            Your email is not yet verified. Please check your inbox for the verification link.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={isResendingEmail}
            className="flex items-center text-xs"
          >
            <Mail className="mr-1 h-3 w-3" />
            {isResendingEmail ? 'Sending...' : 'Resend verification email'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginFormFields;
