
import { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { clearAllSessions } from '@/utils/sessionCleaner';

interface Props {
  children: ReactNode;
  fallbackRoute?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class AuthErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // Log to analytics or error reporting service
    this.logError(error, errorInfo);
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Send to error reporting service
    console.error('Auth Error Boundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount
    });
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  private handleClearSession = () => {
    try {
      clearAllSessions();
      localStorage.removeItem('spiritless-auth-storage');
      
      // Force page reload to ensure clean state
      window.location.href = this.props.fallbackRoute || '/landing';
    } catch (error) {
      console.error('Error clearing session:', error);
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const canRetry = this.state.retryCount < this.maxRetries;
      const isAuthError = this.state.error?.message?.toLowerCase().includes('auth') ||
                         this.state.error?.message?.toLowerCase().includes('session') ||
                         this.state.error?.message?.toLowerCase().includes('login');

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <CardTitle className="text-xl">
                {isAuthError ? 'Authentication Error' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center text-gray-600">
                {isAuthError ? (
                  <p>There was a problem with your authentication session.</p>
                ) : (
                  <p>An unexpected error occurred while loading the application.</p>
                )}
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 p-3 bg-gray-100 rounded text-sm">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error?.message}
                    </div>
                    <div>
                      <strong>Retry Count:</strong> {this.state.retryCount}/{this.maxRetries}
                    </div>
                    {this.state.error?.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="text-xs mt-1 overflow-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              <div className="space-y-3">
                {canRetry && (
                  <Button 
                    onClick={this.handleRetry}
                    className="w-full"
                    variant="default"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                  </Button>
                )}
                
                {isAuthError && (
                  <Button 
                    onClick={this.handleClearSession}
                    className="w-full"
                    variant="outline"
                  >
                    Clear Session & Sign In
                  </Button>
                )}
                
                <Button 
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
                
                {!canRetry && (
                  <Button 
                    onClick={() => window.location.reload()}
                    className="w-full"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Page
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-gray-500 text-center mt-4">
                If this problem persists, please try refreshing the page or contact support.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
