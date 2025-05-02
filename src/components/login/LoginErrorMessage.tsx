
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface LoginErrorMessageProps {
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
}

const LoginErrorMessage: React.FC<LoginErrorMessageProps> = ({ errorMessage, setErrorMessage }) => {
  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, setErrorMessage]);

  if (!errorMessage) return null;
  
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
      {errorMessage}
      <Button 
        variant="ghost" 
        size="sm" 
        className="ml-2 text-red-500" 
        onClick={() => setErrorMessage(null)}
      >
        Dismiss
      </Button>
    </div>
  );
};

export default LoginErrorMessage;
