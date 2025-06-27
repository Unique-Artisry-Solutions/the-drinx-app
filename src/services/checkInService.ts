import { supabase } from '@/integrations/supabase/client';
import { RewardTransaction } from '@/types/rewards/api';

export interface CheckInOptions {
  userId: string;
  rating?: number;
  note?: string;
  establishmentName?: string;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  points?: number;
  transaction?: RewardTransaction;
}

export interface SwigCircuitCheckIn {
  type: 'swig_circuit';
  entityId: string;
  entityName: string;
  establishmentId?: string;
  establishmentName?: string;
  stopNumber?: number;
  locationData?: {
    latitude: number;
    longitude: number;
  };
}

export interface EstablishmentCheckIn {
  type: 'establishment';
  entityId: string;
  entityName: string;
  locationData?: {
    latitude: number;
    longitude: number;
  };
}

export type CheckInContext = SwigCircuitCheckIn | EstablishmentCheckIn;

export interface UserVisitStats {
  total_visits: number;
  unique_establishments: number;
  total_points_earned: number;
  visited_entities: Array<{
    entity_id: string;
    entity_name: string;
    visit_count: number;
    last_visit: string;
  }>;
}

class CheckInService {
  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions
  ): Promise<CheckInResult> {
    try {
      console.log('Performing check-in:', { userId, context, options });

      // Simulate check-in logic
      const points = Math.floor(Math.random() * 50) + 10;
      
      // Create reward transaction with all required fields
      const transactionData = {
        user_id: userId,
        establishment_id: context.type === 'establishment' ? context.entityId : 
                         (context.type === 'swig_circuit' && context.establishmentId ? context.establishmentId : null),
        points,
        transaction_type: 'earn',
        source: 'check_in', // Required field
        description: `Check-in at ${context.entityName}`,
        metadata: {
          context_type: context.type,
          entity_id: context.entityId,
          entity_name: context.entityName,
          rating: options.rating,
          note: options.note,
          location_data: context.locationData
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: transaction, error } = await supabase
        .from('reward_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        console.error('Error creating reward transaction:', error);
        return {
          success: false,
          message: 'Failed to record check-in'
        };
      }

      return {
        success: true,
        message: `Check-in successful! You earned ${points} points.`,
        points,
        transaction: this.transformTransaction(transaction)
      };
    } catch (error) {
      console.error('Check-in error:', error);
      return {
        success: false,
        message: 'An error occurred during check-in'
      };
    }
  }

  async getCheckInHistory(
    userId: string,
    options: {
      type?: 'establishment' | 'swig_circuit';
      limit?: number;
      offset?: number;
    } = {}
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
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching check-in history:', error);
        return [];
      }

      return (data || []).map(transaction => this.transformTransaction(transaction));
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
      const totalPoints = transactions.reduce((sum, t) => sum + (t.points || 0), 0);
      const totalVisits = transactions.length;

      // Group by entity
      const entityMap = new Map<string, {
        entity_id: string;
        entity_name: string;
        visit_count: number;
        last_visit: string;
      }>();

      transactions.forEach(transaction => {
        const metadata = transaction.metadata as any;
        const entityId = metadata?.entity_id || transaction.establishment_id || 'unknown';
        const entityName = metadata?.entity_name || 'Unknown Location';

        if (entityMap.has(entityId)) {
          const existing = entityMap.get(entityId)!;
          existing.visit_count++;
          if (transaction.created_at > existing.last_visit) {
            existing.last_visit = transaction.created_at;
          }
        } else {
          entityMap.set(entityId, {
            entity_id: entityId,
            entity_name: entityName,
            visit_count: 1,
            last_visit: transaction.created_at
          });
        }
      });

      return {
        total_visits: totalVisits,
        unique_establishments: entityMap.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(entityMap.values())
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

  private transformTransaction(dbTransaction: any): RewardTransaction {
    return {
      id: dbTransaction.id,
      user_id: dbTransaction.user_id,
      userId: dbTransaction.user_id,
      establishment_id: dbTransaction.establishment_id,
      points: dbTransaction.points,
      pointsAmount: dbTransaction.points,
      transaction_type: dbTransaction.transaction_type, // Use correct property name
      type: dbTransaction.transaction_type === 'earn' ? 'earned' : 'redeemed',
      source: dbTransaction.source,
      description: dbTransaction.description || dbTransaction.source,
      timestamp: dbTransaction.created_at,
      date: dbTransaction.created_at,
      created_at: dbTransaction.created_at,
      metadata: typeof dbTransaction.metadata === 'object' ? dbTransaction.metadata as Record<string, any> : {}
    };
  }
}

export const checkInService = new CheckInService();
