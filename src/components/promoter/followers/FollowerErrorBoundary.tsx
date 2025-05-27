
import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface FollowerErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onRetry?: () => void;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface FollowerErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class FollowerErrorBoundary extends Component<FollowerErrorBoundaryProps, FollowerErrorBoundaryState> {
  constructor(props: FollowerErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<FollowerErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log the error for debugging
    console.error('FollowerErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'An unexpected error occurred';

      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{errorMessage}</p>
            {this.props.showDetails && this.state.errorInfo && (
              <details className="text-xs">
                <summary>Error details</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.error?.stack}
                  {'\n\nComponent Stack:'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            {this.props.onRetry && (
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default FollowerErrorBoundary;
