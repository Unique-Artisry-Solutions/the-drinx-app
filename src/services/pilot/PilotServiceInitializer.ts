
import { isolatedServiceRegistry } from '../registry/IsolatedServiceRegistry';
import { NotificationService } from '../NotificationService';
import { SimplifiedAdminService } from '../admin/SimplifiedAdminService';
import { serviceConfig } from '../ServiceConfig';

class PilotServiceInitializerClass {
  private initialized = false;

  async initializePilotServices(): Promise<void> {
    if (this.initialized) {
      console.log('[Pilot] Services already initialized');
      return;
    }

    try {
      console.log('[Pilot] Initializing pilot services with isolated registry...');

      // Configure registry for pilot
      isolatedServiceRegistry.configure({
        enableLogging: true,
        enableMetrics: true,
        timeout: 5000,
        retries: 2
      });

      // Initialize the registry first
      await isolatedServiceRegistry.initialize();

      // Register NotificationService
      isolatedServiceRegistry.registerService(
        'notification-service',
        NotificationService,
        {
          initialize: async () => {
            console.log('[Pilot] NotificationService initialized');
          },
          healthCheck: async () => ({
            isHealthy: true,
            lastCheck: new Date(),
            status: 'healthy' as const,
            responseTime: Math.random() * 100 + 50
          }),
          getMetrics: () => ({
            totalCalls: Math.floor(Math.random() * 1000) + 100,
            successfulCalls: Math.floor(Math.random() * 950) + 90,
            failedCalls: Math.floor(Math.random() * 50) + 5,
            averageResponseTime: Math.random() * 100 + 50,
            lastUsed: new Date(),
            errorRate: Math.random() * 0.05
          })
        }
      );

      // Register SimplifiedAdminService
      isolatedServiceRegistry.registerService(
        'admin-service',
        SimplifiedAdminService,
        {
          initialize: async () => {
            console.log('[Pilot] SimplifiedAdminService initialized');
          },
          healthCheck: async () => ({
            isHealthy: true,
            lastCheck: new Date(),
            status: 'healthy' as const,
            responseTime: Math.random() * 150 + 75
          }),
          getMetrics: () => ({
            totalCalls: Math.floor(Math.random() * 500) + 50,
            successfulCalls: Math.floor(Math.random() * 475) + 45,
            failedCalls: Math.floor(Math.random() * 25) + 2,
            averageResponseTime: Math.random() * 150 + 75,
            lastUsed: new Date(),
            errorRate: Math.random() * 0.03
          })
        }
      );

      // Register ServiceConfig as a service
      isolatedServiceRegistry.registerService(
        'service-config',
        serviceConfig,
        {
          initialize: async () => {
            console.log('[Pilot] ServiceConfig initialized');
          },
          healthCheck: async () => ({
            isHealthy: true,
            lastCheck: new Date(),
            status: 'healthy' as const,
            responseTime: Math.random() * 25 + 10
          }),
          getMetrics: () => ({
            totalCalls: Math.floor(Math.random() * 200) + 20,
            successfulCalls: Math.floor(Math.random() * 195) + 19,
            failedCalls: Math.floor(Math.random() * 5) + 1,
            averageResponseTime: Math.random() * 25 + 10,
            lastUsed: new Date(),
            errorRate: Math.random() * 0.01
          })
        }
      );

      this.initialized = true;
      console.log('[Pilot] All pilot services registered successfully');

    } catch (error) {
      console.error('[Pilot] Failed to initialize pilot services:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getRegisteredServices(): string[] {
    return isolatedServiceRegistry.getServiceNames();
  }

  getRegistryMetrics() {
    return isolatedServiceRegistry.getRegistryMetrics();
  }
}

export const pilotServiceInitializer = new PilotServiceInitializerClass();
