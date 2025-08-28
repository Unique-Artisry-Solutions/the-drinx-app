// Service Registry Implementation - Concrete DI Container
// Wires real implementations for production use

import { supabase } from '@/lib/supabase';
import { NotificationService } from './NotificationService';
import { realTimeFollowerNotificationService } from './RealTimeFollowerNotificationService';
import { serviceRegistry } from './ServiceRegistry';
import type { 
  IAuthService, 
  INotificationService, 
  IRealTimeNotificationService, 
  IPaymentService,
  IServiceRegistry 
} from './ServiceRegistry';

// Concrete Auth Service Implementation
class SupabaseAuthService implements IAuthService {
  async getSession() {
    return await supabase.auth.getSession();
  }

  async signInWithPassword(credentials: { email: string; password: string }) {
    return await supabase.auth.signInWithPassword(credentials);
  }

  async signUp(data: { email: string; password: string; options?: { data?: Record<string, any> } }) {
    return await supabase.auth.signUp(data);
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  async refreshSession() {
    return await supabase.auth.refreshSession();
  }

  async updateUser(data: Record<string, any>) {
    return await supabase.auth.updateUser(data);
  }

  async resend(options: { type: 'signup' | 'email_change'; email: string; options?: { emailRedirectTo?: string } }) {
    return await supabase.auth.resend(options);
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  async rpc(functionName: string, params: Record<string, any>): Promise<{ error: any | null }> {
    // Cast to any to handle dynamic function names
    return await (supabase as any).rpc(functionName, params);
  }
}

// Concrete Notification Service Implementation
class AppNotificationService implements INotificationService {
  subscribeToNotifications(callback: (notification: any) => void) {
    return NotificationService.subscribe(callback);
  }

  async markAsRead(id: string) {
    NotificationService.markAsRead(id);
  }

  async markAllAsRead() {
    NotificationService.markAllAsRead();
  }

  async sendNotification(notification: any) {
    NotificationService.addNotification(notification);
  }

  async getUnreadCount() {
    return NotificationService.getUnreadCount();
  }
}

// Real-time Notification Service Wrapper
class RealTimeNotificationServiceWrapper implements IRealTimeNotificationService {
  setToast(toast: any) {
    realTimeFollowerNotificationService.setToast(toast);
  }

  subscribeToPromoterNotifications(promoterId: string, callback: (notification: any) => void) {
    realTimeFollowerNotificationService.subscribeToPromoterNotifications(promoterId, callback);
  }

  unsubscribeFromPromoterNotifications(promoterId: string) {
    realTimeFollowerNotificationService.unsubscribeFromPromoterNotifications(promoterId);
  }

  async sendRealtimeNotificationToFollowers(promoterId: string, data: any) {
    return realTimeFollowerNotificationService.sendRealtimeNotificationToFollowers(promoterId, data);
  }

  cleanup() {
    realTimeFollowerNotificationService.cleanup();
  }
}

// Mock Payment Service (placeholder implementation)
class MockPaymentService implements IPaymentService {
  async processPayment(amount: number, method: string) {
    // Mock implementation - replace with actual payment processor
    console.log(`Processing payment: $${amount} via ${method}`);
    return { success: true, transactionId: `txn_${Date.now()}` };
  }

  async refundPayment(transactionId: string) {
    console.log(`Refunding payment: ${transactionId}`);
    return { success: true };
  }

  async getPaymentHistory(userId: string) {
    console.log(`Getting payment history for user: ${userId}`);
    return [];
  }
}

// Service Registry Implementation with DI Container
class ServiceRegistryImpl {
  private registry: IServiceRegistry;
  private initialized = false;

  constructor() {
    this.registry = serviceRegistry;
  }

  async initialize() {
    if (this.initialized) return;

    // Register concrete service implementations
    this.registry.registerService<IAuthService>('auth', new SupabaseAuthService());
    this.registry.registerService<INotificationService>('notifications', new AppNotificationService());
    this.registry.registerService<IRealTimeNotificationService>('realTimeNotifications', new RealTimeNotificationServiceWrapper());
    this.registry.registerService<IPaymentService>('payments', new MockPaymentService());

    await this.registry.initialize();
    this.initialized = true;
    
    console.log('🏭 ServiceRegistryImpl - All services registered and initialized');
  }

  getAuthService(): IAuthService | null {
    return this.registry.getService<IAuthService>('auth');
  }

  getNotificationService(): INotificationService | null {
    return this.registry.getService<INotificationService>('notifications');
  }

  getRealTimeNotificationService(): IRealTimeNotificationService | null {
    return this.registry.getService<IRealTimeNotificationService>('realTimeNotifications');
  }

  getPaymentService(): IPaymentService | null {
    return this.registry.getService<IPaymentService>('payments');
  }

  // Expose registry for advanced usage
  getRegistry(): IServiceRegistry {
    return this.registry;
  }
}

// Export singleton instance
export const serviceRegistryImpl = new ServiceRegistryImpl();

// Export for convenience in components
export { type IAuthService, type INotificationService, type IRealTimeNotificationService, type IPaymentService };