import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { clearAllImpersonationState } from '@/utils/impersonationValidator';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

/**
 * Error boundary specifically for impersonation-related errors
 */
class ImpersonationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚨 Impersonation Error Boundary caught an error:', error, errorInfo);
    
    // If it's a module loading error, don't treat it as impersonation error
    if (error.message?.includes('Loading chunk') || error.message?.includes('Loading CSS chunk')) {
      console.log('Module loading error detected, not impersonation related');
      return;
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReturnToAdmin = async () => {
    try {
      // Clear all impersonation state
      clearAllImpersonationState();
      
      // Navigate to admin panel
      window.location.href = '/admin/users';
    } catch (error) {
      console.error('Failed to return to admin:', error);
      // Force reload as fallback
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Impersonation Error
                </h1>
                <p className="text-sm text-muted-foreground">
                  Something went wrong during user impersonation
                </p>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-3 bg-muted rounded text-xs font-mono">
                <div className="text-destructive font-semibold mb-1">Error:</div>
                <div className="text-foreground">{this.state.error.message}</div>
                {this.state.errorInfo?.componentStack && (
                  <div className="mt-2">
                    <div className="text-destructive font-semibold mb-1">Component Stack:</div>
                    <pre className="text-foreground whitespace-pre-wrap text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReturnToAdmin}
                className="w-full"
                variant="default"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Admin Panel
              </Button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              This error occurred during user impersonation. All impersonation state has been cleared.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ImpersonationErrorBoundary;