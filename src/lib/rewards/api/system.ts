
import { supabase } from '@/lib/supabase';
import { RewardOperationResponse } from '../types';
import { addPoints } from './operations';

export async function isRewardsEnabled(): Promise<boolean> {
  const { data, error } = await supabase
    .from('feature_flags')
    .select('status')
    .eq('name', 'rewards_system')
    .single();

  if (error || !data) {
    console.error('Error checking rewards feature flag:', error);
    return false;
  }

  return data.status;
}

export async function retryFailedOperation(operationId: string): Promise<boolean> {
  try {
    const { data: operation } = await supabase
      .from('reward_transactions')
      .select('*')
      .eq('id', operationId)
      .single();

    if (!operation) {
      console.error('Operation not found:', operationId);
      return false;
    }

    const result = await addPoints(
      operation.user_id,
      operation.points,
      operation.source,
      operation.metadata
    );

    return result.success;
  } catch (error) {
    console.error('Error retrying operation:', error);
    return false;
  }
}
