
import { supabase } from '@/lib/supabase';
import { UserRewardPreference } from '../types';

/**
 * Get a user preference value
 * @param userId - User ID
 * @param key - Preference key
 * @returns Preference value or null if not found
 */
export async function getUserPreference(
  userId: string, 
  key: string
): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('user_reward_preferences')
      .select('preference_value')
      .eq('user_id', userId)
      .eq('preference_key', key)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching user preference:', error);
      return null;
    }
    
    return data?.preference_value || null;
  } catch (error) {
    console.error('Unexpected error in getUserPreference:', error);
    return null;
  }
}

/**
 * Set a user preference value
 * @param userId - User ID
 * @param key - Preference key
 * @param value - Preference value
 * @returns true if successful
 */
export async function setUserPreference(
  userId: string, 
  key: string, 
  value: any
): Promise<boolean> {
  try {
    // Check if preference exists
    const { data: existing, error: checkError } = await supabase
      .from('user_reward_preferences')
      .select('id')
      .eq('user_id', userId)
      .eq('preference_key', key)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') { // Not found is okay
      console.error('Error checking existing preference:', checkError);
      return false;
    }
    
    if (existing) {
      // Update existing preference
      const { error: updateError } = await supabase
        .from('user_reward_preferences')
        .update({
          preference_value: value,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
        
      if (updateError) {
        console.error('Error updating user preference:', updateError);
        return false;
      }
    } else {
      // Insert new preference
      const { error: insertError } = await supabase
        .from('user_reward_preferences')
        .insert({
          user_id: userId,
          preference_key: key,
          preference_value: value
        });
        
      if (insertError) {
        console.error('Error inserting user preference:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in setUserPreference:', error);
    return false;
  }
}

/**
 * Get all user preferences
 * @param userId - User ID
 * @returns Object with all user preferences
 */
export async function getAllUserPreferences(
  userId: string
): Promise<Record<string, any>> {
  try {
    const { data, error } = await supabase
      .from('user_reward_preferences')
      .select('preference_key, preference_value')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user preferences:', error);
      return {};
    }
    
    // Convert array to object
    const preferences: Record<string, any> = {};
    data?.forEach(pref => {
      preferences[pref.preference_key] = pref.preference_value;
    });
    
    return preferences;
  } catch (error) {
    console.error('Unexpected error in getAllUserPreferences:', error);
    return {};
  }
}
