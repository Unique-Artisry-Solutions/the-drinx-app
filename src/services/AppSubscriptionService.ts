
import { supabase } from '@/lib/supabase';
import { enhancedPaymentService } from './enhancedPaymentService';

export interface AppSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export interface UserAppSubscription {
  id: string;
  user_id: string;
  subscription_type: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  subscription_start: string;
  subscription_end: string | null;
  payment_provider: string | null;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}

class AppSubscriptionService {
  // Available app subscription plans
  private readonly plans: AppSubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Access to all app features',
        'Follow unlimited promoters',
        'Basic notifications',
        'Event discovery'
      ],
      stripePriceId: 'price_basic_monthly' // Replace with actual Stripe price ID
    },
    {
      id: 'premium',
      name: 'Premium Plan', 
      price: 19.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'All Basic features',
        'Advanced analytics',
        'Priority support',
        'Early access to new features',
        'Custom notifications'
      ],
      stripePriceId: 'price_premium_monthly' // Replace with actual Stripe price ID
    }
  ];

  async getAvailablePlans(): Promise<AppSubscriptionPlan[]> {
    return this.plans;
  }

  async getUserSubscription(): Promise<UserAppSubscription | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('app_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Error fetching app subscription:', error);
      return null;
    }

    return data as UserAppSubscription;
  }

  async createSubscription(planId: string): Promise<{ url: string }> {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    try {
      const result = await enhancedPaymentService.createSubscription({
        priceId: plan.stripePriceId,
        metadata: {
          plan_id: planId,
          plan_name: plan.name,
          subscription_type: 'app_access'
        }
      });

      return { url: result.url || '' };
    } catch (error) {
      console.error('Error creating app subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  async cancelSubscription(): Promise<void> {
    const subscription = await this.getUserSubscription();
    if (!subscription?.payment_id) {
      throw new Error('No active subscription found');
    }

    try {
      await enhancedPaymentService.cancelSubscription(
        subscription.payment_id,
        false // Cancel at period end
      );
    } catch (error) {
      console.error('Error cancelling app subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  async hasActiveSubscription(): Promise<boolean> {
    const subscription = await this.getUserSubscription();
    return subscription?.status === 'active';
  }

  async checkSubscriptionStatus(): Promise<UserAppSubscription | null> {
    // This would typically call a Supabase function to sync with Stripe
    const { data, error } = await supabase.functions.invoke('check-app-subscription');
    
    if (error) {
      console.error('Error checking subscription status:', error);
      return null;
    }

    return data as UserAppSubscription;
  }
}

export const appSubscriptionService = new AppSubscriptionService();
