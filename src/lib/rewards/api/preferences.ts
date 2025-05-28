
import { ComponentUserPreferences } from '@/types/components';
import { ApiUserRewardPreference } from '@/types/api';

// Mock implementation for user preferences
export const rewardsApi = {
  async getUserPreference(userId: string, key: string): Promise<ApiUserRewardPreference | null> {
    // Mock implementation - replace with actual API call
    const mockPreferences: Record<string, any> = {
      notification_settings: {
        id: `pref-${userId}-notifications`,
        user_id: userId,
        preference_key: 'notification_settings',
        preference_value: {
          point_changes: true,
          tier_updates: true,
          reward_availability: true
        },
        notification_settings: {
          point_changes: true,
          tier_updates: true,
          reward_availability: true
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      display_settings: {
        id: `pref-${userId}-display`,
        user_id: userId,
        preference_key: 'display_settings',
        preference_value: {
          points_format: 'standard' as const,
          show_tier_progress: true
        },
        display_settings: {
          points_format: 'standard' as const,
          show_tier_progress: true
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };

    return mockPreferences[key] || null;
  },

  async setUserPreference(userId: string, key: string, value: any): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`Setting preference ${key} for user ${userId}:`, value);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
  },

  async getUserAchievements(userId: string) {
    // Mock implementation
    return [];
  },

  async recordActivity(userId: string, activityType: string, metadata?: Record<string, any>) {
    // Mock implementation
    return {
      success: true,
      completedAchievements: []
    };
  }
};
