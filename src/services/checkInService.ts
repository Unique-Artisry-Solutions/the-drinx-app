
import { supabase } from '@/integrations/supabase/client';
import { RewardTransaction } from '@/types/rewards/api';
import { Json } from '@/integrations/supabase/types';

// Database types (what comes from Supabase)
interface DatabaseRewardTransaction {
  id: string;
  user_id: string;
  establishment_id: string | null;
  points: number;
  transaction_type: 'earn' | 'redeem';
  source: string;
  description: string | null;
  metadata: Json;
  created_at: string;
  version: number;
}

// Transform database result to API type
function transformDatabaseTransaction(dbTransaction: DatabaseRewardTransaction): RewardTransaction {
  // Safely parse metadata
  let parsedMetadata: Record<string, any> = {};
  if (typeof dbTransaction.metadata === 'object' && dbTransaction.metadata !== null) {
    parsedMetadata = dbTransaction.metadata as Record<string, any>;
  } else if (typeof dbTransaction.metadata === 'string') {
    try {
      parsedMetadata = JSON.parse(dbTransaction.metadata);
    } catch {
      parsedMetadata = {};
    }
  }

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
    metadata: parsedMetadata
  };
}

// Safe metadata access helper
function getMetadataValue(metadata: Json, key: string): any {
  if (typeof metadata === 'object' && metadata !== null) {
    return (metadata as Record<string, any>)[key];
  }
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return parsed[key];
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export interface CheckInContext {
  type: 'establishment' | 'bar_crawl' | 'swig_circuit';
  entityId: string;
  entityName: string;
  locationData?: {
    latitude: number;
    longitude: number;
  };
  additionalData?: Record<string, any>;
}

export interface CheckInOptions {
  rating?: number;
  note?: string;
  verifyLocation?: boolean;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  pointsEarned?: number;
  transaction?: RewardTransaction;
}

export interface UserVisitStats {
  total_visits: number;
  unique_establishments: number;
  total_points_earned: number;
  visited_entities: string[];
}

class CheckInService {
  private readonly LOCATION_VERIFICATION_RADIUS = 100; // meters
  private readonly COOLDOWN_HOURS = 12;

  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      // Check cooldown
      if (await this.isInCooldown(userId, context)) {
        return {
          success: false,
          message: `Please wait ${this.COOLDOWN_HOURS} hours between check-ins at the same location.`
        };
      }

      // Verify location if required
      if (options.verifyLocation && context.locationData) {
        const locationValid = await this.verifyLocation(context.entityId, context.locationData);
        if (!locationValid) {
          return {
            success: false,
            message: 'You must be at the location to check in.'
          };
        }
      }

      // Calculate points
      const pointsToEarn = this.calculatePoints(context.type, options);

      // Create reward transaction
      const metadata = {
        entity_id: context.entityId,
        entity_name: context.entityName,
        check_in_type: context.type,
        rating: options.rating,
        note: options.note,
        location_verified: !!options.verifyLocation,
        ...context.additionalData
      };

      const { data: transaction, error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: userId,
          establishment_id: context.type === 'establishment' ? context.entityId : null,
          points: pointsToEarn,
          transaction_type: 'earn',
          source: context.type,
          description: `Check-in at ${context.entityName}`,
          metadata: metadata
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Transaction error:', transactionError);
        return {
          success: false,
          message: 'Failed to record check-in. Please try again.'
        };
      }

      // Record type-specific check-in
      await this.recordTypeSpecificCheckIn(userId, context, transaction.id);

      const transformedTransaction = transformDatabaseTransaction(transaction);

      return {
        success: true,
        message: `Check-in successful! You earned ${pointsToEarn} points.`,
        pointsEarned: pointsToEarn,
        transaction: transformedTransaction
      };

    } catch (error) {
      console.error('Check-in error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during check-in.'
      };
    }
  }

  private async isInCooldown(userId: string, context: CheckInContext): Promise<boolean> {
    const cooldownTime = new Date();
    cooldownTime.setHours(cooldownTime.getHours() - this.COOLDOWN_HOURS);

    const { data } = await supabase
      .from('reward_transactions')
      .select('created_at')
      .eq('user_id', userId)
      .eq('source', context.type)
      .gte('created_at', cooldownTime.toISOString())
      .limit(1);

    return data && data.length > 0;
  }

  private async verifyLocation(
    entityId: string,
    userLocation: { latitude: number; longitude: number }
  ): Promise<boolean> {
    // For now, return true - location verification would require establishment coordinates
    return true;
  }

  private calculatePoints(type: CheckInContext['type'], options: CheckInOptions): number {
    let basePoints = 10;
    
    switch (type) {
      case 'establishment':
        basePoints = 10;
        break;
      case 'bar_crawl':
        basePoints = 15;
        break;
      case 'swig_circuit':
        basePoints = 20;
        break;
    }

    // Bonus for rating
    if (options.rating && options.rating >= 4) {
      basePoints += 5;
    }

    return basePoints;
  }

  private async recordTypeSpecificCheckIn(
    userId: string,
    context: CheckInContext,
    transactionId: string
  ): Promise<void> {
    try {
      switch (context.type) {
        case 'bar_crawl':
          // Get establishment_id from additional data or use a default
          const establishmentId = context.additionalData?.establishment_id;
          if (establishmentId) {
            await supabase
              .from('bar_crawl_check_ins')
              .insert({
                bar_crawl_id: context.entityId,
                user_id: userId,
                establishment_id: establishmentId
              });
          }
          break;
        case 'swig_circuit':
          // Similar logic for swig circuits
          break;
      }
    } catch (error) {
      console.error('Failed to record type-specific check-in:', error);
      // Don't throw - the main transaction was successful
    }
  }

  async getCheckInHistory(
    userId: string,
    options: { 
      type?: CheckInContext['type'];
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<RewardTransaction[]> {
    let query = supabase
      .from('reward_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('transaction_type', 'earn')
      .order('created_at', { ascending: false });

    if (options.type) {
      query = query.eq('source', options.type);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, (options.offset + (options.limit || 20)) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching check-in history:', error);
      return [];
    }

    return (data || []).map(transformDatabaseTransaction);
  }

  async getVisitStats(userId: string): Promise<UserVisitStats> {
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('points, metadata')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn');

      if (error) {
        console.error('Error fetching visit stats:', error);
        return {
          total_visits: 0,
          unique_establishments: 0,
          total_points_earned: 0,
          visited_entities: []
        };
      }

      const transactions = data || [];
      const uniqueEntities = new Set<string>();
      let totalPoints = 0;

      transactions.forEach(transaction => {
        totalPoints += transaction.points;
        const entityId = getMetadataValue(transaction.metadata, 'entity_id');
        if (entityId) {
          uniqueEntities.add(entityId);
        }
      });

      return {
        total_visits: transactions.length,
        unique_establishments: uniqueEntities.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(uniqueEntities)
      };
    } catch (error) {
      console.error('Error calculating visit stats:', error);
      return {
        total_visits: 0,
        unique_establishments: 0,
        total_points_earned: 0,
        visited_entities: []
      };
    }
  }
}

export const checkInService = new CheckInService();
