import { supabase } from '@/integrations/supabase/client';
import { RewardTransaction } from '@/types/rewards/api';

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
  establishmentName?: string;
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
  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      console.log('Performing check-in:', { userId, context, options });

      // Step 1: Record the reward transaction
      const pointsToAward = this.calculatePoints(context.type, options);
      const rewardResult = await this.recordRewardTransaction(userId, context, pointsToAward, options);
      
      if (!rewardResult.success) {
        return rewardResult;
      }

      // Step 2: Record type-specific check-in data
      await this.recordTypeSpecificCheckIn(userId, context, options);

      return {
        success: true,
        message: `Successfully checked in at ${context.entityName}! You earned ${pointsToAward} points.`,
        pointsEarned: pointsToAward,
        transaction: rewardResult.transaction
      };

    } catch (error: any) {
      console.error('Check-in failed:', error);
      return {
        success: false,
        message: error.message || 'Failed to record check-in'
      };
    }
  }

  private async recordRewardTransaction(
    userId: string,
    context: CheckInContext,
    points: number,
    options: CheckInOptions
  ): Promise<CheckInResult> {
    try {
      const transactionData = {
        user_id: userId,
        userId: userId, // Backward compatibility
        establishment_id: context.additionalData?.establishment_id || context.entityId,
        points: points,
        pointsAmount: points, // Backward compatibility
        transaction_type: 'earn' as const,
        type: 'earned' as const, // Component-expected format
        source: context.type,
        description: `Check-in at ${context.entityName}`,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString(), // Backward compatibility
        created_at: new Date().toISOString(),
        metadata: {
          entity_name: context.entityName,
          check_in_type: context.type,
          rating: options.rating,
          note: options.note,
          location_data: context.locationData,
          ...context.additionalData
        }
      };

      const { data: transaction, error } = await supabase
        .from('reward_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to record reward transaction: ${error.message}`);
      }

      return {
        success: true,
        message: 'Transaction recorded successfully',
        transaction: this.transformRewardTransaction(transaction)
      };

    } catch (error: any) {
      console.error('Failed to record reward transaction:', error);
      return {
        success: false,
        message: error.message || 'Failed to record reward transaction'
      };
    }
  }

  private async recordTypeSpecificCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<void> {
    try {
      switch (context.type) {
        case 'bar_crawl':
          if (context.additionalData?.establishment_id) {
            await supabase.from('bar_crawl_check_ins').insert({
              user_id: userId,
              bar_crawl_id: context.entityId,
              establishment_id: context.additionalData.establishment_id,
              checked_in_at: new Date().toISOString()
            });
          }
          break;

        case 'swig_circuit':
          if (context.additionalData?.establishment_id) {
            await supabase.from('swig_circuit_check_ins').insert({
              swig_circuit_id: context.entityId,
              user_id: userId,
              establishment_id: context.additionalData.establishment_id,
              checked_in_at: new Date().toISOString()
            });
          }
          break;

        case 'establishment':
          // For establishment check-ins, all data is captured in reward_transactions
          // No additional table needed since reward_transactions contains all visit info
          console.log('Establishment check-in recorded in reward_transactions');
          break;

        default:
          console.warn(`Unknown check-in type: ${context.type}`);
      }
    } catch (error: any) {
      console.error(`Failed to record ${context.type} specific check-in:`, error);
      // Don't throw here - the main transaction was successful
    }
  }

  private calculatePoints(type: string, options: CheckInOptions): number {
    let basePoints = 10;
    
    switch (type) {
      case 'establishment':
        basePoints = 15;
        break;
      case 'bar_crawl':
        basePoints = 25;
        break;
      case 'swig_circuit':
        basePoints = 30;
        break;
    }

    // Bonus points for rating
    if (options.rating && options.rating >= 4) {
      basePoints += 5;
    }

    // Bonus points for adding notes
    if (options.note && options.note.length > 10) {
      basePoints += 5;
    }

    return basePoints;
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

      if (options.type) {
        query = query.eq('source', options.type);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map(this.transformRewardTransaction);
    } catch (error) {
      console.error('Error fetching check-in history:', error);
      return [];
    }
  }

  async getVisitStats(userId: string): Promise<UserVisitStats> {
    try {
      // Get all earning transactions for the user
      const { data: transactions, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn');

      if (error) {
        throw error;
      }

      const visits = transactions || [];
      const visitedEntities = new Set<string>();
      let totalPoints = 0;

      visits.forEach(transaction => {
        const metadata = transaction.metadata as any;
        if (metadata?.entity_id) {
          visitedEntities.add(metadata.entity_id);
        }
        totalPoints += transaction.points || 0;
      });

      return {
        total_visits: visits.length,
        unique_establishments: visitedEntities.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(visitedEntities)
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

  private transformRewardTransaction(dbTransaction: any): RewardTransaction {
    return {
      id: dbTransaction.id,
      user_id: dbTransaction.user_id,
      establishment_id: dbTransaction.establishment_id,
      points: dbTransaction.points,
      transaction_type: dbTransaction.transaction_type,
      source: dbTransaction.source,
      description: dbTransaction.description,
      metadata: dbTransaction.metadata,
      created_at: dbTransaction.created_at,
      version: dbTransaction.version || 1
    };
  }
}

export const checkInService = new CheckInService();
