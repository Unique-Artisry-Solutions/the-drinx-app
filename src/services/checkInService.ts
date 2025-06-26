
import { supabase } from '@/integrations/supabase/client';
import { RewardTransaction } from '@/types/rewards/api';

// Enhanced check-in options interface
export interface CheckInOptions {
  userId: string;
  rating?: number;
  note?: string;
  establishmentName?: string;
}

// Base check-in context interface
export interface CheckInContext {
  type: string;
  entityId: string;
  entityName: string;
}

// Establishment check-in context
export interface EstablishmentCheckIn extends CheckInContext {
  type: 'establishment';
  locationData?: {
    latitude: number;
    longitude: number;
  };
}

// Bar crawl check-in context
export interface BarCrawlCheckIn extends CheckInContext {
  type: 'bar_crawl';
  additionalData?: {
    establishment_id: string;
    establishment_name: string;
  };
}

// Swig circuit check-in context
export interface SwigCircuitCheckIn extends CheckInContext {
  type: 'swig_circuit';
  entityId: string;
  entityName: string;
  establishmentId: string;
  establishmentName: string;
}

export type AnyCheckInContext = EstablishmentCheckIn | BarCrawlCheckIn | SwigCircuitCheckIn;

export interface CheckInResult {
  success: boolean;
  message: string;
  pointsEarned?: number;
  transaction?: RewardTransaction;
}

// User visit stats interface
export interface UserVisitStats {
  total_visits: number;
  unique_establishments: number;
  total_points_earned: number;
  visited_entities: string[];
}

// Check-in history query options
export interface CheckInHistoryOptions {
  type?: string;
  limit?: number;
  offset?: number;
}

class CheckInService {
  async performCheckIn(
    userId: string,
    context: AnyCheckInContext,
    options: CheckInOptions = { userId }
  ): Promise<CheckInResult> {
    try {
      console.log('Performing check-in:', { userId, context, options });

      // Create reward transaction record
      const transactionData = {
        user_id: userId,
        points: 50, // Base points for check-in
        transaction_type: 'earned',
        description: `Check-in at ${context.entityName}`,
        metadata: this.toJsonCompatible({
          checkInType: context.type,
          entityId: context.entityId,
          entityName: context.entityName,
          rating: options.rating,
          note: options.note,
          timestamp: new Date().toISOString()
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: transaction, error } = await supabase
        .from('reward_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        return {
          success: false,
          message: 'Failed to record check-in'
        };
      }

      console.log('Check-in recorded successfully:', transaction);

      return {
        success: true,
        message: 'Check-in successful! You earned 50 points.',
        pointsEarned: 50,
        transaction: this.transformToRewardTransaction(transaction)
      };
    } catch (error: any) {
      console.error('Check-in service error:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred'
      };
    }
  }

  async getCheckInHistory(userId: string, options: CheckInHistoryOptions = {}): Promise<RewardTransaction[]> {
    try {
      let query = supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earned')
        .order('created_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching check-in history:', error);
        return [];
      }

      return data?.map(record => this.transformToRewardTransaction(record)) || [];
    } catch (error) {
      console.error('Error in getCheckInHistory:', error);
      return [];
    }
  }

  async getVisitStats(userId: string): Promise<UserVisitStats> {
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earned');

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
      const uniqueEntities = new Set();
      let totalPoints = 0;

      transactions.forEach(transaction => {
        if (transaction.metadata && typeof transaction.metadata === 'object') {
          const metadata = transaction.metadata as any;
          if (metadata.entityId) {
            uniqueEntities.add(metadata.entityId);
          }
        }
        totalPoints += transaction.points || 0;
      });

      return {
        total_visits: transactions.length,
        unique_establishments: uniqueEntities.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(uniqueEntities) as string[]
      };
    } catch (error) {
      console.error('Error in getVisitStats:', error);
      return {
        total_visits: 0,
        unique_establishments: 0,
        total_points_earned: 0,
        visited_entities: []
      };
    }
  }

  private transformToRewardTransaction(dbRecord: any): RewardTransaction {
    return {
      id: dbRecord.id,
      userId: dbRecord.user_id,
      points: dbRecord.points,
      transactionType: dbRecord.transaction_type,
      description: dbRecord.description,
      metadata: dbRecord.metadata,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at
    };
  }

  private toJsonCompatible(obj: any): Record<string, any> {
    return JSON.parse(JSON.stringify(obj));
  }
}

export const checkInService = new CheckInService();
