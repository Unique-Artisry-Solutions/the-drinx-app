
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Timer, 
  TrendingUp, 
  Users, 
  Database,
  Monitor,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
}

interface LoadTestResult {
  id: string;
  testName: string;
  startTime: string;
  duration: number;
  virtualUsers: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  status: 'running' | 'completed' | 'failed';
  metrics: PerformanceMetric[];
}

export const PerformanceTestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<LoadTestResult[]>([]);
  const { toast } = useToast();

  const performanceTests = [
    {
      id: 'segment-load',
      name: 'Segment Load Test',
      description: 'Test segment loading with large datasets',
      virtualUsers: 100,
      duration: 300, // 5 minutes
      targetRPS: 50
    },
    {
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard Load',
      description: 'Test dashboard performance under load',
      virtualUsers: 50,
      duration: 180, // 3 minutes
      targetRPS: 30
    },
    {
      id: 'relationship-mapping',
      name: 'Relationship Network Rendering',
      description: 'Test network visualization performance',
      virtualUsers: 25,
      duration: 120, // 2 minutes
      targetRPS: 15
    },
    {
      id: 'real-time-updates',
      name: 'Real-time Analytics Updates',
      description: 'Test real-time data streaming performance',
      virtualUsers: 200,
      duration: 600, // 10 minutes
      targetRPS: 100
    }
  ];

  const runPerformanceTest = async (testId: string) => {
    const test = performanceTests.find(t => t.id === testId);
    if (!test) return;

    setIsRunning(true);
    setProgress(0);
    setCurrentTest(test.name);

    const startTime = new Date().toISOString();
    
    // Create initial test result
    const testResult: LoadTestResult = {
      id: testId,
      testName: test.name,
      startTime,
      duration: test.duration,
      virtualUsers: test.virtualUsers,
      requestsPerSecond: 0,
      averageResponseTime: 0,
      errorRate: 0,
      throughput: 0,
      status: 'running',
      metrics: []
    };

    setTestResults(prev => [testResult, ...prev]);

    // Simulate test execution with progress updates
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
      
      // Update metrics as test progresses
      if (i % 20 === 0) {
        const updatedResult: LoadTestResult = {
          ...testResult,
          requestsPerSecond: Math.random() * test.targetRPS,
          averageResponseTime: 200 + Math.random() * 300,
          errorRate: Math.random() * 5,
          throughput: Math.random() * 1000,
          metrics: [
            {
              name: 'Response Time',
              value: 200 + Math.random() * 300,
              unit: 'ms',
              threshold: 500,
              status: (200 + Math.random() * 300) < 500 ? 'good' : 'warning'
            },
            {
              name: 'Error Rate',
              value: Math.random() * 5,
              unit: '%',
              threshold: 2,
              status: (Math.random() * 5) < 2 ? 'good' : 'critical'
            },
            {
              name: 'Throughput',
              value: Math.random() * 1000,
              unit: 'req/s',
              threshold: test.targetRPS * 0.8,
              status: (Math.random() * 1000) > (test.targetRPS * 0.8) ? 'good' : 'warning'
            },
            {
              name: 'Memory Usage',
              value: 60 + Math.random() * 30,
              unit: '%',
              threshold: 85,
              status: (60 + Math.random() * 30) < 85 ? 'good' : 'warning'
            },
            {
              name: 'CPU Usage',
              value: 40 + Math.random() * 40,
              unit: '%',
              threshold: 80,
              status: (40 + Math.random() * 40) < 80 ? 'good' : 'critical'
            }
          ]
        };

        setTestResults(prev => prev.map(result => 
          result.id === testId ? updatedResult : result
        ));
      }
    }

    // Complete the test
    const finalResult: LoadTestResult = {
      ...testResult,
      status: Math.random() > 0.2 ? 'completed' : 'failed',
      requestsPerSecond: Math.random() * test.targetRPS,
      averageResponseTime: 200 + Math.random() * 300,
      errorRate: Math.random() * 5,
      throughput: Math.random() * 1000,
      metrics: [
        {
          name: 'Response Time',
          value: 245,
          unit: 'ms',
          threshold: 500,
          status: 'good'
        },
        {
          name: 'Error Rate',
          value: 1.2,
          unit: '%',
          threshold: 2,
          status: 'good'
        },
        {
          name: 'Throughput',
          value: test.targetRPS * 0.9,
          unit: 'req/s',
          threshold: test.targetRPS * 0.8,
          status: 'good'
        },
        {
          name: 'Memory Usage',
          value: 72,
          unit: '%',
          threshold: 85,
          status: 'good'
        },
        {
          name: 'CPU Usage',
          value: 65,
          unit: '%',
          threshold: 80,
          status: 'good'
        }
      ]
    };

    setTestResults(prev => prev.map(result => 
      result.id === testId ? finalResult : result
    ));

    setIsRunning(false);
    setProgress(0);
    setCurrentTest(null);

    toast({
      title: finalResult.status === 'completed' ? "Test Completed" : "Test Failed",
      description: `${test.name} finished with ${finalResult.status} status`,
      variant: finalResult.status === 'completed' ? "default" : "destructive"
    });
  };

  const getMetricStatusIcon = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadgeVariant = (status: LoadTestResult['status']) => {
    switch (status) {
      case 'running': return 'default';
      case 'completed': return 'success' as any;
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Test Runner
          </CardTitle>
          <CardDescription>
            Execute load tests and monitor performance metrics for audience analytics components
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRunning && (
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Running: {currentTest}</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceTests.map((test) => (
              <Card key={test.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{test.virtualUsers} users</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      <span>{test.duration}s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{test.targetRPS} req/s</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => runPerformanceTest(test.id)}
                    disabled={isRunning}
                    className="w-full"
                  >
                    {isRunning ? 'Running...' : 'Start Test'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Test Results
            </CardTitle>
            <CardDescription>
              Recent performance test results and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {testResults.map((result) => (
                <div key={`${result.id}-${result.startTime}`} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{result.testName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Started: {new Date(result.startTime).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(result.status)}>
                      {result.status}
                    </Badge>
                  </div>

                  {result.status !== 'running' && (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{result.requestsPerSecond.toFixed(1)}</div>
                          <div className="text-xs text-muted-foreground">Req/Sec</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{result.averageResponseTime.toFixed(0)}ms</div>
                          <div className="text-xs text-muted-foreground">Avg Response</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{result.errorRate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Error Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{result.throughput.toFixed(0)}</div>
                          <div className="text-xs text-muted-foreground">Throughput</div>
                        </div>
                      </div>

                      {result.metrics.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">Performance Metrics</h4>
                          <div className="grid gap-2">
                            {result.metrics.map((metric, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <div className="flex items-center gap-2">
                                  {getMetricStatusIcon(metric.status)}
                                  <span className="text-sm font-medium">{metric.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{metric.value.toFixed(1)}{metric.unit}</span>
                                  <span className="text-xs text-muted-foreground">
                                    (threshold: {metric.threshold}{metric.unit})
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceTestRunner;
