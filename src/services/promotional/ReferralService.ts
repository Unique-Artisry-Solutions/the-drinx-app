
import { supabase } from '@/integrations/supabase/client';
import { ReferralProgram, ReferralTier, UserReferral, ReferralReward } from '@/types/promotional';
import {
  convertDatabaseReferralProgram,
  convertDatabaseReferralTier,
  convertDatabaseUserReferral,
  convertDatabaseReferralReward,
  filterValidReferralPrograms,
  filterValidReferralTiers,
  filterValidUserReferrals,
  filterValidReferralRewards
} from '@/types/promotional/TypeBridge';

export class ReferralService {
  // Referral Programs
  static async createProgram(data: Omit<ReferralProgram, 'id' | 'created_at' | 'updated_at'>): Promise<ReferralProgram> {
    const { data: program, error } = await supabase
      .from('referral_programs')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create referral program: ${error.message}`);
    
    const convertedProgram = convertDatabaseReferralProgram(program);
    if (!convertedProgram) {
      throw new Error('Failed to convert database program to valid type');
    }
    
    return convertedProgram;
  }

  static async getPromoterPrograms(promoterId: string): Promise<ReferralProgram[]> {
    const { data, error } = await supabase
      .from('referral_programs')
      .select('*')
      .eq('promoter_id', promoterId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch referral programs: ${error.message}`);
    
    return filterValidReferralPrograms(data || []);
  }

  static async updateProgram(id: string, updates: Partial<ReferralProgram>): Promise<ReferralProgram> {
    const { data, error } = await supabase
      .from('referral_programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update referral program: ${error.message}`);
    
    const convertedProgram = convertDatabaseReferralProgram(data);
    if (!convertedProgram) {
      throw new Error('Failed to convert updated program to valid type');
    }
    
    return convertedProgram;
  }

  // Referral Tiers
  static async createTier(data: Omit<ReferralTier, 'id' | 'created_at' | 'updated_at'>): Promise<ReferralTier> {
    const { data: tier, error } = await supabase
      .from('referral_tiers')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create referral tier: ${error.message}`);
    
    const convertedTier = convertDatabaseReferralTier(tier);
    if (!convertedTier) {
      throw new Error('Failed to convert database tier to valid type');
    }
    
    return convertedTier;
  }

  static async getProgramTiers(programId: string): Promise<ReferralTier[]> {
    const { data, error } = await supabase
      .from('referral_tiers')
      .select('*')
      .eq('referral_program_id', programId)
      .order('tier_order', { ascending: true });

    if (error) throw new Error(`Failed to fetch referral tiers: ${error.message}`);
    
    return filterValidReferralTiers(data || []);
  }

  // User Referrals
  static async createReferral(data: Omit<UserReferral, 'id' | 'created_at' | 'updated_at'>): Promise<UserReferral> {
    const { data: referral, error } = await supabase
      .from('user_referrals')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create referral: ${error.message}`);
    
    const convertedReferral = convertDatabaseUserReferral(referral);
    if (!convertedReferral) {
      throw new Error('Failed to convert database referral to valid type');
    }
    
    return convertedReferral;
  }

  static async getUserReferrals(userId: string): Promise<UserReferral[]> {
    const { data, error } = await supabase
      .from('user_referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch user referrals: ${error.message}`);
    
    return filterValidUserReferrals(data || []);
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
    
    const convertedReferral = convertDatabaseUserReferral(data);
    if (!convertedReferral) {
      throw new Error('Failed to convert completed referral to valid type');
    }
    
    return convertedReferral;
  }

  // Referral Rewards
  static async createReward(data: Omit<ReferralReward, 'id' | 'created_at' | 'updated_at'>): Promise<ReferralReward> {
    const { data: reward, error } = await supabase
      .from('referral_rewards')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create referral reward: ${error.message}`);
    
    const convertedReward = convertDatabaseReferralReward(reward);
    if (!convertedReward) {
      throw new Error('Failed to convert database reward to valid type');
    }
    
    return convertedReward;
  }

  static async getUserRewards(userId: string): Promise<ReferralReward[]> {
    const { data, error } = await supabase
      .from('referral_rewards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch user rewards: ${error.message}`);
    
    return filterValidReferralRewards(data || []);
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
    
    const convertedReward = convertDatabaseReferralReward(data);
    if (!convertedReward) {
      throw new Error('Failed to convert awarded reward to valid type');
    }
    
    return convertedReward;
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
