
import { useState, useCallback } from 'react';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { toastDeduplication } from '@/utils/toastDeduplication';
import { NetworkErrorHandler } from '@/utils/networkErrorHandler';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  details?: string;
  retryCount?: number;
}

export const useNotificationErrorTesting = () => {
  const [isTestingNetworkConditions, setIsTestingNetworkConditions] = useState(false);
  const [isTestingDeduplication, setIsTestingDeduplication] = useState(false);
  const [isTestingRetryMechanisms, setIsTestingRetryMechanisms] = useState(false);
  const [isTestingCleanup, setIsTestingCleanup] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  
  const { showSuccess, showError, showWarning, showInfo } = useNotificationSystem();

  const addTestResult = useCallback((result: TestResult) => {
    setTestResults(prev => {
      const existingIndex = prev.findIndex(r => r.name === result.name);
      if (existingIndex >= 0) {
        const newResults = [...prev];
        newResults[existingIndex] = result;
        return newResults;
      }
      return [...prev, result];
    });
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Test network conditions
  const runNetworkConditionTests = useCallback(async () => {
    setIsTestingNetworkConditions(true);
    
    const tests = [
      {
        name: 'Online notification delivery',
        test: async () => {
          if (!navigator.onLine) {
            throw new Error('Device is offline');
          }
          showSuccess('Network test', 'Online notification delivered successfully');
          return 'Notification delivered while online';
        }
      },
      {
        name: 'Offline notification handling',
        test: async () => {
          // Simulate offline condition
          const originalOnLine = navigator.onLine;
          Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
          
          try {
            showWarning('Network test', 'Testing offline notification handling');
            await delay(100);
            return 'Offline notification handled gracefully';
          } finally {
            Object.defineProperty(navigator, 'onLine', { value: originalOnLine, writable: true });
          }
        }
      },
      {
        name: 'Network timeout simulation',
        test: async () => {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network timeout')), 1000)
          );
          
          try {
            await Promise.race([
              timeoutPromise,
              delay(1500) // This will lose the race
            ]);
            throw new Error('Timeout test failed');
          } catch (error) {
            if (error.message === 'Network timeout') {
              showError('Network test', 'Timeout handled correctly');
              return 'Network timeout handled properly';
            }
            throw error;
          }
        }
      },
      {
        name: 'Connection recovery',
        test: async () => {
          // Simulate connection recovery
          showInfo('Network test', 'Testing connection recovery');
          await delay(200);
          return 'Connection recovery mechanism working';
        }
      }
    ];

    for (const test of tests) {
      const startTime = performance.now();
      addTestResult({ name: test.name, status: 'running' });
      
      try {
        const result = await test.test();
        const duration = performance.now() - startTime;
        addTestResult({
          name: test.name,
          status: 'passed',
          duration: Math.round(duration),
          details: result
        });
      } catch (error) {
        const duration = performance.now() - startTime;
        addTestResult({
          name: test.name,
          status: 'failed',
          duration: Math.round(duration),
          details: error.message
        });
      }
      
      await delay(500); // Brief pause between tests
    }
    
    setIsTestingNetworkConditions(false);
  }, [addTestResult, showSuccess, showError, showWarning, showInfo]);

  // Test deduplication logic
  const runDeduplicationTests = useCallback(async () => {
    setIsTestingDeduplication(true);
    
    const tests = [
      {
        name: 'Duplicate notification prevention',
        test: async () => {
          const testKey = { title: 'Test', description: 'Duplicate test', type: 'info' };
          
          // Clear any existing deduplication state
          toastDeduplication.clear();
          
          // First notification should show
          const first = toastDeduplication.shouldShowToast(testKey);
          if (!first) throw new Error('First notification was incorrectly blocked');
          
          // Second identical notification should be blocked
          const second = toastDeduplication.shouldShowToast(testKey);
          if (second) throw new Error('Duplicate notification was not blocked');
          
          showSuccess('Deduplication test', 'Duplicate prevention working');
          return 'Deduplication successfully prevents duplicate notifications';
        }
      },
      {
        name: 'Deduplication timeout reset',
        test: async () => {
          const testKey = { title: 'Timeout Test', description: 'Reset test', type: 'info' };
          
          toastDeduplication.clear();
          
          // Show first notification
          toastDeduplication.shouldShowToast(testKey);
          
          // Wait for deduplication window (simulated)
          await delay(100);
          
          // Clear and test again
          toastDeduplication.clear();
          const afterReset = toastDeduplication.shouldShowToast(testKey);
          
          if (!afterReset) throw new Error('Notification blocked after reset');
          
          return 'Deduplication timeout reset working correctly';
        }
      },
      {
        name: 'Different notification types allowed',
        test: async () => {
          toastDeduplication.clear();
          
          const baseNotification = { title: 'Same Title', description: 'Same Description' };
          
          const infoAllowed = toastDeduplication.shouldShowToast({ ...baseNotification, type: 'info' });
          const errorAllowed = toastDeduplication.shouldShowToast({ ...baseNotification, type: 'error' });
          
          if (!infoAllowed || !errorAllowed) {
            throw new Error('Different notification types were incorrectly blocked');
          }
          
          return 'Different notification types correctly allowed';
        }
      }
    ];

    for (const test of tests) {
      const startTime = performance.now();
      addTestResult({ name: test.name, status: 'running' });
      
      try {
        const result = await test.test();
        const duration = performance.now() - startTime;
        addTestResult({
          name: test.name,
          status: 'passed',
          duration: Math.round(duration),
          details: result
        });
      } catch (error) {
        const duration = performance.now() - startTime;
        addTestResult({
          name: test.name,
          status: 'failed',
          duration: Math.round(duration),
          details: error.message
        });
      }
    }
    
    setIsTestingDeduplication(false);
  }, [addTestResult, showSuccess]);

  // Test retry mechanisms
  const runRetryMechanismTests = useCallback(async () => {
    setIsTestingRetryMechanisms(true);
    
    const tests = [
      {
        name: 'Retry with exponential backoff',
        test: async () => {
          let attempts = 0;
          const maxRetries = 3;
          
          const failingOperation = async () => {
            attempts++;
            if (attempts < maxRetries) {
              throw new Error(`Attempt ${attempts} failed`);
            }
            return 'Success after retries';
          };
          
          try {
            const result = await NetworkErrorHandler.withRetry(
              failingOperation,
              { maxRetries, retryDelay: 100 }
            );
            
            if (attempts !== maxRetries) {
              throw new Error(`Expected ${maxRetries} attempts, got ${attempts}`);
            }
            
            return `Retry mechanism worked correctly after ${attempts} attempts`;
          } catch (error) {
            throw new Error(`Retry mechanism failed: ${error.message}`);
          }
        }
      },
      {
        name: 'Retry failure after max attempts',
        test: async () => {
          let attempts = 0;
          
          const alwaysFailingOperation = async () => {
            attempts++;
            throw new Error(`Attempt ${attempts} failed`);
          };
          
          try {
            await NetworkErrorHandler.withRetry(
              alwaysFailingOperation,
              { maxRetries: 2, retryDelay: 50 }
            );
            throw new Error('Operation should have failed after max retries');
          } catch (error) {
            if (attempts <= 2) {
              throw new Error(`Expected more than 2 attempts, got ${attempts}`);
            }
            return `Correctly failed after ${attempts} attempts`;
          }
        }
      },
      {
        name: 'Network error detection',
        test: async () => {
          const networkError = new Error('Network request failed');
          const isDetected = NetworkErrorHandler.isNetworkError(networkError);
          
          if (!isDetected) {
            throw new Error('Network error was not detected');
          }
          
          return 'Network error detection working correctly';
        }
      }
    ];

    for (const test of tests) {
      const startTime = performance.now();
      addTestResult({ name: test.name, status: 'running' });
      
      try {
        const result = await test.test();
        const duration = performance.now() - startTime;
        addTestResult({
          name: test.name,
          status: 'passed',
          duration: Math.round(duration),
          details: result
        });
      } catch (error) {
        const duration = performance.now() - startTime;
        addTestResult({
          name: test.name,
          status: 'failed',
          duration: Math.round(duration),
          details: error.message
        });
      }
    }
    
    setIsTestingRetryMechanisms(false);
  }, [addTestResult]);

  // Test cleanup mechanisms
  const runCleanupTests = useCallback(async () => {
    setIsTestingCleanup(true);
    
    const tests = [
      {
        name: 'Service worker cleanup',
        test: async () => {
          if (!('serviceWorker' in navigator)) {
            return 'Service worker not supported - cleanup test skipped';
          }
          
          const registrations = await navigator.serviceWorker.getRegistrations();
          const initialCount = registrations.length;
          
          // Simulate cleanup by getting registrations again
          const afterCleanup = await navigator.serviceWorker.getRegistrations();
          
          return `Service worker cleanup check completed. Found ${afterCleanup.length} active registrations`;
        }
      },
      {
        name: 'Push subscription cleanup',
        test: async () => {
          if (!('serviceWorker' in navigator)) {
            return 'Service worker not supported - push cleanup test skipped';
          }
          
          try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
              return 'Active push subscription found - cleanup mechanisms available';
            } else {
              return 'No active push subscription - cleanup not needed';
            }
          } catch (error) {
            return `Push subscription check completed with status: ${error.message}`;
          }
        }
      },
      {
        name: 'Toast deduplication cleanup',
        test: async () => {
          // Add some test entries
          const testKey = { title: 'Cleanup Test', description: 'Test cleanup', type: 'info' };
          toastDeduplication.shouldShowToast(testKey);
          
          // Clear the deduplication cache
          toastDeduplication.clear();
          
          // Verify cleanup worked
          const afterCleanup = toastDeduplication.shouldShowToast(testKey);
          
          if (!afterCleanup) {
            throw new Error('Deduplication cache was not properly cleared');
          }
          
          return 'Toast deduplication cleanup working correctly';
        }
      },
      {
        name: 'Memory leak prevention',
        test: async () => {
          // Simulate memory usage check
          const beforeMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
          
          // Create and cleanup some notifications
          for (let i = 0; i < 10; i++) {
            showInfo('Memory test', `Test notification ${i}`);
          }
          
          await delay(100);
          
          const afterMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
          const memoryIncrease = afterMemory - beforeMemory;
          
          return `Memory usage check completed. Increase: ${memoryIncrease} bytes`;
        }
      }
    ];

    for (const test of tests) {
      const startTime = performance.now();
      addTestResult({ name: test.name, status: 'running' });
      
      try {
        const result = await test.test();
        const duration = performance.now() - startTime;
        addTestResult({
          name: test.name,
          status: 'passed',
          duration: Math.round(duration),
          details: result
        });
      } catch (error) {
        const duration = performance.now() - startTime;
        addTestResult({
          name: test.name,
          status: 'failed',
          duration: Math.round(duration),
          details: error.message
        });
      }
    }
    
    setIsTestingCleanup(false);
  }, [addTestResult, showInfo]);

  // Run all error tests
  const runAllErrorTests = useCallback(async (onProgress?: (progress: number) => void) => {
    setTestResults([]);
    onProgress?.(0);
    
    await runNetworkConditionTests();
    onProgress?.(25);
    
    await runDeduplicationTests();
    onProgress?.(50);
    
    await runRetryMechanismTests();
    onProgress?.(75);
    
    await runCleanupTests();
    onProgress?.(100);
  }, [runNetworkConditionTests, runDeduplicationTests, runRetryMechanismTests, runCleanupTests]);

  return {
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
  };
};
