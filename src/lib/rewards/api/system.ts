
import { supabase } from '@/lib/supabase';

export async function isRewardsEnabled(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'feature_flags.rewards_enabled')
      .single();

    if (error) {
      console.error('Error checking if rewards are enabled:', error);
      return true; // Default to enabled on error
    }

    if (!data) {
      return true; // Default to enabled if setting not found
    }

    return data.value === true || data.value === 'true';
  } catch (error) {
    console.error('Exception checking if rewards are enabled:', error);
    return true; // Default to enabled on error
  }
}

export async function retryFailedOperation(transactionId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('reward_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error || !data) {
      console.error('Error fetching transaction for retry:', error);
      return false;
    }

    // Call the update_user_points function
    const { error: updateError } = await supabase.rpc('update_user_points', {
      p_user_id: data.user_id,
      p_points: data.points
    });

    if (updateError) {
      console.error('Error retrying transaction:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in retryFailedOperation:', error);
    return false;
  }
}
