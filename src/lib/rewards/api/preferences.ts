
import { supabase } from '@/lib/supabase';
import { UserRewardPreference } from '../types';

export async function getUserPreference(
  userId: string,
  preferenceKey: string
): Promise<{ value: any; success: boolean }> {
  try {
    const { data, error } = await supabase
      .from('user_reward_preferences')
      .select('preference_value')
      .eq('user_id', userId)
      .eq('preference_key', preferenceKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return { value: null, success: true };
      }
      console.error('Error fetching user preference:', error);
      return { value: null, success: false };
    }

    return { 
      value: data.preference_value, 
      success: true 
    };
  } catch (error) {
    console.error('Exception fetching user preference:', error);
    return { value: null, success: false };
  }
}

export async function saveUserPreference(
  userId: string,
  preferenceKey: string,
  preferenceValue: string | object
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if the preference already exists
    const { data } = await supabase
      .from('user_reward_preferences')
      .select('id')
      .eq('user_id', userId)
      .eq('preference_key', preferenceKey)
      .maybeSingle();

    // Use upsert to either insert or update based on existence
    const { error } = await supabase
      .from('user_reward_preferences')
      .upsert({
        id: data?.id, // Will be null for new records
        user_id: userId,
        preference_key: preferenceKey,
        preference_value: preferenceValue,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving user preference:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception saving user preference:', error);
    return { success: false, error: error.message };
  }
}
