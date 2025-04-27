
import { supabase } from '@/lib/supabase';
import { RewardOperationResponse, transformTransaction } from '../types';
import { RewardsCache } from '../system/RewardsCache';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackRewardEvent } from './tracking';

export async function addPoints(
  userId: string, 
  points: number, 
  source: string, 
  metadata = {}
): Promise<RewardOperationResponse> {
  try {
    const { error: transactionError } = await supabase
      .from('reward_transactions')
      .insert({
        user_id: userId,
        points,
        transaction_type: 'earn',
        source,
        metadata
      });

    if (transactionError) {
      console.error('Error adding points:', transactionError);
      return { success: false, error: 'Failed to add points' };
    }

    const { error: updateError } = await supabase.rpc('update_user_points', {
      p_user_id: userId,
      p_points: points
    });

    if (updateError) {
      console.error('Error updating points:', updateError);
      return { success: false, error: 'Failed to update points' };
    }

    // Track analytics event for reward points earned
    await trackRewardEvent('points_earned', userId, {
      points,
      source,
      metadata
    });

    return { success: true, message: 'Points added successfully' };
  } catch (error) {
    console.error('Error in addPoints:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function batchUpdatePoints(
  operations: Array<{ userId: string; points: number; source: string; metadata?: any }>
): Promise<Array<RewardOperationResponse>> {
  try {
    const { data, error } = await supabase.rpc('batch_update_user_points', {
      p_operations: JSON.stringify(operations)
    });

    if (error) {
      console.error('Error in batch points update:', error);
      return operations.map(() => ({
        success: false,
        error: 'Batch operation failed'
      }));
    }

    console.log('Batch points update completed:', {
      totalOperations: operations.length,
      successfulOperations: data.filter((r: any) => r.success).length,
      failedOperations: data.filter((r: any) => !r.success).length
    });

    return data.map((result: any) => ({
      success: result.success,
      error: result.error,
      userId: result.user_id,
      pointsChanged: result.points_change,
      newBalance: result.new_balance
    }));
  } catch (error) {
    console.error('Unexpected error in batchUpdatePoints:', error);
    return operations.map(() => ({
      success: false,
      error: 'System error occurred'
    }));
  }
}

