
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoginFormActionsProps {
  isLoading: boolean;
  onForgotPassword?: () => void;
  onSignUpClick?: () => void;
}

const LoginFormActions: React.FC<LoginFormActionsProps> = ({
  isLoading,
  onForgotPassword,
  onSignUpClick
}) => {
  return (
    <div className="space-y-4">
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
      
      <div className="text-center space-y-2">
        {onForgotPassword && (
          <Button 
            type="button" 
            variant="link" 
            onClick={onForgotPassword}
            className="text-sm"
          >
            Forgot your password?
          </Button>
        )}
        
        {onSignUpClick && (
          <div className="text-sm">
            Don't have an account?{' '}
            <Button 
              type="button" 
              variant="link" 
              onClick={onSignUpClick}
              className="p-0 h-auto text-sm"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginFormActions;
