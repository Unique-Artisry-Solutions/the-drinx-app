import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoadTestConfig {
  userCount: number;
  notificationsPerUser: number;
  batchSize: number;
  intervalMs: number;
  testDurationMs: number;
}

interface LoadTestResult {
  totalNotifications: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  avgResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  throughput: number; // notifications per second
  errorRate: number;
  memoryUsage?: {
    used: number;
    total: number;
  };
}

interface LoadTestMetrics {
  responseTimes: number[];
  errors: string[];
  delivered: number;
  failed: number;
  startTime: number;
  endTime?: number;
}

export const useNotificationLoadTesting = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<LoadTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const runLoadTest = useCallback(async (config: LoadTestConfig) => {
    setIsRunning(true);
    setProgress(0);
    setError(null);
    setResults(null);

    const metrics: LoadTestMetrics = {
      responseTimes: [],
      errors: [],
      delivered: 0,
      failed: 0,
      startTime: Date.now()
    };

    try {
      console.log('Starting notification load test with config:', config);
      
      // Generate test users
      const testUsers = Array.from({ length: config.userCount }, (_, i) => ({
        id: `test-user-${i + 1}`,
        name: `Test User ${i + 1}`
      }));

      const totalNotifications = config.userCount * config.notificationsPerUser;
      let processedNotifications = 0;

      // Create batches of notifications
      const batches: Array<{
        userId: string;
        notifications: Array<{
          title: string;
          content: string;
          priority: 'low' | 'medium' | 'high';
          metadata: Record<string, any>;
        }>;
      }> = [];

      testUsers.forEach(user => {
        const userNotifications = Array.from({ length: config.notificationsPerUser }, (_, i) => ({
          title: `Load Test Notification ${i + 1}`,
          content: `This is load test notification ${i + 1} for ${user.name}`,
          priority: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
          metadata: {
            loadTest: true,
            userId: user.id,
            batchNumber: Math.floor(i / config.batchSize),
            timestamp: Date.now()
          }
        }));

        // Split into batches
        for (let i = 0; i < userNotifications.length; i += config.batchSize) {
          batches.push({
            userId: user.id,
            notifications: userNotifications.slice(i, i + config.batchSize)
          });
        }
      });

      console.log(`Created ${batches.length} batches for load testing`);

      // Process batches with controlled timing
      const processBatch = async (batch: typeof batches[0]) => {
        const startTime = Date.now();
        
        try {
          // Use the real-time notifications edge function
          const { data, error } = await supabase.functions.invoke('notifications-realtime', {
            body: {
              action: 'batchNotifications',
              params: {
                notifications: batch.notifications.map(notif => ({
                  recipient_id: batch.userId,
                  ...notif
                }))
              }
            }
          });

          const responseTime = Date.now() - startTime;
          metrics.responseTimes.push(responseTime);

          if (error) {
            metrics.errors.push(`Batch error: ${error.message}`);
            metrics.failed += batch.notifications.length;
          } else {
            metrics.delivered += batch.notifications.length;
          }

          processedNotifications += batch.notifications.length;
          setProgress((processedNotifications / totalNotifications) * 100);

        } catch (error) {
          const responseTime = Date.now() - startTime;
          metrics.responseTimes.push(responseTime);
          metrics.errors.push(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          metrics.failed += batch.notifications.length;
          
          processedNotifications += batch.notifications.length;
          setProgress((processedNotifications / totalNotifications) * 100);
        }
      };

      // Process batches with controlled concurrency
      const concurrentBatches = Math.min(10, batches.length); // Limit concurrency
      
      for (let i = 0; i < batches.length; i += concurrentBatches) {
        const batchSlice = batches.slice(i, i + concurrentBatches);
        
        // Process batch slice concurrently
        await Promise.all(batchSlice.map(processBatch));
        
        // Wait between batch slices to control load
        if (i + concurrentBatches < batches.length) {
          await new Promise(resolve => setTimeout(resolve, config.intervalMs));
        }
      }

      metrics.endTime = Date.now();

      // Calculate results
      const testDuration = (metrics.endTime - metrics.startTime) / 1000; // seconds
      const avgResponseTime = metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length;
      const maxResponseTime = Math.max(...metrics.responseTimes);
      const minResponseTime = Math.min(...metrics.responseTimes);
      const throughput = totalNotifications / testDuration;
      const errorRate = (metrics.failed / totalNotifications) * 100;

      // Get memory usage if available
      let memoryUsage;
      if ('memory' in performance && 'usedJSHeapSize' in (performance as any).memory) {
        const mem = (performance as any).memory;
        memoryUsage = {
          used: mem.usedJSHeapSize,
          total: mem.totalJSHeapSize
        };
      }

      const result: LoadTestResult = {
        totalNotifications,
        successfulDeliveries: metrics.delivered,
        failedDeliveries: metrics.failed,
        avgResponseTime,
        maxResponseTime,
        minResponseTime,
        throughput,
        errorRate,
        memoryUsage
      };

      setResults(result);
      
      console.log('Load test completed:', result);
      
      toast({
        title: "Load Test Completed",
        description: `Processed ${totalNotifications} notifications with ${errorRate.toFixed(1)}% error rate`,
        variant: errorRate > 5 ? "destructive" : "default"
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Load test failed:', error);
      
      toast({
        title: "Load Test Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setProgress(100);
    }
  }, [toast]);

  const runStressTest = useCallback(async () => {
    // Predefined stress test configuration
    const stressConfig: LoadTestConfig = {
      userCount: 1000,
      notificationsPerUser: 10,
      batchSize: 50,
      intervalMs: 100,
      testDurationMs: 300000 // 5 minutes
    };

    await runLoadTest(stressConfig);
  }, [runLoadTest]);

  const runPerformanceTest = useCallback(async () => {
    // Performance test with moderate load
    const perfConfig: LoadTestConfig = {
      userCount: 100,
      notificationsPerUser: 5,
      batchSize: 20,
      intervalMs: 50,
      testDurationMs: 60000 // 1 minute
    };

    await runLoadTest(perfConfig);
  }, [runLoadTest]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    isRunning,
    progress,
    results,
    error,
    runLoadTest,
    runStressTest,
    runPerformanceTest,
    clearResults
  };
};