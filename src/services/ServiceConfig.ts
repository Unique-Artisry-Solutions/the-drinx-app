
// Service Configuration - Phase 3: Enhanced for Standardized Services
import type { StandardServiceConfig } from './interfaces/StandardService';

interface GlobalServiceConfig extends StandardServiceConfig {
  enableHealthChecks: boolean;
  healthCheckInterval: number;
  maxRetryAttempts: number;
  defaultTimeout: number;
  enableAnalytics: boolean;
}

class ServiceConfigClass {
  private config: GlobalServiceConfig = {
    enableLogging: process.env.NODE_ENV !== 'production',
    enableMetrics: true,
    enableHealthChecks: true,
    healthCheckInterval: 30000, // 30 seconds
    retryAttempts: 3,
    maxRetryAttempts: 5,
    timeout: 10000,
    defaultTimeout: 15000,
    enableAnalytics: true
  };

  getConfig(): GlobalServiceConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<GlobalServiceConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  getServiceConfig(serviceName: string): StandardServiceConfig {
    return {
      enableLogging: this.config.enableLogging,
      enableMetrics: this.config.enableMetrics,
      retryAttempts: this.config.retryAttempts,
      timeout: this.config.timeout
    };
  }

  resetToDefaults(): void {
    this.config = {
      enableLogging: process.env.NODE_ENV !== 'production',
      enableMetrics: true,
      enableHealthChecks: true,
      healthCheckInterval: 30000,
      retryAttempts: 3,
      maxRetryAttempts: 5,
      timeout: 10000,
      defaultTimeout: 15000,
      enableAnalytics: true
    };
  }
}

export const serviceConfig = new ServiceConfigClass();
