
// Service Proxy - Phase 9D
// Wrapper for service calls with monitoring and error handling

import { serviceRegistry } from './ServiceRegistry';
import { serviceConfig } from './ServiceConfig';

interface ServiceCallOptions {
  timeout?: number;
  retries?: number;
  trackMetrics?: boolean;
}

interface ServiceWithHealthCheck {
  healthCheck?: () => Promise<boolean> | boolean;
  [key: string]: any;
}

export class ServiceProxy {
  static async call<T>(
    serviceName: string,
    methodName: string,
    args: any[] = [],
    options: ServiceCallOptions = {}
  ): Promise<T> {
    const {
      timeout = 10000,
      retries = 3,
      trackMetrics = true
    } = options;

    const config = serviceConfig.getConfig();
    const startTime = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const service = serviceRegistry.getService(serviceName);
        if (!service) {
          throw new Error(`Service '${serviceName}' not found in registry`);
        }

        if (typeof service[methodName] !== 'function') {
          throw new Error(`Method '${methodName}' not found on service '${serviceName}'`);
        }

        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`Service call timed out after ${timeout}ms`)), timeout);
        });

        // Execute service method with timeout
        const resultPromise = service[methodName](...args);
        const result = await Promise.race([resultPromise, timeoutPromise]);

        const responseTime = Date.now() - startTime;

        // Track successful call
        if (trackMetrics) {
          serviceRegistry.trackServiceUsage(serviceName, true, responseTime);
        }

        if (config.enableLogging) {
          console.log(`Service call succeeded: ${serviceName}.${methodName} (${responseTime}ms)`);
        }

        return result;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        const responseTime = Date.now() - startTime;

        if (config.enableLogging) {
          console.error(`Service call failed (attempt ${attempt + 1}): ${serviceName}.${methodName}`, lastError);
        }

        // Track failed call
        if (trackMetrics) {
          serviceRegistry.trackServiceUsage(serviceName, false, responseTime);
        }

        // Don't retry on the last attempt
        if (attempt === retries) {
          break;
        }

        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw lastError || new Error(`Service call failed after ${retries + 1} attempts`);
  }

  // Convenience methods for common service calls
  static async analytics<T>(methodName: string, ...args: any[]): Promise<T> {
    return this.call<T>('analytics', methodName, args);
  }

  static async notifications<T>(methodName: string, ...args: any[]): Promise<T> {
    return this.call<T>('notifications', methodName, args);
  }

  static async admin<T>(methodName: string, ...args: any[]): Promise<T> {
    return this.call<T>('admin', methodName, args);
  }

  // Health check for a specific service
  static async healthCheck(serviceName: string): Promise<boolean> {
    try {
      const service = serviceRegistry.getService(serviceName) as ServiceWithHealthCheck;
      if (!service) return false;

      if (typeof service.healthCheck === 'function') {
        return await service.healthCheck();
      }

      // If no health check method, assume healthy if service exists
      return true;
    } catch (error) {
      console.error(`Health check failed for service ${serviceName}:`, error);
      return false;
    }
  }
}
