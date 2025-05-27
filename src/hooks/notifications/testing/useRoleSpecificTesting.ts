
import { useState, useCallback } from 'react';
import { TestResult, TestingHookReturn } from '@/types/notification/TestingTypes';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'promoter' | 'establishment' | 'admin' | 'individual';

export interface RoleSpecificTestConfig {
  role: UserRole;
  targetUserId?: string;
  campaignId?: string;
  followerSegment?: string;
  systemAlertType?: string;
}

export const useRoleSpecificTesting = (): TestingHookReturn & {
  config: RoleSpecificTestConfig;
  setConfig: (config: RoleSpecificTestConfig) => void;
  runRoleTests: (role: UserRole) => Promise<void>;
} => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>();
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<RoleSpecificTestConfig>({
    role: 'promoter'
  });
  const { toast } = useToast();

  const getTestsForRole = (role: UserRole): string[] => {
    switch (role) {
      case 'promoter':
        return [
          'Follower targeting notifications',
          'Campaign launch notifications',
          'Event promotion broadcasts',
          'Revenue milestone alerts',
          'Audience growth notifications',
          'Marketing campaign analytics',
          'Cross-promotion coordination',
          'Subscriber tier notifications'
        ];
      case 'establishment':
        return [
          'Customer visit notifications',
          'Promotion redemption alerts',
          'Review and rating notifications',
          'Inventory low stock alerts',
          'Staff scheduling notifications',
          'Revenue report notifications',
          'Customer feedback alerts',
          'Event booking confirmations'
        ];
      case 'admin':
        return [
          'System health monitoring alerts',
          'User activity anomaly detection',
          'Financial transaction monitoring',
          'Content moderation notifications',
          'Security breach alerts',
          'Performance threshold warnings',
          'Database integrity notifications',
          'Compliance monitoring alerts'
        ];
      case 'individual':
        return [
          'Event recommendations',
          'Friend activity notifications',
          'Nearby establishment alerts',
          'Reward earning notifications',
          'Social interaction updates',
          'Preference-based suggestions',
          'Location-based promotions',
          'Achievement unlocks'
        ];
      default:
        return [];
    }
  };

  const runSingleTest = useCallback(async (testName: string): Promise<void> => {
    const startTime = performance.now();
    setCurrentTest(testName);
    
    try {
      // Simulate role-specific test execution with different complexities
      const testDuration = Math.random() * 3000 + 1000;
      await new Promise(resolve => setTimeout(resolve, testDuration));
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Role-specific success rates
      const successRates = {
        promoter: 0.85,
        establishment: 0.90,
        admin: 0.95,
        individual: 0.88
      };
      
      const isSuccess = Math.random() < successRates[config.role];
      
      const result: TestResult = {
        name: testName,
        status: isSuccess ? 'passed' : 'failed',
        message: isSuccess 
          ? `${config.role} notification test completed successfully`
          : `${config.role} notification test failed - check role permissions`,
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
  }, [config.role]);

  const runRoleTests = useCallback(async (role: UserRole): Promise<void> => {
    setConfig(prev => ({ ...prev, role }));
    setIsRunning(true);
    setProgress(0);
    setError(null);
    setResults([]);

    const tests = getTestsForRole(role);

    try {
      for (let i = 0; i < tests.length; i++) {
        await runSingleTest(tests[i]);
        setProgress(((i + 1) / tests.length) * 100);
      }

      toast({
        title: "Role-specific tests completed",
        description: `${role} notification tests have been executed`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsRunning(false);
      setCurrentTest(undefined);
    }
  }, [runSingleTest, toast]);

  const runTests = useCallback(async (): Promise<void> => {
    return runRoleTests(config.role);
  }, [runRoleTests, config.role]);

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
    config,
    setConfig,
    runTests,
    runSingleTest,
    runRoleTests,
    clearResults,
    retryFailedTests
  };
};
