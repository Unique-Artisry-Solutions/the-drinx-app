
// Common service utilities and helpers
// Provides shared functionality across all services

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface ServiceOptions {
  timeout?: number;
  retryAttempts?: number;
  enableLogging?: boolean;
}

export class ServiceUtils {
  // Create standardized service response
  static createResponse<T>(
    success: boolean, 
    data?: T, 
    error?: string
  ): ServiceResponse<T> {
    return {
      success,
      data,
      error,
      timestamp: Date.now()
    };
  }

  // Success response helper
  static success<T>(data?: T): ServiceResponse<T> {
    return this.createResponse(true, data);
  }

  // Error response helper
  static error(message: string): ServiceResponse {
    return this.createResponse(false, undefined, message);
  }

  // Retry logic for service operations
  static async withRetry<T>(
    operation: () => Promise<T>,
    options: ServiceOptions = {}
  ): Promise<T> {
    const { retryAttempts = 3, timeout = 10000, enableLogging = false } = options;
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Operation timeout')), timeout)
        );
        
        const result = await Promise.race([operation(), timeoutPromise]);
        
        if (enableLogging) {
          console.log(`ServiceUtils: Operation succeeded on attempt ${attempt}`);
        }
        
        return result;
      } catch (error) {
        if (enableLogging) {
          console.warn(`ServiceUtils: Attempt ${attempt} failed:`, error);
        }
        
        if (attempt === retryAttempts) {
          throw error;
        }
        
        // Exponential backoff
        await this.delay(Math.pow(2, attempt - 1) * 1000);
      }
    }
    
    throw new Error('All retry attempts failed');
  }

  // Delay utility for retries
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Sanitize service input
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input.trim();
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    
    return input;
  }

  // Validate required fields
  static validateRequired(data: any, requiredFields: string[]): string[] {
    const missing: string[] = [];
    
    for (const field of requiredFields) {
      if (!data || data[field] === undefined || data[field] === null || data[field] === '') {
        missing.push(field);
      }
    }
    
    return missing;
  }
}
