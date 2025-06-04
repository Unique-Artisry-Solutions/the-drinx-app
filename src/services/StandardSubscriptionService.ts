
import { BaseStandardService, ServiceResponse } from './interfaces/StandardService';

export interface AppSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export interface UserSubscription {
  id: string;
  subscription_type: string;
  status: 'active' | 'inactive' | 'cancelled';
  created_at: string;
  expires_at?: string;
  // Add missing properties for component compatibility
  subscription_start: string;
  subscription_end?: string;
}

class StandardSubscriptionServiceClass extends BaseStandardService {
  protected version = '1.0.0';

  async getAvailablePlans(): Promise<AppSubscriptionPlan[]> {
    try {
      // Mock plans for now - can be replaced with real API calls
      const plans: AppSubscriptionPlan[] = [
        {
          id: 'basic',
          name: 'Basic Plan',
          price: 9.99,
          interval: 'month',
          features: ['Basic features', 'Email support']
        },
        {
          id: 'premium',
          name: 'Premium Plan',
          price: 19.99,
          interval: 'month',
          features: ['All features', 'Priority support', 'Advanced analytics']
        }
      ];
      
      return plans;
    } catch (error) {
      this.log(`Error getting plans: ${error}`, 'error');
      return [];
    }
  }

  async getUserSubscription(): Promise<UserSubscription | null> {
    try {
      // Mock subscription with all required properties
      const mockSubscription: UserSubscription = {
        id: 'mock-sub-1',
        subscription_type: 'basic',
        status: 'active',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        subscription_start: new Date().toISOString(),
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      return null; // Return null for now, can be replaced with real data
    } catch (error) {
      this.log(`Error getting user subscription: ${error}`, 'error');
      return null;
    }
  }

  async createSubscription(planId: string): Promise<ServiceResponse<{ url: string }>> {
    try {
      // Mock response - can be replaced with real Stripe integration
      return this.createResponse(true, { url: 'https://example.com/checkout' });
    } catch (error) {
      return this.createResponse(false, undefined, `Failed to create subscription: ${error}`);
    }
  }

  async cancelSubscription(): Promise<ServiceResponse<void>> {
    try {
      // Mock cancellation - can be replaced with real API calls
      return this.createResponse(true);
    } catch (error) {
      return this.createResponse(false, undefined, `Failed to cancel subscription: ${error}`);
    }
  }

  async checkSubscriptionStatus(): Promise<ServiceResponse<UserSubscription | null>> {
    try {
      const subscription = await this.getUserSubscription();
      return this.createResponse(true, subscription);
    } catch (error) {
      return this.createResponse(false, null, `Failed to check subscription status: ${error}`);
    }
  }
}

export const standardSubscriptionService = new StandardSubscriptionServiceClass();
