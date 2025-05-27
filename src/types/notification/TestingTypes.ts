
/**
 * Unified testing types for notification system
 */

export interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  duration?: number;
  retryCount?: number;
  error?: string;
  timestamp?: number;
}

export interface TestingState {
  isRunning: boolean;
  progress: number;
  currentTest?: string;
  results: TestResult[];
  error: string | null;
}

export interface TestingHookReturn {
  // State
  isRunning: boolean;
  progress: number;
  currentTest?: string;
  results: TestResult[];
  error: string | null;
  
  // Actions
  runTests: () => Promise<void>;
  runSingleTest: (testName: string) => Promise<void>;
  clearResults: () => void;
  retryFailedTests: () => Promise<void>;
}

export interface PerformanceMetrics {
  memoryUsage?: {
    used: number;
    total: number;
  };
  timing: {
    startTime: number;
    endTime?: number;
    duration?: number;
  };
}

export interface TestConfig {
  timeout: number;
  retryAttempts: number;
  enablePerformanceTracking: boolean;
}
