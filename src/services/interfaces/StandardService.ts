
// Standard Service Interface - Phase 3
// All services should implement this interface for consistency

export interface StandardServiceConfig {
  enableLogging?: boolean;
  retryAttempts?: number;
  timeout?: number;
  enableMetrics?: boolean;
}

export interface StandardServiceMethods {
  initialize?(config?: StandardServiceConfig): Promise<void> | void;
  healthCheck?(): Promise<boolean> | boolean;
  cleanup?(): Promise<void> | void;
  getVersion?(): string;
  getStatus?(): 'active' | 'inactive' | 'error';
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  serviceVersion?: string;
}

export abstract class BaseStandardService implements StandardServiceMethods {
  protected config: StandardServiceConfig = {
    enableLogging: true,
    retryAttempts: 3,
    timeout: 10000,
    enableMetrics: true
  };

  protected version: string = '1.0.0';
  protected status: 'active' | 'inactive' | 'error' = 'inactive';

  initialize(config?: StandardServiceConfig): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.status = 'active';
    if (this.config.enableLogging) {
      console.log(`${this.constructor.name} initialized`);
    }
  }

  healthCheck(): boolean {
    return this.status === 'active';
  }

  cleanup(): void {
    this.status = 'inactive';
    if (this.config.enableLogging) {
      console.log(`${this.constructor.name} cleaned up`);
    }
  }

  getVersion(): string {
    return this.version;
  }

  getStatus(): 'active' | 'inactive' | 'error' {
    return this.status;
  }

  protected createResponse<T>(success: boolean, data?: T, error?: string): ServiceResponse<T> {
    return {
      success,
      data,
      error,
      timestamp: new Date(),
      serviceVersion: this.version
    };
  }

  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    if (this.config.enableLogging) {
      console[level](`[${this.constructor.name}] ${message}`);
    }
  }
}
