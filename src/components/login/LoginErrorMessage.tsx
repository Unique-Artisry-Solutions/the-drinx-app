
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  if (!errorMessage) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Error</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{errorMessage}</p>
        <div className="flex space-x-2">
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center" 
              onClick={onRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Try Reconnecting</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setErrorMessage(null)}
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default LoginErrorMessage;
