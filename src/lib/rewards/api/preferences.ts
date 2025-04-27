
import { supabase } from '@/lib/supabase';

export interface UserRewardPreference {
  user_id: string;
  preference_key: string;
  preference_value: any;
}

export async function getUserPreferences(userId: string): Promise<UserRewardPreference[]> {
  const { data, error } = await supabase
    .from('user_reward_preferences')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user preferences:', error);
    return [];
  }

  return data as UserRewardPreference[];
}

export async function updateUserPreference(
  userId: string,
  key: string,
  value: any
): Promise<boolean> {
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
