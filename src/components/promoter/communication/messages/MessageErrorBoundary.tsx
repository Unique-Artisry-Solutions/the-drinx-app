
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Props {
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
}

const MessageErrorBoundary: React.FC<Props> = ({ error, onRetry, children }) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
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
