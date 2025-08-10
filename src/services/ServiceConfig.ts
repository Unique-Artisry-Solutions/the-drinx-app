
// Service Configuration - Phase 9D
// Configuration management for services

interface ServiceConfigData {
  enableLogging: boolean;
  enableMetrics: boolean;
  defaultTimeout: number;
  defaultRetries: number;
  security: {
    deviceRiskBlock: number; // 0-100
    deviceRiskReview: number; // 0-100
    amountSpikeFactor: number; // e.g., 3x avg
    absoluteHighAmountCents: number; // e.g., 200000 = $2000
    bin: { blockRestricted: boolean };
  };
}

class ServiceConfigClass {
  private config: ServiceConfigData = {
    enableLogging: process.env.NODE_ENV === 'development',
    enableMetrics: true,
    defaultTimeout: 10000,
    defaultRetries: 3,
    security: process.env.NODE_ENV === 'development'
      ? { deviceRiskBlock: 95, deviceRiskReview: 80, amountSpikeFactor: 4, absoluteHighAmountCents: 300000, bin: { blockRestricted: true } }
      : { deviceRiskBlock: 95, deviceRiskReview: 80, amountSpikeFactor: 3, absoluteHighAmountCents: 200000, bin: { blockRestricted: true } }
  };

  getConfig(): ServiceConfigData {
    return { ...this.config };
  }

  updateConfig(updates: Partial<ServiceConfigData>): void {
    this.config = { ...this.config, ...updates };
  }
}

export const serviceConfig = new ServiceConfigClass();
