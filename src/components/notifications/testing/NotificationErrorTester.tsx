
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNotificationErrorTesting } from '@/hooks/notifications/testing/useNotificationErrorTesting';

export const NotificationErrorTester = () => {
  const {
    isRunning,
    progress,
    currentTest,
    results,
    error,
    runTests,
    clearResults,
    retryFailedTests
  } = useNotificationErrorTesting();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const failedTestsCount = results.filter(r => r.status === 'failed').length;
  const passedTestsCount = results.filter(r => r.status === 'passed').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Error Handling & Performance Testing
            <div className="flex gap-2">
              {failedTestsCount > 0 && (
                <Button
                  onClick={retryFailedTests}
                  disabled={isRunning}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Failed ({failedTestsCount})
                </Button>
              )}
              <Button
                onClick={clearResults}
                disabled={isRunning}
                variant="outline"
                size="sm"
              >
                Clear Results
              </Button>
              <Button
                onClick={runTests}
                disabled={isRunning}
                variant="default"
              >
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isRunning && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentTest && (
                <p className="text-sm text-gray-600 mt-2">
                  Currently running: {currentTest}
                </p>
              )}
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Test Results</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">
                    Passed: {passedTestsCount}
                  </span>
                  <span className="text-red-600">
                    Failed: {failedTestsCount}
                  </span>
                  <span className="text-gray-600">
                    Total: {results.length}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <span className="text-sm font-medium">{result.name}</span>
                        {result.message && (
                          <p className="text-xs text-gray-600 mt-1">{result.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(result.status)}
                      {result.duration && (
                        <span className="text-xs text-gray-500">
                          {Math.round(result.duration)}ms
                        </span>
                      )}
                      {result.retryCount !== undefined && result.retryCount > 0 && (
                        <span className="text-xs text-orange-500">
                          Retry: {result.retryCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isRunning && results.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-600">No test results available</p>
              <p className="text-gray-500 text-sm">Click "Run All Tests" to start testing</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
