
import React from 'react';
import UserAuth from '@/components/UserAuth';
import LoginErrorMessage from './LoginErrorMessage';
import { Button } from "@/components/ui/button";
import { emergencyResetAllStorage } from '@/utils/sessionCleaner';

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
  const [showResetButton, setShowResetButton] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState<boolean | null>(null);

  // Show reset button if there's a persistent error
  React.useEffect(() => {
    if (errorMessage) {
      // Show reset option after 5 seconds of error display
      const timer = setTimeout(() => setShowResetButton(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowResetButton(false);
      setResetSuccess(null);
    }
  }, [errorMessage]);

  // Handle emergency reset
  const handleEmergencyReset = () => {
    if (window.confirm("This will clear ALL authentication data and may resolve login issues. Continue?")) {
      setIsResetting(true);
      try {
        const result = emergencyResetAllStorage();
        setResetSuccess(result.success);
        
        if (result.success) {
          // Clear any error messages
          setErrorMessage(null);
          
          // Reload the page after a brief delay
          setTimeout(() => {
            window.location.href = '/login'; // Force a clean reload
          }, 1500);
        } else {
          console.error('Reset failed:', result.message);
        }
      } catch (err) {
        console.error('Error during reset:', err);
        setResetSuccess(false);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
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
        
        {showResetButton && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">Having trouble logging in?</h3>
            
            {resetSuccess === true && (
              <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded text-sm text-green-700">
                Reset successful! Reloading page...
              </div>
            )}
            
            {resetSuccess === false && (
              <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-sm text-red-700">
                Reset failed. Please try refreshing your browser.
              </div>
            )}
            
            <p className="mt-2 text-xs text-gray-500">
              If you're experiencing persistent login issues, clearing your authentication data may help.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleEmergencyReset}
              disabled={isResetting}
            >
              {isResetting ? 'Resetting...' : 'Emergency Authentication Reset'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginContent;
