import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Activity, Users, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNotificationLoadTesting } from '@/hooks/notifications/testing/useNotificationLoadTesting';

interface LoadTestConfig {
  userCount: number;
  notificationsPerUser: number;
  batchSize: number;
  intervalMs: number;
  testDurationMs: number;
}

const NotificationLoadTester: React.FC = () => {
  const {
    isRunning,
    progress,
    results,
    error,
    runLoadTest,
    runStressTest,
    runPerformanceTest,
    clearResults
  } = useNotificationLoadTesting();

  const [customConfig, setCustomConfig] = useState<LoadTestConfig>({
    userCount: 100,
    notificationsPerUser: 5,
    batchSize: 20,
    intervalMs: 100,
    testDurationMs: 60000
  });

  const handleCustomConfigChange = (field: keyof LoadTestConfig, value: number) => {
    setCustomConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatMemoryUsage = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const getPerformanceStatus = (results: any) => {
    if (!results) return { status: 'unknown', color: 'gray' };
    
    if (results.errorRate > 10) return { status: 'poor', color: 'red' };
    if (results.errorRate > 5) return { status: 'degraded', color: 'yellow' };
    if (results.avgResponseTime > 2000) return { status: 'slow', color: 'orange' };
    return { status: 'excellent', color: 'green' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Notification Load Testing
          </CardTitle>
          <CardDescription>
            Test notification system performance under various load conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="presets" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="presets">Preset Tests</TabsTrigger>
              <TabsTrigger value="custom">Custom Config</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-4 w-4" />
                      Performance Test
                    </CardTitle>
                    <CardDescription>
                      Moderate load test (100 users, 5 notifications each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>• 100 simulated users</div>
                      <div>• 5 notifications per user</div>
                      <div>• 20 notifications per batch</div>
                      <div>• 1 minute duration</div>
                    </div>
                    <Button 
                      onClick={runPerformanceTest}
                      disabled={isRunning}
                      className="w-full mt-4"
                    >
                      {isRunning ? "Running..." : "Start Performance Test"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-4 w-4" />
                      Stress Test
                    </CardTitle>
                    <CardDescription>
                      High load stress test (1000 users, 10 notifications each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>• 1000 simulated users</div>
                      <div>• 10 notifications per user</div>
                      <div>• 50 notifications per batch</div>
                      <div>• 5 minute duration</div>
                    </div>
                    <Button 
                      onClick={runStressTest}
                      disabled={isRunning}
                      variant="secondary"
                      className="w-full mt-4"
                    >
                      {isRunning ? "Running..." : "Start Stress Test"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userCount">Number of Users</Label>
                    <Input
                      id="userCount"
                      type="number"
                      value={customConfig.userCount}
                      onChange={(e) => handleCustomConfigChange('userCount', parseInt(e.target.value))}
                      min="1"
                      max="10000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notificationsPerUser">Notifications per User</Label>
                    <Input
                      id="notificationsPerUser"
                      type="number"
                      value={customConfig.notificationsPerUser}
                      onChange={(e) => handleCustomConfigChange('notificationsPerUser', parseInt(e.target.value))}
                      min="1"
                      max="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="batchSize">Batch Size</Label>
                    <Input
                      id="batchSize"
                      type="number"
                      value={customConfig.batchSize}
                      onChange={(e) => handleCustomConfigChange('batchSize', parseInt(e.target.value))}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="intervalMs">Interval (ms)</Label>
                    <Input
                      id="intervalMs"
                      type="number"
                      value={customConfig.intervalMs}
                      onChange={(e) => handleCustomConfigChange('intervalMs', parseInt(e.target.value))}
                      min="10"
                      max="10000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="testDurationMs">Test Duration (ms)</Label>
                    <Input
                      id="testDurationMs"
                      type="number"
                      value={customConfig.testDurationMs}
                      onChange={(e) => handleCustomConfigChange('testDurationMs', parseInt(e.target.value))}
                      min="1000"
                      max="3600000"
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={() => runLoadTest(customConfig)}
                      disabled={isRunning}
                      className="w-full"
                    >
                      {isRunning ? "Running Custom Test..." : "Start Custom Test"}
                    </Button>
                  </div>
                </div>
              </div>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Test Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Total Notifications</div>
                      <div className="text-muted-foreground">
                        {customConfig.userCount * customConfig.notificationsPerUser}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Total Batches</div>
                      <div className="text-muted-foreground">
                        {Math.ceil((customConfig.userCount * customConfig.notificationsPerUser) / customConfig.batchSize)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-muted-foreground">
                        {(customConfig.testDurationMs / 1000).toFixed(0)}s
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Est. Rate</div>
                      <div className="text-muted-foreground">
                        {((customConfig.userCount * customConfig.notificationsPerUser) / (customConfig.testDurationMs / 1000)).toFixed(0)}/s
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {isRunning && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Test Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {results && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Test Results</h3>
                    <div className="flex gap-2">
                      <Badge variant={getPerformanceStatus(results).color === 'green' ? 'default' : 'destructive'}>
                        {getPerformanceStatus(results).status.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={clearResults}>
                        Clear Results
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div className="text-sm font-medium">Success Rate</div>
                        </div>
                        <div className="text-2xl font-bold">
                          {((results.successfulDeliveries / results.totalNotifications) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {results.successfulDeliveries} / {results.totalNotifications}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <div className="text-sm font-medium">Avg Response</div>
                        </div>
                        <div className="text-2xl font-bold">
                          {results.avgResponseTime.toFixed(0)}ms
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {results.minResponseTime}ms - {results.maxResponseTime}ms
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          <div className="text-sm font-medium">Throughput</div>
                        </div>
                        <div className="text-2xl font-bold">
                          {results.throughput.toFixed(1)}/s
                        </div>
                        <div className="text-xs text-muted-foreground">
                          notifications per second
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <div className="text-sm font-medium">Error Rate</div>
                        </div>
                        <div className="text-2xl font-bold">
                          {results.errorRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {results.failedDeliveries} failed
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {results.memoryUsage && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Memory Usage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium">Used Memory</div>
                            <div className="text-xl font-bold">
                              {formatMemoryUsage(results.memoryUsage.used)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Total Memory</div>
                            <div className="text-xl font-bold">
                              {formatMemoryUsage(results.memoryUsage.total)}
                            </div>
                          </div>
                        </div>
                        <Progress 
                          value={(results.memoryUsage.used / results.memoryUsage.total) * 100} 
                          className="h-2 mt-2" 
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {!results && !isRunning && !error && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No test results yet. Run a test to see performance metrics.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationLoadTester;