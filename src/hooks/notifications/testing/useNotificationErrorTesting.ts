
import { useState, useCallback } from 'react';
import { TestResult, TestingHookReturn, PerformanceMetrics } from '@/types/notification/TestingTypes';

export const useNotificationErrorTesting = (): TestingHookReturn => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>();
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getMemoryUsage = (): PerformanceMetrics['memoryUsage'] => {
    // Type guard for performance.memory
    const performance = window.performance as any;
    if (performance && 'memory' in performance) {
      return {
        used: performance.memory.usedJSHeapSize || 0,
        total: performance.memory.totalJSHeapSize || 0
      };
    }
    return undefined;
  };

  const runSingleTest = useCallback(async (testName: string): Promise<void> => {
    const startTime = performance.now();
    setCurrentTest(testName);
    
    try {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const memoryUsage = getMemoryUsage();
      
      const result: TestResult = {
        name: testName,
        status: Math.random() > 0.8 ? 'failed' : 'passed',
        message: Math.random() > 0.8 ? 'Test failed due to timeout' : 'Test completed successfully',
        duration,
        retryCount: 0,
        timestamp: Date.now()
      };

      setResults(prev => {
        const existingIndex = prev.findIndex(r => r.name === testName);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = result;
          return updated;
        }
        return [...prev, result];
      });
    } catch (err) {
      const result: TestResult = {
        name: testName,
        status: 'failed',
        message: err instanceof Error ? err.message : 'Unknown error',
        retryCount: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: Date.now()
      };

      setResults(prev => [...prev, result]);
    } finally {
      setCurrentTest(undefined);
    }
  }, []);

  const runTests = useCallback(async (): Promise<void> => {
    setIsRunning(true);
    setProgress(0);
    setError(null);
    setResults([]);

    const tests = [
      'Network failure simulation',
      'Permission denied scenario',
      'Service worker offline test',
      'Large payload handling',
      'Rate limiting test',
      'Browser compatibility check',
      'Memory leak detection',
      'Concurrent requests test',
      'Database connection failure',
      'Authentication timeout test',
      'Invalid payload format test',
      'Subscription cleanup test'
    ];

    try {
      for (let i = 0; i < tests.length; i++) {
        await runSingleTest(tests[i]);
        setProgress(((i + 1) / tests.length) * 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsRunning(false);
      setCurrentTest(undefined);
    }
  }, [runSingleTest]);

  const clearResults = useCallback(() => {
    setResults([]);
    setProgress(0);
    setError(null);
    setCurrentTest(undefined);
  }, []);

  const retryFailedTests = useCallback(async (): Promise<void> => {
    const failedTests = results.filter(r => r.status === 'failed');
    if (failedTests.length === 0) return;

    setIsRunning(true);
    setError(null);

    try {
      for (const test of failedTests) {
        await runSingleTest(test.name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsRunning(false);
    }
  }, [results, runSingleTest]);

  return {
    isRunning,
    progress,
    currentTest,
    results,
    error,
    runTests,
    runSingleTest,
    clearResults,
    retryFailedTests
  };
};
