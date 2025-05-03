
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from "lucide-react";

interface LoginErrorMessageProps {
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  onRetry?: () => void;
}

const LoginErrorMessage: React.FC<LoginErrorMessageProps> = ({ 
  errorMessage, 
  setErrorMessage,
  onRetry 
}) => {
  // Clear error message after 30 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 30000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, setErrorMessage]);

  if (!errorMessage) return null;
  
  // Detect error types for better recovery options
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                        errorMessage.toLowerCase().includes('connection');
  const isTimeoutError = errorMessage.toLowerCase().includes('timeout');
  
  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
      <div className="flex gap-2">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium">{errorMessage}</p>
          
          {(isNetworkError || isTimeoutError) && onRetry && (
            <div className="mt-3">
              <p className="text-sm mb-2">
                {isNetworkError 
                  ? "There seems to be a connection issue with the authentication service." 
                  : "The request timed out. The server might be busy."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-1 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
              >
                <RefreshCw className="h-3 w-3 mr-2" /> Try again
              </Button>
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-100" 
              onClick={() => setErrorMessage(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginErrorMessage;
