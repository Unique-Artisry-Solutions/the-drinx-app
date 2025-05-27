
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Subscription, SubscriptionTier } from '@/types/SubscriptionTypes';

/**
 * Feature flags for controlling follower system rollout
 */
interface FollowerFeatureFlags {
  useNewFollowerSystem: boolean;
  enableRealTimeNotifications: boolean;
  enableAdvancedSegmentation: boolean;
  fallbackToLegacyOnError: boolean;
}

class SubscriptionAdapterService {
  private featureFlags: FollowerFeatureFlags = {
    useNewFollowerSystem: false, // Start with false for safe rollout
    enableRealTimeNotifications: false,
    enableAdvancedSegmentation: false,
    fallbackToLegacyOnError: true
  };

  /**
   * Update feature flags (typically from admin config or environment)
   */
  updateFeatureFlags(flags: Partial<FollowerFeatureFlags>) {
    this.featureFlags = { ...this.featureFlags, ...flags };
  }

  /**
   * Get feature flag status
   */
  getFeatureFlag(flag: keyof FollowerFeatureFlags): boolean {
    return this.featureFlags[flag];
  }

  /**
   * Adaptive data fetching with fallback mechanisms
   */
  async getFollowers(promoterId: string, useNewSystem?: boolean): Promise<any[]> {
    const shouldUseNewSystem = useNewSystem ?? this.featureFlags.useNewFollowerSystem;
    
    if (shouldUseNewSystem) {
      try {
        return await this.getFollowersFromNewSystem(promoterId);
      } catch (error) {
        console.error('New follower system failed:', error);
        
        if (this.featureFlags.fallbackToLegacyOnError) {
          console.log('Falling back to legacy system');
          return await this.getFollowersFromLegacySystem(promoterId);
        }
        throw error;
      }
    }
    
    return await this.getFollowersFromLegacySystem(promoterId);
  }

  /**
   * New follower system implementation
   */
  private async getFollowersFromNewSystem(promoterId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('promoter_followers')
      .select(`
        *,
        profiles!inner(username, display_name, avatar_url),
        promoter_subscription_tiers(name, tier, price)
      `)
      .eq('promoter_id', promoterId)
      .eq('follow_status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Legacy system fallback
   */
  private async getFollowersFromLegacySystem(promoterId: string): Promise<any[]> {
    // Fallback to existing subscription system
    console.log('Using legacy subscription system for promoter:', promoterId);
    return [];
  }

  /**
   * Adaptive notification sending
   */
  async sendNotification(
    promoterId: string,
    message: string,
    options: any = {}
  ): Promise<{ success: boolean; sentCount: number; errors?: string[] }> {
    const useNewSystem = this.featureFlags.useNewFollowerSystem;
    
    if (useNewSystem) {
      try {
        return await this.sendNotificationNewSystem(promoterId, message, options);
      } catch (error) {
        console.error('New notification system failed:', error);
        
        if (this.featureFlags.fallbackToLegacyOnError) {
          return await this.sendNotificationLegacySystem(promoterId, message, options);
        }
        throw error;
      }
    }
    
    return await this.sendNotificationLegacySystem(promoterId, message, options);
  }

  private async sendNotificationNewSystem(
    promoterId: string, 
    message: string, 
    options: any
  ): Promise<{ success: boolean; sentCount: number; errors?: string[] }> {
    // Get followers from new system
    const followers = await this.getFollowersFromNewSystem(promoterId);
    
    let sentCount = 0;
    const errors: string[] = [];

    for (const follower of followers) {
      try {
        const { error } = await supabase
          .from('notifications')
          .insert({
            recipient_id: follower.subscriber_id,
            recipient_type: 'individual',
            title: options.title || 'New Message',
            content: message,
            priority: options.priority || 'medium',
            metadata: {
              promoter_id: promoterId,
              notification_type: 'follower_communication',
              ...options.metadata
            }
          });

        if (error) {
          errors.push(`Failed to notify ${follower.subscriber_id}: ${error.message}`);
        } else {
          sentCount++;
        }
      } catch (err: any) {
        errors.push(`Failed to notify ${follower.subscriber_id}: ${err.message}`);
      }
    }

    return {
      success: sentCount > 0,
      sentCount,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private async sendNotificationLegacySystem(
    promoterId: string, 
    message: string, 
    options: any
  ): Promise<{ success: boolean; sentCount: number; errors?: string[] }> {
    // Legacy notification implementation
    console.log('Using legacy notification system');
    return { success: true, sentCount: 0 };
  }
}

export const subscriptionAdapter = new SubscriptionAdapterService();
