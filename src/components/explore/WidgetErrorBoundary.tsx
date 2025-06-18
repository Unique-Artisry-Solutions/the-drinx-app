
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { getErrorMessage, logError } from '@/utils/errorHandling';

interface Props {
  children: ReactNode;
  widgetName: string;
  fallback?: ReactNode;
  showRetry?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

class WidgetErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    error: null,
    errorId: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString()
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, `WidgetErrorBoundary:${this.props.widgetName}`);
    console.error(`Widget Error [${this.props.widgetName}]:`, error, errorInfo);
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorId: ''
      });
    }
  };

  private renderFallback = () => {
    if (this.props.fallback) {
      return this.props.fallback;
    }

    const errorMessage = getErrorMessage(this.state.error);
    const canRetry = this.retryCount < this.maxRetries && this.props.showRetry !== false;

    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-red-800">
                {this.props.widgetName} Error
              </h4>
              <p className="text-xs text-red-600 mt-1 truncate">
                {errorMessage}
              </p>
            </div>
            {canRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={this.handleRetry}
                className="shrink-0"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  public render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

export default WidgetErrorBoundary;
