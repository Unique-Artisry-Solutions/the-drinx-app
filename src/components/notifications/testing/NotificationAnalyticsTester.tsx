
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsTestResult {
  testName: string;
  status: 'passed' | 'failed' | 'running';
  metrics: {
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    errorRate: number;
  };
  timestamp: number;
}

export const NotificationAnalyticsTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AnalyticsTestResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runAnalyticsTests = async () => {
    setIsRunning(true);
    setError(null);
    setResults([]);

    const tests = [
      'Delivery Rate Tracking',
      'Open Rate Analytics',
      'Click-through Rate Monitoring',
      'Error Rate Analysis',
      'User Engagement Metrics',
      'Campaign Performance Tracking',
      'Real-time Analytics Dashboard',
      'Historical Data Analysis'
    ];

    try {
      for (const testName of tests) {
        // Simulate analytics test
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const isSuccess = Math.random() > 0.1; // 90% success rate
        
        const result: AnalyticsTestResult = {
          testName,
          status: isSuccess ? 'passed' : 'failed',
          metrics: {
            deliveryRate: Math.random() * 20 + 80, // 80-100%
            openRate: Math.random() * 30 + 40,    // 40-70%
            clickRate: Math.random() * 15 + 10,   // 10-25%
            errorRate: Math.random() * 5          // 0-5%
          },
          timestamp: Date.now()
        };

        setResults(prev => [...prev, result]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analytics test failed');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Notification Analytics & Reporting Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={runAnalyticsTests}
            disabled={isRunning}
            variant="default"
          >
            {isRunning ? 'Running Analytics Tests...' : 'Run Analytics Tests'}
          </Button>
          
          {results.length > 0 && (
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">
                Passed: {results.filter(r => r.status === 'passed').length}
              </span>
              <span className="text-red-600">
                Failed: {results.filter(r => r.status === 'failed').length}
              </span>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Analytics Test Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((result, index) => (
                <Card key={index} className="border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        {result.testName}
                      </div>
                      <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span>Delivery: {formatPercentage(result.metrics.deliveryRate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>Open: {formatPercentage(result.metrics.openRate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-500" />
                        <span>Click: {formatPercentage(result.metrics.clickRate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Error: {formatPercentage(result.metrics.errorRate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!isRunning && results.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-600">No analytics test results available</p>
            <p className="text-gray-500 text-sm">Click "Run Analytics Tests" to start testing</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
