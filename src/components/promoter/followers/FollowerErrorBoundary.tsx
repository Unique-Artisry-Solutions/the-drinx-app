
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface FollowerErrorBoundaryProps {
  error?: Error | string | null;
  onRetry?: () => void;
  fallback?: React.ReactNode;
  showDetails?: boolean;
}

const FollowerErrorBoundary: React.FC<FollowerErrorBoundaryProps> = ({
  error,
  onRetry,
  fallback,
  showDetails = false
}) => {
  if (!error) return null;

  if (fallback) {
    return <>{fallback}</>;
  }

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{errorMessage}</p>
        {showDetails && typeof error === 'object' && (
          <details className="text-xs">
            <summary>Error details</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default FollowerErrorBoundary;
