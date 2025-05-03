
import React from 'react';
import UserAuth from '@/components/UserAuth';
import LoginErrorMessage from './LoginErrorMessage';

interface LoginContentProps {
  requiredUserType: 'individual' | 'establishment' | 'promoter';
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  handleRetryConnection?: () => void;
  isRecovering?: boolean;
}

const LoginContent: React.FC<LoginContentProps> = ({ 
  requiredUserType, 
  errorMessage, 
  setErrorMessage,
  handleRetryConnection,
  isRecovering
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {errorMessage && (
          <LoginErrorMessage 
            errorMessage={errorMessage} 
            setErrorMessage={setErrorMessage} 
            onRetry={handleRetryConnection}
          />
        )}
        
        <UserAuth 
          defaultTab="login"
          userType={requiredUserType}
          onSuccess={() => {
            // Clear any error messages on successful login
            if (errorMessage) {
              setErrorMessage(null);
            }
          }}
        />
        
        {isRecovering && (
          <div className="mt-4 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-spiritless-pink border-t-transparent rounded-full mr-2"></div>
              <span>Attempting to reconnect...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginContent;
