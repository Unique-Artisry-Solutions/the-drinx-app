
import { supabase } from '@/lib/supabase';
import { UserRewardPreference } from '../types';

// Update the return type to include the structure expected by consumers
export async function getUserPreference(
  userId: string,
  preferenceKey: string
): Promise<{ value: any; success: boolean; preference_key?: string; preference_value?: any; id?: string }> {
  try {
    const { data, error } = await supabase
      .from('user_reward_preferences')
      .select('id, preference_key, preference_value')
      .eq('user_id', userId)
      .eq('preference_key', preferenceKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return { 
          value: null, 
          success: true, 
          preference_key: preferenceKey, 
          preference_value: null,
          id: undefined 
        };
      }
      console.error('Error fetching user preference:', error);
      return { value: null, success: false };
    }

    return { 
      value: data.preference_value, 
      success: true,
      preference_key: data.preference_key,
      preference_value: data.preference_value,
      id: data.id
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

    // Convert preferenceValue to JSON compatible format
    const jsonPreferenceValue = typeof preferenceValue === 'string' 
      ? preferenceValue
      : JSON.stringify(preferenceValue);

    // Use upsert to either insert or update based on existence
    const { error } = await supabase
      .from('user_reward_preferences')
      .upsert({
        id: data?.id, // Will be null for new records
        user_id: userId,
        preference_key: preferenceKey,
        preference_value: jsonPreferenceValue,
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
