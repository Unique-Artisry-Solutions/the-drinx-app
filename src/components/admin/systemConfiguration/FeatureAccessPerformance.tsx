
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { batchCheckFeatureAccess } from '@/lib/features/api';
import { FEATURES } from '@/lib/features/registry';
import { clearFeatureAccessCache } from '@/lib/features/cache';

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  success: boolean;
}

const FeatureAccessPerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [averageResponseTime, setAverageResponseTime] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    runInitialTests();
  }, []);

  useEffect(() => {
    if (metrics.length > 0) {
      const successfulMetrics = metrics.filter(m => m.success);
      if (successfulMetrics.length > 0) {
        const avg = successfulMetrics.reduce((sum, metric) => sum + metric.duration, 0) / successfulMetrics.length;
        setAverageResponseTime(avg);
      }
    }
  }, [metrics]);

  const runInitialTests = async () => {
    await runPerformanceTest();
  };

  const runPerformanceTest = async () => {
    setIsLoading(true);
    try {
      // Clear cache before testing to get accurate results
      clearFeatureAccessCache();
      
      // Test 1: Single feature check
      await measureOperation('Single Feature Check', async () => {
        const startTime = performance.now();
        await batchCheckFeatureAccess([FEATURES.ADVANCED_ANALYTICS]);
        return performance.now() - startTime;
      });
      
      // Test 2: Multiple features batch check
      await measureOperation('5 Features Batch Check', async () => {
        const startTime = performance.now();
        await batchCheckFeatureAccess([
          FEATURES.ADVANCED_ANALYTICS,
          FEATURES.BULK_MESSAGING,
          FEATURES.CUSTOM_BRANDING,
          FEATURES.PRIORITY_SUPPORT,
          FEATURES.SOCIAL_SHARING
        ]);
        return performance.now() - startTime;
      });
      
      // Test 3: Cached feature check
      await measureOperation('Cached Feature Check', async () => {
        // First call to ensure it's cached
        await batchCheckFeatureAccess([FEATURES.SOCIAL_SHARING]);
        
        // Measure the cached access
        const startTime = performance.now();
        await batchCheckFeatureAccess([FEATURES.SOCIAL_SHARING]);
        return performance.now() - startTime;
      });
      
      toast({
        title: 'Performance tests completed',
        description: 'All feature access performance tests have been completed successfully.',
      });
    } catch (error) {
      console.error('Error running performance tests:', error);
      toast({
        variant: 'destructive',
        title: 'Performance test failed',
        description: 'An error occurred while testing feature access performance.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const measureOperation = async (name: string, operation: () => Promise<number>) => {
    try {
      const duration = await operation();
      const newMetric: PerformanceMetric = {
        operation: name,
        duration,
        timestamp: new Date(),
        success: true
      };
      
      setMetrics(prev => [newMetric, ...prev].slice(0, 10)); // Keep only last 10 metrics
      return duration;
    } catch (error) {
      console.error(`Error measuring ${name}:`, error);
      const newMetric: PerformanceMetric = {
        operation: name,
        duration: 0,
        timestamp: new Date(),
        success: false
      };
      
      setMetrics(prev => [newMetric, ...prev].slice(0, 10));
      throw error;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Feature Access Performance
        </CardTitle>
        <CardDescription>
          Monitor and test the performance of feature access checks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Performance Metrics</h3>
              <p className="text-sm text-muted-foreground">
                Average response time: {averageResponseTime.toFixed(2)}ms
              </p>
            </div>
            <Button
              onClick={runPerformanceTest}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Run Tests
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operation</TableHead>
                <TableHead className="text-right">Duration (ms)</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.length > 0 ? (
                metrics.map((metric, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{metric.operation}</TableCell>
                    <TableCell className="text-right">
                      {metric.success ? metric.duration.toFixed(2) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {metric.timestamp.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {metric.success ? (
                        <span className="text-green-500">Success</span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Failed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No performance data available yet. Run tests to collect metrics.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="rounded-md bg-muted p-4 text-sm">
            <h4 className="font-medium mb-2">Tips for Optimal Performance</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use batch checks when multiple feature checks are needed</li>
              <li>Take advantage of caching for frequently accessed features</li>
              <li>Consider preloading common features on application start</li>
              <li>Monitor high-traffic features for performance bottlenecks</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureAccessPerformance;
