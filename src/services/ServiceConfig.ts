
// Service configuration and dependency management
// Centralizes service initialization and configuration

interface ServiceConfig {
  isDevelopment: boolean;
  enableLogging: boolean;
  enableCaching: boolean;
  retryAttempts: number;
  timeoutMs: number;
}

class ServiceConfigManager {
  private config: ServiceConfig;

  constructor() {
    this.config = {
      isDevelopment: import.meta.env.DEV || false,
      enableLogging: import.meta.env.DEV || false,
      enableCaching: true,
      retryAttempts: 3,
      timeoutMs: 10000
    };
  }

  getConfig(): ServiceConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<ServiceConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Service-specific configurations
  getAdminServiceConfig() {
    return {
      enableLogging: this.config.enableLogging,
      retryAttempts: this.config.retryAttempts,
      timeout: this.config.timeoutMs
    };
  }

  getNotificationServiceConfig() {
    return {
      enableToast: true,
      enablePush: !this.config.isDevelopment,
      enableEmail: !this.config.isDevelopment
    };
  }

  getEventServiceConfig() {
    return {
      enableAccessTokens: true,
      tokenExpiryDays: 30,
      enableAnalytics: true
    };
  }
}

export const serviceConfig = new ServiceConfigManager();
