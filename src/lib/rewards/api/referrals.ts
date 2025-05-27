
import { supabase } from '@/integrations/supabase/client';
import { ReferralRewardSystem } from '../referralRewards';

export const processReferralSignup = async (
  referralCode: string,
  newUserId: string
): Promise<void> => {
  try {
    // Find the referral by code
    const { data: referral, error } = await supabase
      .from('user_referrals')
      .select('*')
      .eq('referral_code', referralCode)
      .eq('status', 'pending')
      .single();

    if (error || !referral) {
      console.warn('Referral code not found or already used:', referralCode);
      return;
    }

    // Update referral with referee information
    await supabase
      .from('user_referrals')
      .update({
        referee_id: newUserId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        conversion_data: {
          event: 'signup',
          timestamp: new Date().toISOString()
        }
      })
      .eq('id', referral.id);

    // Process rewards
    await ReferralRewardSystem.processReferralReward(referral.id, {
      event: 'signup',
      referee_id: newUserId
    });

    // Track activity
    await ReferralRewardSystem.trackReferralActivity(
      referral.referrer_id,
      'referral_converted',
      { referee_id: newUserId, referral_code: referralCode }
    );

  } catch (error) {
    console.error('Failed to process referral signup:', error);
    throw error;
  }
};

export const createReferralCode = async (userId: string): Promise<string> => {
  try {
    // Generate unique code
    const code = `REF${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // For now, we'll assume there's an active referral program
    // In a real implementation, you'd fetch the active program for the user
    const defaultProgramId = 'default-program-id'; // This should be dynamic
    
    // Create referral record
    await supabase
      .from('user_referrals')
      .insert({
        referral_program_id: defaultProgramId,
        referrer_id: userId,
        referral_code: code,
        status: 'pending',
        conversion_data: {}
      });

    return code;
  } catch (error) {
    console.error('Failed to create referral code:', error);
    throw error;
  }
};

export const validateReferralCode = async (code: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_referrals')
      .select('id')
      .eq('referral_code', code)
      .eq('status', 'pending')
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
};
