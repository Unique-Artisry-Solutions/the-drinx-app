
import { supabase } from '@/lib/supabase';
import { UserRewardPreference } from '../types';

/**
 * Get a user's reward preference by key
 * @param userId User ID
 * @param preferenceKey The preference key to look up
 * @returns The preference or null if not found
 */
export async function getUserPreference(
  userId: string,
  preferenceKey: string
): Promise<UserRewardPreference | null> {
  const { data, error } = await supabase
    .from('user_reward_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('preference_key', preferenceKey)
    .single();

  if (error) {
    console.error('Error fetching user preference:', error);
    return null;
  }

  return data as UserRewardPreference;
}

/**
 * Save a user preference
 * @param userId User ID
 * @param preferenceKey The preference key
 * @param preferenceValue The preference value - can be object or string (will be stringified if object)
 * @returns Success status
 */
export async function saveUserPreference(
  userId: string,
  preferenceKey: string,
  preferenceValue: object | string
): Promise<boolean> {
  // Ensure preferenceValue is stringified if it's an object
  const valueToSave = typeof preferenceValue === 'string' 
    ? preferenceValue 
    : JSON.stringify(preferenceValue);

  const { error } = await supabase
    .from('user_reward_preferences')
    .upsert({
      user_id: userId,
      preference_key: preferenceKey,
      preference_value: valueToSave,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error saving user preference:', error);
    return false;
  }

  return true;
}
