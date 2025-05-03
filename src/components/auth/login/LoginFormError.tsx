
import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from '@/components/ui/button';

interface LoginFormErrorProps {
  formError: string;
  isResendingEmail: boolean;
  showResendVerification: boolean;
  handleResendVerification: () => void;
  resetError: () => void;
  attemptRecovery?: () => void;
}

const LoginFormError: React.FC<LoginFormErrorProps> = ({
  formError,
  isResendingEmail,
  showResendVerification,
  handleResendVerification,
  resetError,
  attemptRecovery
}) => {
  // Auto-dismiss error after 15 seconds
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => resetError(), 15000);
      return () => clearTimeout(timer);
    }
  }, [formError, resetError]);

  if (!formError) return null;

  // Detect specific error types to provide targeted help
  const isNetworkError = formError.toLowerCase().includes('network') || 
                        formError.toLowerCase().includes('connection');
  const isCredentialsError = formError.toLowerCase().includes('invalid') || 
                            formError.toLowerCase().includes('not found');
  const isTimeoutError = formError.toLowerCase().includes('timeout');

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">{formError}</p>
          
          {showResendVerification && (
            <div className="mt-3">
              <p className="text-xs text-red-700 mb-2">
                Your email address has not been verified yet.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleResendVerification}
                disabled={isResendingEmail}
                className="text-xs h-8 border-red-300 text-red-700 hover:bg-red-50"
              >
                {isResendingEmail ? 'Sending...' : 'Resend verification email'}
              </Button>
            </div>
          )}

          {isNetworkError && attemptRecovery && (
            <div className="mt-3">
              <p className="text-xs text-red-700 mb-2">
                There seems to be a network issue. Try reconnecting.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={attemptRecovery}
                className="text-xs h-8 border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Retry connection
              </Button>
            </div>
          )}

          {isTimeoutError && attemptRecovery && (
            <div className="mt-3">
              <p className="text-xs text-red-700 mb-2">
                The request timed out. The server might be busy.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={attemptRecovery}
                className="text-xs h-8 border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Try again
              </Button>
            </div>
          )}

          {isCredentialsError && (
            <div className="mt-2">
              <p className="text-xs text-red-700">
                Please check your email/username and password and try again.
              </p>
            </div>
          )}

          <Button 
            size="sm" 
            variant="ghost" 
            onClick={resetError}
            className="text-xs h-6 text-red-600 hover:bg-red-100 hover:text-red-700 mt-2"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginFormError;
