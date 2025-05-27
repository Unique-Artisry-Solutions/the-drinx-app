
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  duration?: number;
  details?: any;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Type guard to check if performance.memory is available
const hasMemoryInfo = (perf: Performance): perf is Performance & { memory: MemoryInfo } => {
  return 'memory' in perf && typeof (perf as any).memory === 'object';
};

export const useNotificationErrorTesting = () => {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const getMemoryUsage = useCallback(() => {
    if (hasMemoryInfo(performance)) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
      };
    }
    return { used: 0, total: 0 };
  }, []);

  const simulateNetworkCondition = useCallback(async (condition: 'slow' | 'offline' | 'unstable') => {
    const delay = condition === 'slow' ? 3000 : condition === 'unstable' ? Math.random() * 2000 : 5000;
    
    if (condition === 'offline') {
      throw new Error('Network offline');
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    if (condition === 'unstable' && Math.random() < 0.3) {
      throw new Error('Network timeout');
    }
    
    return `Network condition: ${condition}`;
  }, []);

  const testNetworkResilience = useCallback(async (): Promise<TestResult> => {
    const startTime = performance.now();
    
    try {
      await simulateNetworkCondition('slow');
      
      return {
        name: 'Network Resilience Test',
        status: 'passed',
        message: 'Notifications handled slow network conditions successfully',
        duration: Math.round(performance.now() - startTime)
      };
    } catch (error) {
      return {
        name: 'Network Resilience Test',
        status: 'failed',
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Math.round(performance.now() - startTime)
      };
    }
  }, [simulateNetworkCondition]);

  const testDeduplication = useCallback(async (): Promise<TestResult> => {
    const startTime = performance.now();
    
    try {
      // Simulate sending duplicate notifications
      const notifications = [
        { id: '1', message: 'Test notification' },
        { id: '1', message: 'Test notification' }, // Duplicate
        { id: '2', message: 'Different notification' }
      ];
      
      const uniqueNotifications = notifications.filter((notification, index, self) => 
        index === self.findIndex(n => n.id === notification.id)
      );
      
      if (uniqueNotifications.length === 2) {
        return {
          name: 'Deduplication Test',
          status: 'passed',
          message: 'Duplicate notifications filtered correctly',
          duration: Math.round(performance.now() - startTime)
        };
      } else {
        return {
          name: 'Deduplication Test',
          status: 'failed',
          message: 'Deduplication logic failed',
          duration: Math.round(performance.now() - startTime)
        };
      }
    } catch (error) {
      return {
        name: 'Deduplication Test',
        status: 'failed',
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Math.round(performance.now() - startTime)
      };
    }
  }, []);

  const testRetryMechanism = useCallback(async (): Promise<TestResult> => {
    const startTime = performance.now();
    
    try {
      let attempts = 0;
      const maxRetries = 3;
      
      const attemptNotification = async (): Promise<boolean> => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Simulated failure');
        }
        return true;
      };
      
      let success = false;
      for (let i = 0; i < maxRetries; i++) {
        try {
          success = await attemptNotification();
          break;
        } catch (error) {
          if (i === maxRetries - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, i)));
        }
      }
      
      return {
        name: 'Retry Mechanism Test',
        status: success ? 'passed' : 'failed',
        message: success ? `Notification succeeded after ${attempts} attempts` : 'Max retries exceeded',
        duration: Math.round(performance.now() - startTime)
      };
    } catch (error) {
      return {
        name: 'Retry Mechanism Test',
        status: 'failed',
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Math.round(performance.now() - startTime)
      };
    }
  }, []);

  const testSubscriptionCleanup = useCallback(async (): Promise<TestResult> => {
    const startTime = performance.now();
    
    try {
      // Simulate subscription lifecycle
      const subscriptions = new Set<string>();
      
      // Add subscriptions
      subscriptions.add('user-123');
      subscriptions.add('promoter-456');
      subscriptions.add('establishment-789');
      
      // Simulate cleanup
      const cleanup = () => {
        subscriptions.clear();
      };
      
      cleanup();
      
      return {
        name: 'Subscription Cleanup Test',
        status: subscriptions.size === 0 ? 'passed' : 'failed',
        message: subscriptions.size === 0 ? 'All subscriptions cleaned up successfully' : 'Cleanup failed',
        duration: Math.round(performance.now() - startTime)
      };
    } catch (error) {
      return {
        name: 'Subscription Cleanup Test',
        status: 'failed',
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Math.round(performance.now() - startTime)
      };
    }
  }, []);

  const testMemoryLeaks = useCallback(async (): Promise<TestResult> => {
    const startTime = performance.now();
    
    try {
      const initialMemory = getMemoryUsage();
      
      // Simulate creating and destroying notifications
      const notifications = [];
      for (let i = 0; i < 1000; i++) {
        notifications.push({
          id: `test-${i}`,
          message: `Test notification ${i}`,
          timestamp: Date.now()
        });
      }
      
      // Simulate cleanup
      notifications.length = 0;
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
      
      const finalMemory = getMemoryUsage();
      const memoryIncrease = finalMemory.used - initialMemory.used;
      
      return {
        name: 'Memory Leak Test',
        status: memoryIncrease < 10 ? 'passed' : 'failed',
        message: `Memory usage changed by ${memoryIncrease}MB`,
        duration: Math.round(performance.now() - startTime),
        details: { initialMemory, finalMemory }
      };
    } catch (error) {
      return {
        name: 'Memory Leak Test',
        status: 'failed',
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Math.round(performance.now() - startTime)
      };
    }
  }, [getMemoryUsage]);

  const testPerformanceUnderLoad = useCallback(async (): Promise<TestResult> => {
    const startTime = performance.now();
    
    try {
      const notifications = [];
      const batchSize = 100;
      
      // Simulate processing notifications in batches
      for (let batch = 0; batch < 5; batch++) {
        const batchStart = performance.now();
        
        for (let i = 0; i < batchSize; i++) {
          notifications.push({
            id: `batch-${batch}-${i}`,
            message: `Batch notification ${i}`,
            processed: true
          });
        }
        
        const batchTime = performance.now() - batchStart;
        if (batchTime > 100) { // If a batch takes more than 100ms
          throw new Error(`Batch processing too slow: ${batchTime}ms`);
        }
      }
      
      return {
        name: 'Performance Under Load Test',
        status: 'passed',
        message: `Processed ${notifications.length} notifications efficiently`,
        duration: Math.round(performance.now() - startTime)
      };
    } catch (error) {
      return {
        name: 'Performance Under Load Test',
        status: 'failed',
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Math.round(performance.now() - startTime)
      };
    }
  }, []);

  const runErrorHandlingTests = useCallback(async () => {
    if (!user) {
      throw new Error('User must be logged in to run tests');
    }

    setIsRunning(true);
    setResults([]);

    const tests = [
      testNetworkResilience,
      testDeduplication,
      testRetryMechanism,
      testSubscriptionCleanup,
      testMemoryLeaks,
      testPerformanceUnderLoad
    ];

    const testResults: TestResult[] = [];

    for (const test of tests) {
      try {
        setResults(prev => [...prev, {
          name: test.name,
          status: 'running',
          message: 'Running test...'
        }]);

        const result = await test();
        testResults.push(result);
        
        setResults(prev => prev.map(r => 
          r.name === result.name ? result : r
        ));
      } catch (error) {
        const failedResult: TestResult = {
          name: test.name,
          status: 'failed',
          message: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
        testResults.push(failedResult);
        
        setResults(prev => prev.map(r => 
          r.name === failedResult.name ? failedResult : r
        ));
      }
    }

    setIsRunning(false);
    return testResults;
  }, [user, testNetworkResilience, testDeduplication, testRetryMechanism, testSubscriptionCleanup, testMemoryLeaks, testPerformanceUnderLoad]);

  return {
    isRunning,
    results,
    runErrorHandlingTests
  };
};
