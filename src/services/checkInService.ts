import { supabase } from '@/integrations/supabase/client';
import { toJsonCompatible } from '@/utils/typeGuards';
import type { RewardTransaction } from '@/types/rewards/api';
import type { UserVisitStats } from '@/hooks/useUserVisits';

export interface CheckInOptions {
  rating?: number;
  note?: string;
  establishmentName?: string;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  pointsEarned?: number;
  newBalance?: number;
  error?: string;
}

export interface BaseCheckInContext {
  type: 'establishment' | 'bar_crawl' | 'swig_circuit';
  entityId: string;
  entityName: string;
}

export interface EstablishmentCheckIn extends BaseCheckInContext {
  type: 'establishment';
  locationData?: {
    latitude: number;
    longitude: number;
  };
}

export interface BarCrawlCheckIn extends BaseCheckInContext {
  type: 'bar_crawl';
  additionalData?: {
    establishment_id: string;
    establishment_name: string;
  };
}

export interface SwigCircuitCheckIn extends BaseCheckInContext {
  type: 'swig_circuit';
  establishmentId: string;
  establishmentName: string;
}

export type CheckInContext = EstablishmentCheckIn | BarCrawlCheckIn | SwigCircuitCheckIn;

// Type guard for database transaction type
function isValidTransactionType(value: string): value is 'earn' | 'redeem' {
  return value === 'earn' || value === 'redeem';
}

// Type guard for database reward transaction
function isDatabaseRewardTransaction(obj: any): obj is DatabaseRewardTransaction {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.user_id === 'string' &&
    typeof obj.points === 'number' &&
    typeof obj.source === 'string' &&
    isValidTransactionType(obj.transaction_type) &&
    typeof obj.created_at === 'string';
}

// Simplified metadata builder
function buildCheckInMetadata(context: CheckInContext, options: CheckInOptions = {}): Record<string, any> {
  const baseMetadata = {
    entity_type: context.type,
    entity_id: context.entityId,
    entity_name: context.entityName,
    rating: options.rating || 0,
    note: options.note || ''
  };

  // Add location data for establishment check-ins
  if (context.type === 'establishment' && context.locationData) {
    return {
      ...baseMetadata,
      location_data: {
        latitude: context.locationData.latitude,
        longitude: context.locationData.longitude
      }
    };
  }

  // Add establishment data for bar crawl check-ins
  if (context.type === 'bar_crawl' && context.additionalData) {
    return {
      ...baseMetadata,
      establishment_id: context.additionalData.establishment_id,
      establishment_name: context.additionalData.establishment_name
    };
  }

  // Add establishment data for swig circuit check-ins
  if (context.type === 'swig_circuit') {
    return {
      ...baseMetadata,
      establishment_id: context.establishmentId,
      establishment_name: context.establishmentName
    };
  }

  return baseMetadata;
}

class CheckInService {
  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      console.log('Performing check-in:', { userId, context, options });

      // Build metadata safely
      const metadata = buildCheckInMetadata(context, options);
      const jsonCompatibleMetadata = toJsonCompatible(metadata);

      // Determine points to award based on context type
      let pointsToAward = 10; // Default points
      let source = 'check_in';

      switch (context.type) {
        case 'establishment':
          pointsToAward = 10;
          source = 'establishment_check_in';
          break;
        case 'bar_crawl':
          pointsToAward = 25;
          source = 'bar_crawl_check_in';
          break;
        case 'swig_circuit':
          pointsToAward = 30;
          source = 'swig_circuit_check_in';
          break;
      }

      // Insert the reward transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: userId,
          establishment_id: context.type === 'establishment' ? context.entityId : undefined,
          points: pointsToAward,
          transaction_type: 'earn',
          source: source,
          description: `Check-in at ${context.entityName}`,
          metadata: jsonCompatibleMetadata
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Transaction error:', transactionError);
        throw new Error(transactionError.message);
      }

      // Update user points
      const { error: updateError } = await supabase.rpc('update_user_points', {
        p_user_id: userId,
        p_points: pointsToAward
      });

      if (updateError) {
        console.error('Points update error:', updateError);
        throw new Error(updateError.message);
      }

      // Get updated balance
      const { data: userReward } = await supabase
        .from('user_rewards')
        .select('points')
        .eq('user_id', userId)
        .single();

      return {
        success: true,
        message: `Check-in successful! You earned ${pointsToAward} points.`,
        pointsEarned: pointsToAward,
        newBalance: userReward?.points || 0
      };

    } catch (error: any) {
      console.error('Check-in error:', error);
      return {
        success: false,
        message: error.message || 'Check-in failed',
        error: error.message
      };
    }
  }

  async getCheckInHistory(
    userId: string,
    options: { type?: string; limit?: number; offset?: number } = {}
  ): Promise<RewardTransaction[]> {
    try {
      let query = supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn')
        .order('created_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('History fetch error:', error);
        return [];
      }

      // Safely transform the data with type guards
      return (data || [])
        .filter(isDatabaseRewardTransaction)
        .map((dbTransaction) => transformRewardTransaction(dbTransaction));

    } catch (error) {
      console.error('Error fetching check-in history:', error);
      return [];
    }
  }

  async getVisitStats(userId: string): Promise<UserVisitStats> {
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn');

      if (error) {
        console.error('Stats fetch error:', error);
        return {
          total_visits: 0,
          unique_establishments: 0,
          total_points_earned: 0,
          visited_entities: []
        };
      }

      const visits = data || [];
      const establishmentIds = new Set<string>();
      let totalPoints = 0;

      visits.forEach(visit => {
        totalPoints += visit.points;
        if (visit.establishment_id) {
          establishmentIds.add(visit.establishment_id);
        }
      });

      return {
        total_visits: visits.length,
        unique_establishments: establishmentIds.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(establishmentIds)
      };

    } catch (error) {
      console.error('Error fetching visit stats:', error);
      return {
        total_visits: 0,
        unique_establishments: 0,
        total_points_earned: 0,
        visited_entities: []
      };
    }
  }
}

// Database transaction type with proper typing
interface DatabaseRewardTransaction {
  id: string;
  user_id: string;
  establishment_id?: string;
  points: number;
  transaction_type: 'earn' | 'redeem';
  source: string;
  description?: string;
  created_at: string;
  metadata?: any;
  version?: number;
}

// Transform database transaction to API format
function transformRewardTransaction(dbTransaction: DatabaseRewardTransaction): RewardTransaction {
  return {
    id: dbTransaction.id,
    user_id: dbTransaction.user_id,
    userId: dbTransaction.user_id,
    establishment_id: dbTransaction.establishment_id,
    points: dbTransaction.points,
    pointsAmount: dbTransaction.points,
    transaction_type: dbTransaction.transaction_type,
    type: dbTransaction.transaction_type === 'earn' ? 'earned' : 'redeemed',
    source: dbTransaction.source,
    description: dbTransaction.description || dbTransaction.source,
    timestamp: dbTransaction.created_at,
    date: dbTransaction.created_at,
    created_at: dbTransaction.created_at,
    version: dbTransaction.version,
    metadata: typeof dbTransaction.metadata === 'object' ? dbTransaction.metadata as Record<string, any> : {}
  };
}

export const checkInService = new CheckInService();

// Re-export types for backward compatibility
export type {
  BarCrawlCheckIn,
  EstablishmentCheckIn,
  SwigCircuitCheckIn,
  CheckInContext,
  CheckInOptions,
  CheckInResult
};
