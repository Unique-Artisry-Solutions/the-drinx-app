import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { restoreImpersonation } from '@/utils/impersonation';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ImpersonationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ImpersonationErrorBoundary caught an error:', error, errorInfo);
    
    // Check if this is a module loading error - these should not trigger impersonation error handling
    if (error.message.includes('loading dynamically imported module') || 
        error.message.includes('Loading chunk') ||
        error.message.includes('Import error')) {
      console.warn('Module loading error detected - this should be handled by a different error boundary');
      // For module loading errors, just retry without showing impersonation error
      setTimeout(() => {
        this.handleRetry();
      }, 1000);
      return;
    }
    
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReturnToAdmin = () => {
    try {
      restoreImpersonation();
    } catch (error) {
      console.error('Failed to restore impersonation:', error);
      window.location.href = '/admin/users';
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <CardTitle>Impersonation Error</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                An error occurred during user impersonation. This could be due to session conflicts or authentication issues.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="p-3 bg-muted rounded text-sm">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <div className="mt-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div className="mt-2">
                      <strong>Stack:</strong>
                      <pre className="text-xs mt-1 overflow-auto whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </details>
              )}
              
              <div className="space-y-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.handleReturnToAdmin}
                  className="w-full"
                  variant="outline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Admin Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ImpersonationErrorBoundary;