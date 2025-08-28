import { supabase } from '@/lib/supabase';

export interface RewardAnalyticsData {
  establishment_id: string;
  total_points_earned: number;
  total_points_redeemed: number;
  active_users: number;
  avg_transaction_value: number;
  period_start: string;
  period_end: string;
}

/**
 * Secure analytics service that routes through admin-protected RPC functions
 * instead of directly accessing materialized views
 */
export class SecureAnalyticsService {
  /**
   * Get reward analytics data through secure edge function
   * Only accessible to admin users
   */
  static async getRewardAnalytics(): Promise<RewardAnalyticsData[]> {
    console.info('Fetching reward analytics data through secure edge function...');
    
    try {
      const { data, error } = await supabase.functions.invoke('secure-analytics', {
        body: { action: 'getRewardAnalytics' }
      });
      
      if (error) {
        throw new Error(`Failed to fetch reward analytics: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      console.info(`Reward analytics data fetched successfully: ${data?.data?.length || 0} records`);
      return data?.data || [];
    } catch (error) {
      console.error('Error fetching reward analytics:', error);
      throw error;
    }
  }

  /**
   * Refresh materialized views through secure edge function (admin only)
   */
  static async refreshMaterializedViews(): Promise<void> {
    console.info('Refreshing materialized views through secure edge function...');
    
    try {
      const { data, error } = await supabase.functions.invoke('secure-analytics', {
        body: { action: 'refreshMaterializedViews' }
      });
      
      if (error) {
        throw new Error(`Failed to refresh materialized views: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      console.info('Materialized views refreshed successfully');
    } catch (error) {
      console.error('Error refreshing materialized views:', error);
      throw error;
    }
  }

  /**
   * Check if current user has admin access to analytics through secure edge function
   */
  static async checkAdminAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('secure-analytics', {
        body: { action: 'checkAccess' }
      });
      
      if (error) {
        console.warn('Error checking admin access:', error.message);
        return false;
      }
      
      return data?.hasAccess === true;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }
}
