
/**
 * Timeout manager for authentication operations
 * Helps prevent stuck auth states by providing configurable timeouts
 */

interface TimeoutConfig {
  operation: string;
  timeoutMs: number;
  onTimeout: () => void;
  onCancel?: () => void;
}

class TimeoutManager {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();
  private defaultTimeout = 15000; // 15 seconds

  /**
   * Set a timeout for an operation
   */
  setTimeout(config: TimeoutConfig): string {
    const { operation, timeoutMs, onTimeout, onCancel } = config;
    
    // Clear existing timeout for this operation
    this.clearTimeout(operation);
    
    const timeoutId = setTimeout(() => {
      console.log(`Timeout reached for operation: ${operation}`);
      this.timeouts.delete(operation);
      onTimeout();
    }, timeoutMs);
    
    this.timeouts.set(operation, timeoutId);
    
    console.log(`Set timeout for ${operation}: ${timeoutMs}ms`);
    
    return operation;
  }

  /**
   * Clear a specific timeout
   */
  clearTimeout(operation: string): boolean {
    const timeoutId = this.timeouts.get(operation);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(operation);
      console.log(`Cleared timeout for operation: ${operation}`);
      return true;
    }
    return false;
  }

  /**
   * Clear all timeouts
   */
  clearAllTimeouts(): void {
    this.timeouts.forEach((timeoutId, operation) => {
      clearTimeout(timeoutId);
      console.log(`Cleared timeout for operation: ${operation}`);
    });
    this.timeouts.clear();
  }

  /**
   * Check if an operation has an active timeout
   */
  hasTimeout(operation: string): boolean {
    return this.timeouts.has(operation);
  }

  /**
   * Get all active timeout operations
   */
  getActiveTimeouts(): string[] {
    return Array.from(this.timeouts.keys());
  }

  /**
   * Set a timeout for auth initialization
   */
  setAuthInitTimeout(onTimeout: () => void, timeoutMs = this.defaultTimeout): string {
    return this.setTimeout({
      operation: 'auth_init',
      timeoutMs,
      onTimeout
    });
  }

  /**
   * Set a timeout for session recovery
   */
  setRecoveryTimeout(onTimeout: () => void, timeoutMs = 10000): string {
    return this.setTimeout({
      operation: 'session_recovery',
      timeoutMs,
      onTimeout
    });
  }

  /**
   * Set a timeout for user type determination
   */
  setUserTypeTimeout(onTimeout: () => void, timeoutMs = 5000): string {
    return this.setTimeout({
      operation: 'user_type_determination',
      timeoutMs,
      onTimeout
    });
  }

  /**
   * Set a timeout for navigation readiness
   */
  setNavigationTimeout(onTimeout: () => void, timeoutMs = 8000): string {
    return this.setTimeout({
      operation: 'navigation_ready',
      timeoutMs,
      onTimeout
    });
  }

  /**
   * Cleanup when component unmounts
   */
  cleanup(): void {
    this.clearAllTimeouts();
  }
}

// Export singleton instance
export const timeoutManager = new TimeoutManager();

// Export utility functions for common timeout scenarios
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
};

export const createTimeoutPromise = (timeoutMs: number, message?: string): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message || `Timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
};
