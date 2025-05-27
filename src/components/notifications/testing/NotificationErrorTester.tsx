
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  XCircle 
} from 'lucide-react';
import { useNotificationErrorTesting } from '@/hooks/notifications/testing/useNotificationErrorTesting';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  details?: string;
  retryCount?: number;
}

export const NotificationErrorTester = () => {
  const {
    isTestingNetworkConditions,
    isTestingDeduplication,
    isTestingRetryMechanisms,
    isTestingCleanup,
    testResults,
    runNetworkConditionTests,
    runDeduplicationTests,
    runRetryMechanismTests,
    runCleanupTests,
    runAllErrorTests
  } = useNotificationErrorTesting();

  const [testProgress, setTestProgress] = useState(0);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const isAnyTestRunning = isTestingNetworkConditions || isTestingDeduplication || 
                          isTestingRetryMechanisms || isTestingCleanup;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Error Handling & Performance Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Controls */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Button
              onClick={runNetworkConditionTests}
              disabled={isAnyTestRunning}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {navigator.onLine ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              Network Tests
            </Button>
            
            <Button
              onClick={runDeduplicationTests}
              disabled={isAnyTestRunning}
              variant="outline"
              size="sm"
            >
              Deduplication
            </Button>
            
            <Button
              onClick={runRetryMechanismTests}
              disabled={isAnyTestRunning}
              variant="outline"
              size="sm"
            >
              Retry Logic
            </Button>
            
            <Button
              onClick={runCleanupTests}
              disabled={isAnyTestRunning}
              variant="outline"
              size="sm"
            >
              Cleanup
            </Button>
            
            <Button
              onClick={() => {
                setTestProgress(0);
                runAllErrorTests((progress) => setTestProgress(progress));
              }}
              disabled={isAnyTestRunning}
              variant="default"
              size="sm"
            >
              Run All Tests
            </Button>
          </div>

          {/* Progress Bar */}
          {isAnyTestRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test Progress</span>
                <span>{Math.round(testProgress)}%</span>
              </div>
              <Progress value={testProgress} className="w-full" />
            </div>
          )}

          {/* Network Status */}
          <Alert>
            <div className="flex items-center gap-2">
              {navigator.onLine ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="font-medium">
                Network Status: {navigator.onLine ? 'Online' : 'Offline'}
              </span>
            </div>
            <AlertDescription className="mt-2">
              {navigator.onLine 
                ? 'Network connection detected. All network-dependent tests can run.'
                : 'No network connection. Network tests will simulate offline conditions.'
              }
            </AlertDescription>
          </Alert>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <span className="text-sm font-medium">{result.name}</span>
                        {result.details && (
                          <p className="text-xs text-gray-600 mt-1">{result.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(result.status)}
                      {result.duration && (
                        <span className="text-xs text-gray-500">
                          {result.duration}ms
                        </span>
                      )}
                      {result.retryCount && result.retryCount > 0 && (
                        <span className="text-xs text-orange-500">
                          {result.retryCount} retries
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Test Summary</h4>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-green-600 font-medium">
                      {testResults.filter(r => r.status === 'passed').length}
                    </span>
                    <span className="text-gray-600"> Passed</span>
                  </div>
                  <div>
                    <span className="text-red-600 font-medium">
                      {testResults.filter(r => r.status === 'failed').length}
                    </span>
                    <span className="text-gray-600"> Failed</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">
                      {testResults.filter(r => r.status === 'running').length}
                    </span>
                    <span className="text-gray-600"> Running</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">
                      {testResults.filter(r => r.status === 'pending').length}
                    </span>
                    <span className="text-gray-600"> Pending</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
