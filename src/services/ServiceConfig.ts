
// Service Configuration - Phase 9D
// Configuration management for services

interface ServiceConfigData {
  enableLogging: boolean;
  enableMetrics: boolean;
  defaultTimeout: number;
  defaultRetries: number;
}

class ServiceConfigClass {
  private config: ServiceConfigData = {
    enableLogging: process.env.NODE_ENV === 'development',
    enableMetrics: true,
    defaultTimeout: 10000,
    defaultRetries: 3
  };

  getConfig(): ServiceConfigData {
    return { ...this.config };
  }

  updateConfig(updates: Partial<ServiceConfigData>): void {
    this.config = { ...this.config, ...updates };
  }
}

export const serviceConfig = new ServiceConfigClass();
