
import { supabase } from '@/lib/supabase';
import { UserRewardPreferenceRow } from '@/types/rewards/database';

// Define the interface here to avoid circular dependencies
interface UserRewardPreference extends UserRewardPreferenceRow {
  notification_settings?: {
    point_changes: boolean;
    tier_updates: boolean;
    reward_availability: boolean;
  };
  display_settings?: {
    points_format: 'standard' | 'compact';
    show_tier_progress: boolean;
  };
}

export async function getUserPreference(
  userId: string, 
  key: string
): Promise<UserRewardPreference | null> {
  try {
    const { data, error } = await supabase
      .from('user_reward_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('preference_key', key)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user preference:', error);
      return null;
    }

    if (!data) return null;

    // Transform database response to match UserRewardPreference interface
    const preference: UserRewardPreference = {
      id: data.id,
      user_id: data.user_id,
      preference_key: data.preference_key,
      preference_value: data.preference_value,
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    // Add structured properties for backward compatibility
    if (key === 'notification_settings' && typeof data.preference_value === 'object') {
      preference.notification_settings = data.preference_value as any;
    }
    if (key === 'display_settings' && typeof data.preference_value === 'object') {
      preference.display_settings = data.preference_value as any;
    }

    return preference;
  } catch (error) {
    console.error('Unexpected error in getUserPreference:', error);
    return null;
  }
}

export async function setUserPreference(
  userId: string,
  key: string,
  value: any
): Promise<boolean> {
  try {
    const preferenceValue = typeof value === 'object' ? value : JSON.stringify(value);
    
    // Check if preference exists
    const { data: existing } = await supabase
      .from('user_reward_preferences')
      .select('id')
      .eq('user_id', userId)
      .eq('preference_key', key)
      .maybeSingle();
    
    if (existing) {
      // Update existing preference
      const { error } = await supabase
        .from('user_reward_preferences')
        .update({
          preference_value: preferenceValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
      
      if (error) {
        console.error('Error updating user preference:', error);
        return false;
      }
    } else {
      // Insert new preference
      const { error } = await supabase
        .from('user_reward_preferences')
        .insert({
          user_id: userId,
          preference_key: key,
          preference_value: preferenceValue
        });
      
      if (error) {
        console.error('Error inserting user preference:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in setUserPreference:', error);
    return false;
  }
}
