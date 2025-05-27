
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Smartphone, Monitor, Vibrate } from 'lucide-react';
import { useCrossPlatformTesting } from '@/hooks/notifications/testing/useCrossPlatformTesting';

export const CrossPlatformTester = () => {
  const {
    isRunning,
    progress,
    currentTest,
    results,
    error,
    runTests,
    clearResults,
    retryFailedTests,
    deviceInfo,
    capabilities
  } = useCrossPlatformTesting();

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
            Cross-Platform Notification Testing
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
                {isRunning ? 'Running Tests...' : 'Run Platform Tests'}
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

          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results">Test Results</TabsTrigger>
              <TabsTrigger value="device">Device Info</TabsTrigger>
              <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="mt-4">
              {results.length > 0 ? (
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">No test results available</p>
                  <p className="text-gray-500 text-sm">Click "Run Platform Tests" to start testing</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="device" className="mt-4">
              {deviceInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {deviceInfo.isMobile ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                          Device Type
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Platform:</span>
                            <span className="font-medium">{deviceInfo.platform}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mobile:</span>
                            <Badge variant={deviceInfo.isMobile ? "default" : "outline"}>
                              {deviceInfo.isMobile ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>iOS:</span>
                            <Badge variant={deviceInfo.isIOS ? "default" : "outline"}>
                              {deviceInfo.isIOS ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Android:</span>
                            <Badge variant={deviceInfo.isAndroid ? "default" : "outline"}>
                              {deviceInfo.isAndroid ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Browser & APIs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Browser:</span>
                            <span className="font-medium">{deviceInfo.browser}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Service Worker:</span>
                            <Badge variant={deviceInfo.hasServiceWorker ? "default" : "destructive"}>
                              {deviceInfo.hasServiceWorker ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Push Manager:</span>
                            <Badge variant={deviceInfo.hasPushManager ? "default" : "destructive"}>
                              {deviceInfo.hasPushManager ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Vibration:</span>
                            <Badge variant={deviceInfo.hasVibration ? "default" : "outline"}>
                              {deviceInfo.hasVibration ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">User Agent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                        {deviceInfo.userAgent}
                      </code>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Monitor className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">No device information available</p>
                  <p className="text-gray-500 text-sm">Run tests to detect device capabilities</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="capabilities" className="mt-4">
              {capabilities ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Vibrate className="h-4 w-4" />
                          Notification Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Sound:</span>
                            <Badge variant={capabilities.supportsSound ? "default" : "outline"}>
                              {capabilities.supportsSound ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Vibration:</span>
                            <Badge variant={capabilities.supportsVibration ? "default" : "outline"}>
                              {capabilities.supportsVibration ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Badge:</span>
                            <Badge variant={capabilities.supportsBadge ? "default" : "outline"}>
                              {capabilities.supportsBadge ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Image:</span>
                            <Badge variant={capabilities.supportsImage ? "default" : "outline"}>
                              {capabilities.supportsImage ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Action Support</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Actions:</span>
                            <Badge variant={capabilities.supportsActions ? "default" : "outline"}>
                              {capabilities.supportsActions ? "Supported" : "Not Supported"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Max Actions:</span>
                            <span className="font-medium">{capabilities.maxActions}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Vibrate className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">No capability information available</p>
                  <p className="text-gray-500 text-sm">Run tests to detect notification capabilities</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
