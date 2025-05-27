
import { supabase } from '@/integrations/supabase/client';
import { ReferralProgram, ReferralTier, UserReferral, ReferralReward } from '@/types/promotional';

export class ReferralService {
  // Referral Programs
  static async createProgram(data: Omit<ReferralProgram, 'id' | 'created_at' | 'updated_at'>): Promise<ReferralProgram> {
    const { data: program, error } = await supabase
      .from('referral_programs')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create referral program: ${error.message}`);
    return program;
  }

  static async getPromoterPrograms(promoterId: string): Promise<ReferralProgram[]> {
    const { data, error } = await supabase
      .from('referral_programs')
      .select('*')
      .eq('promoter_id', promoterId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch referral programs: ${error.message}`);
    return data || [];
  }

  static async updateProgram(id: string, updates: Partial<ReferralProgram>): Promise<ReferralProgram> {
    const { data, error } = await supabase
      .from('referral_programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update referral program: ${error.message}`);
    return data;
  }

  // Referral Tiers
  static async createTier(data: Omit<ReferralTier, 'id' | 'created_at' | 'updated_at'>): Promise<ReferralTier> {
    const { data: tier, error } = await supabase
      .from('referral_tiers')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create referral tier: ${error.message}`);
    return tier;
  }

  static async getProgramTiers(programId: string): Promise<ReferralTier[]> {
    const { data, error } = await supabase
      .from('referral_tiers')
      .select('*')
      .eq('referral_program_id', programId)
      .order('tier_order', { ascending: true });

    if (error) throw new Error(`Failed to fetch referral tiers: ${error.message}`);
    return data || [];
  }

  // User Referrals
  static async createReferral(data: Omit<UserReferral, 'id' | 'created_at' | 'updated_at'>): Promise<UserReferral> {
    const { data: referral, error } = await supabase
      .from('user_referrals')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create referral: ${error.message}`);
    return referral;
  }

  static async getUserReferrals(userId: string): Promise<UserReferral[]> {
    const { data, error } = await supabase
      .from('user_referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch user referrals: ${error.message}`);
    return data || [];
  }

  static async completeReferral(referralId: string, conversionData: Record<string, any>): Promise<UserReferral> {
    const { data, error } = await supabase
      .from('user_referrals')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        conversion_data: conversionData
      })
      .eq('id', referralId)
      .select()
      .single();

    if (error) throw new Error(`Failed to complete referral: ${error.message}`);
    return data;
  }

  // Referral Rewards
  static async createReward(data: Omit<ReferralReward, 'id' | 'created_at' | 'updated_at'>): Promise<ReferralReward> {
    const { data: reward, error } = await supabase
      .from('referral_rewards')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create referral reward: ${error.message}`);
    return reward;
  }

  static async getUserRewards(userId: string): Promise<ReferralReward[]> {
    const { data, error } = await supabase
      .from('referral_rewards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch user rewards: ${error.message}`);
    return data || [];
  }

  static async awardReward(rewardId: string): Promise<ReferralReward> {
    const { data, error } = await supabase
      .from('referral_rewards')
      .update({
        status: 'awarded',
        awarded_at: new Date().toISOString()
      })
      .eq('id', rewardId)
      .select()
      .single();

    if (error) throw new Error(`Failed to award referral reward: ${error.message}`);
    return data;
  }

  // Generate unique referral code
  static generateReferralCode(): string {
    return `REF${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  // Calculate tier bonus multiplier
  static async calculateTierBonus(userId: string, programId: string): Promise<number> {
    const referrals = await this.getUserReferrals(userId);
    const completedReferrals = referrals.filter(r => r.status === 'completed').length;
    
    const tiers = await this.getProgramTiers(programId);
    const applicableTier = tiers
      .filter(tier => completedReferrals >= tier.min_referrals)
      .sort((a, b) => b.min_referrals - a.min_referrals)[0];

    return applicableTier?.bonus_multiplier || 1.0;
  }
}
