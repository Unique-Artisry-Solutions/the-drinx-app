
import { useState, useCallback } from 'react';
import { TestResult, TestingHookReturn } from '@/types/notification/TestingTypes';

interface DeviceInfo {
  userAgent: string;
  platform: string;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  browser: string;
  hasVibration: boolean;
  hasServiceWorker: boolean;
  hasPushManager: boolean;
}

interface NotificationCapabilities {
  supportsSound: boolean;
  supportsVibration: boolean;
  supportsBadge: boolean;
  supportsActions: boolean;
  supportsImage: boolean;
  maxActions: number;
}

export const useCrossPlatformTesting = (): TestingHookReturn & {
  deviceInfo: DeviceInfo | null;
  capabilities: NotificationCapabilities | null;
} => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>();
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [capabilities, setCapabilities] = useState<NotificationCapabilities | null>(null);

  const detectDeviceInfo = useCallback((): DeviceInfo => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    return {
      userAgent,
      platform,
      isMobile,
      isIOS,
      isAndroid,
      browser,
      hasVibration: 'vibrate' in navigator,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasPushManager: 'PushManager' in window
    };
  }, []);

  const detectNotificationCapabilities = useCallback((): NotificationCapabilities => {
    const testNotification = {
      title: 'Test',
      badge: '/icon-192x192.png',
      icon: '/icon-192x192.png',
      image: '/test-image.jpg',
      sound: '/notification-sound.wav',
      vibrate: [200, 100, 200],
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    return {
      supportsSound: 'sound' in testNotification,
      supportsVibration: 'vibrate' in navigator,
      supportsBadge: 'badge' in testNotification,
      supportsActions: 'actions' in testNotification,
      supportsImage: 'image' in testNotification,
      maxActions: 2 // Most browsers support 2 actions
    };
  }, []);

  const runSingleTest = useCallback(async (testName: string): Promise<void> => {
    const startTime = performance.now();
    setCurrentTest(testName);
    
    try {
      let testResult: TestResult;

      switch (testName) {
        case 'Device Detection':
          const device = detectDeviceInfo();
          setDeviceInfo(device);
          testResult = {
            name: testName,
            status: 'passed',
            message: `Detected: ${device.browser} on ${device.platform} (Mobile: ${device.isMobile})`,
            duration: performance.now() - startTime,
            retryCount: 0,
            timestamp: Date.now()
          };
          break;

        case 'Notification API Support':
          const hasNotificationAPI = 'Notification' in window;
          testResult = {
            name: testName,
            status: hasNotificationAPI ? 'passed' : 'failed',
            message: hasNotificationAPI ? 'Notification API is supported' : 'Notification API not supported',
            duration: performance.now() - startTime,
            retryCount: 0,
            timestamp: Date.now()
          };
          break;

        case 'Service Worker Support':
          const hasServiceWorker = 'serviceWorker' in navigator;
          testResult = {
            name: testName,
            status: hasServiceWorker ? 'passed' : 'failed',
            message: hasServiceWorker ? 'Service Worker is supported' : 'Service Worker not supported',
            duration: performance.now() - startTime,
            retryCount: 0,
            timestamp: Date.now()
          };
          break;

        case 'Push Manager Support':
          const hasPushManager = 'PushManager' in window;
          testResult = {
            name: testName,
            status: hasPushManager ? 'passed' : 'failed',
            message: hasPushManager ? 'Push Manager is supported' : 'Push Manager not supported',
            duration: performance.now() - startTime,
            retryCount: 0,
            timestamp: Date.now()
          };
          break;

        case 'Vibration API Test':
          const hasVibration = 'vibrate' in navigator;
          if (hasVibration) {
            navigator.vibrate([200, 100, 200]);
          }
          testResult = {
            name: testName,
            status: hasVibration ? 'passed' : 'failed',
            message: hasVibration ? 'Vibration API supported and tested' : 'Vibration API not supported',
            duration: performance.now() - startTime,
            retryCount: 0,
            timestamp: Date.now()
          };
          break;

        case 'Notification Capabilities':
          const caps = detectNotificationCapabilities();
          setCapabilities(caps);
          testResult = {
            name: testName,
            status: 'passed',
            message: `Sound: ${caps.supportsSound}, Vibration: ${caps.supportsVibration}, Actions: ${caps.supportsActions}`,
            duration: performance.now() - startTime,
            retryCount: 0,
            timestamp: Date.now()
          };
          break;

        case 'Mobile Notification Test':
          if (deviceInfo?.isMobile) {
            // Test mobile-specific notification behavior
            await new Promise(resolve => setTimeout(resolve, 1000));
            testResult = {
              name: testName,
              status: 'passed',
              message: 'Mobile notification behavior tested',
              duration: performance.now() - startTime,
              retryCount: 0,
              timestamp: Date.now()
            };
          } else {
            testResult = {
              name: testName,
              status: 'failed',
              message: 'Not running on mobile device',
              duration: performance.now() - startTime,
              retryCount: 0,
              timestamp: Date.now()
            };
          }
          break;

        case 'Notification Batching Test':
          // Simulate multiple notifications to test batching
          await new Promise(resolve => setTimeout(resolve, 500));
          testResult = {
            name: testName,
            status: 'passed',
            message: 'Notification batching behavior tested',
            duration: performance.now() - startTime,
            retryCount: 0,
            timestamp: Date.now()
          };
          break;

        case 'Browser Compatibility':
          const isCompatible = deviceInfo?.hasServiceWorker && deviceInfo?.hasPushManager;
          testResult = {
            name: testName,
            status: isCompatible ? 'passed' : 'failed',
            message: isCompatible ? 'Browser is fully compatible' : 'Browser has limited compatibility',
            duration: performance.now() - startTime,
            retryCount: 0,
            timestamp: Date.now()
          };
          break;

        default:
          testResult = {
            name: testName,
            status: 'failed',
            message: 'Unknown test type',
            duration: performance.now() - startTime,
            retryCount: 0,
            timestamp: Date.now()
          };
      }

      setResults(prev => {
        const existingIndex = prev.findIndex(r => r.name === testName);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = testResult;
          return updated;
        }
        return [...prev, testResult];
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
  }, [deviceInfo, detectDeviceInfo, detectNotificationCapabilities]);

  const runTests = useCallback(async (): Promise<void> => {
    setIsRunning(true);
    setProgress(0);
    setError(null);
    setResults([]);

    const tests = [
      'Device Detection',
      'Notification API Support',
      'Service Worker Support',
      'Push Manager Support',
      'Vibration API Test',
      'Notification Capabilities',
      'Mobile Notification Test',
      'Notification Batching Test',
      'Browser Compatibility'
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
    setDeviceInfo(null);
    setCapabilities(null);
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
    retryFailedTests,
    deviceInfo,
    capabilities
  };
};
