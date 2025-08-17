import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ModuleLoadingErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeout: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Only handle module loading errors
    if (error.message.includes('loading dynamically imported module') || 
        error.message.includes('Loading chunk') ||
        error.message.includes('Import error')) {
      return { hasError: true, error, errorInfo: null };
    }
    // Let other error boundaries handle non-module errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ModuleLoadingErrorBoundary caught a module loading error:', error, errorInfo);
    this.setState({ errorInfo });

    // Auto-retry with exponential backoff for module loading errors
    if (this.state.retryCount < this.maxRetries) {
      const delay = Math.pow(2, this.state.retryCount) * 1000; // 1s, 2s, 4s
      console.log(`Auto-retrying module load in ${delay}ms (attempt ${this.state.retryCount + 1}/${this.maxRetries})`);
      
      this.retryTimeout = window.setTimeout(() => {
        this.handleRetry();
      }, delay);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleRetry = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-warning mb-4" />
              <CardTitle>Loading Error</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Failed to load page component. This is usually temporary.
              </p>
              
              {this.state.retryCount < this.maxRetries && (
                <p className="text-center text-sm text-muted-foreground">
                  Auto-retrying... (attempt {this.state.retryCount + 1}/{this.maxRetries})
                </p>
              )}

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
                
                {this.state.retryCount >= this.maxRetries && (
                  <Button 
                    onClick={this.handleReload}
                    className="w-full"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ModuleLoadingErrorBoundary;