
/**
 * Fallback mechanisms for analytics logging failures
 */

// In-memory fallback storage
class AnalyticsFallbackStorage {
  private errorQueue: any[] = [];
  private performanceQueue: any[] = [];
  private maxQueueSize = 100;
  private retryAttempts = 3;
  private retryDelay = 5000; // 5 seconds

  // Add error to fallback queue
  addError(error: any): void {
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest item
    }
    this.errorQueue.push({
      ...error,
      fallbackTimestamp: new Date().toISOString(),
      retryCount: 0
    });
  }

  // Add performance metric to fallback queue
  addPerformanceMetric(metric: any): void {
    if (this.performanceQueue.length >= this.maxQueueSize) {
      this.performanceQueue.shift(); // Remove oldest item
    }
    this.performanceQueue.push({
      ...metric,
      fallbackTimestamp: new Date().toISOString(),
      retryCount: 0
    });
  }

  // Get queued items for retry
  getQueuedErrors(): any[] {
    return [...this.errorQueue];
  }

  getQueuedPerformance(): any[] {
    return [...this.performanceQueue];
  }

  // Remove items from queue after successful processing
  removeProcessedErrors(processedIds: string[]): void {
    this.errorQueue = this.errorQueue.filter(
      item => !processedIds.includes(item.fallbackTimestamp)
    );
  }

  removeProcessedPerformance(processedIds: string[]): void {
    this.performanceQueue = this.performanceQueue.filter(
      item => !processedIds.includes(item.fallbackTimestamp)
    );
  }

  // Increment retry count
  incrementRetryCount(items: any[]): void {
    items.forEach(item => {
      item.retryCount = (item.retryCount || 0) + 1;
    });
  }

  // Check if item should be retried
  shouldRetry(item: any): boolean {
    return (item.retryCount || 0) < this.retryAttempts;
  }

  // Get queue sizes for monitoring
  getQueueSizes(): { errors: number; performance: number } {
    return {
      errors: this.errorQueue.length,
      performance: this.performanceQueue.length
    };
  }

  // Clear queues (for testing or manual intervention)
  clearQueues(): void {
    this.errorQueue = [];
    this.performanceQueue = [];
  }
}

// Singleton instance
export const analyticsFallback = new AnalyticsFallbackStorage();

// Safe execution wrapper
export async function safeExecute<T>(
  operation: () => Promise<T>,
  fallbackHandler?: (error: Error) => void,
  context?: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Safe execution failed${context ? ` in ${context}` : ''}:`, errorMessage);
    
    if (fallbackHandler) {
      try {
        fallbackHandler(error as Error);
      } catch (fallbackError) {
        console.error('Fallback handler failed:', fallbackError);
      }
    }
    
    return null;
  }
}

// Retry mechanism with exponential backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  context?: string
): Promise<T | null> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        console.error(`All retry attempts failed${context ? ` for ${context}` : ''}:`, lastError.message);
        break;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`Attempt ${attempt + 1} failed${context ? ` for ${context}` : ''}, retrying in ${delay}ms:`, lastError.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return null;
}

// Graceful degradation for analytics operations
export function createGracefulAnalytics<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  fallbackAction?: (...args: Parameters<T>) => void
): T {
  return (async (...args: Parameters<T>) => {
    const result = await safeExecute(
      () => operation(...args),
      (error) => {
        if (fallbackAction) {
          fallbackAction(...args);
        }
      },
      operation.name
    );
    
    return result;
  }) as T;
}

// Health check for analytics system
export function getAnalyticsHealth(): {
  status: 'healthy' | 'degraded' | 'offline';
  queueSizes: { errors: number; performance: number };
  issues: string[];
} {
  const queueSizes = analyticsFallback.getQueueSizes();
  const issues: string[] = [];
  
  if (queueSizes.errors > 50) {
    issues.push('Error queue is getting large');
  }
  
  if (queueSizes.performance > 50) {
    issues.push('Performance queue is getting large');
  }
  
  let status: 'healthy' | 'degraded' | 'offline' = 'healthy';
  if (issues.length > 0) {
    status = queueSizes.errors > 80 || queueSizes.performance > 80 ? 'offline' : 'degraded';
  }
  
  return {
    status,
    queueSizes,
    issues
  };
}
