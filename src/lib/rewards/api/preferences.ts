
import { supabase } from '@/lib/supabase';
import { DbUserRewardPreference } from '@/types/database';
import { ApiUserRewardPreference } from '@/types/api';
import { dbToApiPreference } from '@/lib/adapters/rewardAdapters';

export async function getUserPreference(
  userId: string, 
  key: string
): Promise<ApiUserRewardPreference | null> {
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

    // Transform database response using adapter
    return dbToApiPreference(data as DbUserRewardPreference);
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
