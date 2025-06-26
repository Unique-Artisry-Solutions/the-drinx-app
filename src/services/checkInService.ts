
import { supabase } from '@/lib/supabase';
import { RewardTransaction } from '@/types/rewards/api';

// Core check-in types
export interface CheckInOptions {
  rating?: number | null;
  note?: string;
  establishmentName?: string;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  points?: number;
  transaction?: RewardTransaction;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

// Context types for different check-in scenarios
export interface BaseCheckInContext {
  type: string;
  entityId: string;
  entityName: string;
  locationData?: LocationData;
}

export interface EstablishmentCheckIn extends BaseCheckInContext {
  type: 'establishment';
}

export interface SwigCircuitCheckIn extends BaseCheckInContext {
  type: 'swig_circuit';
  establishmentId: string;
  establishmentName: string;
}

export type CheckInContext = EstablishmentCheckIn | SwigCircuitCheckIn;

// History query options
export interface CheckInHistoryOptions {
  type?: string;
  limit?: number;
  offset?: number;
}

// Visit stats interface
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

      // Create reward transaction record
      const transactionData = {
        user_id: userId,
        entity_type: context.type,
        entity_id: context.entityId,
        entity_name: context.entityName,
        points: 10, // Base points for check-in
        transaction_type: 'check_in',
        metadata: {
          rating: options.rating,
          note: options.note,
          establishment_name: options.establishmentName,
          location_data: context.locationData,
          ...(context.type === 'swig_circuit' && {
            establishment_id: (context as SwigCircuitCheckIn).establishmentId,
            establishment_name: (context as SwigCircuitCheckIn).establishmentName
          })
        }
      };

      const { data, error } = await supabase
        .from('reward_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        console.error('Check-in error:', error);
        return {
          success: false,
          message: error.message || 'Failed to record check-in'
        };
      }

      return {
        success: true,
        message: 'Check-in successful!',
        points: 10,
        transaction: data
      };
    } catch (error: any) {
      console.error('Check-in service error:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred'
      };
    }
  }

  async getCheckInHistory(
    userId: string,
    options: CheckInHistoryOptions = {}
  ): Promise<RewardTransaction[]> {
    try {
      let query = supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'check_in')
        .order('created_at', { ascending: false });

      if (options.type) {
        query = query.eq('entity_type', options.type);
      }

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

      return data || [];
    } catch (error) {
      console.error('Check-in history service error:', error);
      return [];
    }
  }

  async getVisitStats(userId: string): Promise<UserVisitStats> {
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'check_in');

      if (error) {
        console.error('Error fetching visit stats:', error);
        return {
          total_visits: 0,
          unique_establishments: 0,
          total_points_earned: 0,
          visited_entities: []
        };
      }

      const visits = data || [];
      const uniqueEntities = new Set(visits.map(visit => visit.entity_id));
      const totalPoints = visits.reduce((sum, visit) => {
        const points = typeof visit.points === 'number' ? visit.points : 0;
        return sum + points;
      }, 0);

      return {
        total_visits: visits.length,
        unique_establishments: uniqueEntities.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(uniqueEntities)
      };
    } catch (error) {
      console.error('Visit stats service error:', error);
      return {
        total_visits: 0,
        unique_establishments: 0,
        total_points_earned: 0,
        visited_entities: []
      };
    }
  }
}

// Export singleton instance
export const checkInService = new CheckInService();
