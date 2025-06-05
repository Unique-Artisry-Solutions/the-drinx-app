
// Phase 3 Alternative: Standardized Service Interfaces (Additive Only)
// These interfaces provide a standard contract for services without breaking existing ones

export interface StandardServiceConfig {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  timeout?: number;
  retries?: number;
}

export interface StandardServiceMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  lastUsed: Date;
  errorRate: number;
}

export interface StandardServiceHealth {
  isHealthy: boolean;
  lastCheck: Date;
  responseTime?: number;
  error?: string;
  status: 'healthy' | 'degraded' | 'error' | 'unknown';
}

export interface StandardServiceInterface {
  // Core service methods
  initialize?(): Promise<void>;
  destroy?(): Promise<void>;
  
  // Health and monitoring
  healthCheck?(): Promise<StandardServiceHealth>;
  getMetrics?(): StandardServiceMetrics;
  
  // Configuration
  configure?(config: Partial<StandardServiceConfig>): void;
  getConfig?(): StandardServiceConfig;
}

export interface ServiceWrapper<T = any> {
  service: T;
  metadata: {
    name: string;
    version: string;
    initialized: boolean;
    lastUsed: Date;
  };
  standardInterface?: StandardServiceInterface;
}
