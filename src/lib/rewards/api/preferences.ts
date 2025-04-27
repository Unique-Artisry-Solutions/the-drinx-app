
import { supabase } from '@/lib/supabase';
import type { UserRewardPreference } from '../types';

export async function getUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_reward_preferences')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }

  return data as UserRewardPreference[];
}

export async function updateUserPreference(
  userId: string,
  key: string,
  value: any
) {
  const { error } = await supabase
    .from('user_reward_preferences')
    .upsert({
      user_id: userId,
      preference_key: key,
      preference_value: value
    });

  if (error) {
    console.error('Error updating user preference:', error);
    return false;
  }

  return true;
}
