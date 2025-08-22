import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandling';

interface Props {
  error: unknown;
  onRetry: () => void;
  children: React.ReactNode;
}

const MessageErrorBoundary: React.FC<Props> = ({ error, onRetry, children }) => {
  if (error) {
    const errorMessage = getErrorMessage(error);
    
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex items-center justify-between">
          <span>{errorMessage}</span>
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default MessageErrorBoundary;