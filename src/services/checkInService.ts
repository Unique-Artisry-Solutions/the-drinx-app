
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

// Extended type for backward compatibility
export interface BarCrawlCheckIn extends BaseCheckInContext {
  type: 'bar_crawl';
  additionalData?: {
    establishment_id: string;
    establishment_name: string;
  };
}

export type CheckInContext = EstablishmentCheckIn | SwigCircuitCheckIn | BarCrawlCheckIn;

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

// Database row type (what comes from Supabase)
interface RewardTransactionRow {
  id: string;
  user_id: string;
  establishment_id?: string;
  points: number;
  transaction_type: string;
  source: string;
  description?: string;
  metadata?: any;
  created_at: string;
  version?: number;
}

// Transform database row to API type
function transformRewardTransaction(row: RewardTransactionRow): RewardTransaction {
  return {
    id: row.id,
    user_id: row.user_id,
    userId: row.user_id, // Backward compatibility
    establishment_id: row.establishment_id,
    points: row.points,
    pointsAmount: row.points, // Backward compatibility
    transaction_type: row.transaction_type as 'earn' | 'redeem',
    type: row.transaction_type === 'earn' ? 'earned' : 'redeemed', // Component-expected format
    source: row.source,
    description: row.description,
    timestamp: row.created_at,
    date: row.created_at, // Backward compatibility
    created_at: row.created_at,
    version: row.version || 1,
    metadata: row.metadata || {}
  };
}

class CheckInService {
  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      console.log('Performing check-in:', { userId, context, options });

      // Map context types to database-compatible values
      let sourceType: string;
      let establishmentId: string | undefined;
      
      if (context.type === 'establishment') {
        sourceType = 'check_in';
        establishmentId = context.entityId;
      } else if (context.type === 'swig_circuit') {
        sourceType = 'swig_circuit_check_in';
        establishmentId = (context as SwigCircuitCheckIn).establishmentId;
      } else if (context.type === 'bar_crawl') {
        sourceType = 'bar_crawl_check_in';
        establishmentId = (context as BarCrawlCheckIn).additionalData?.establishment_id;
      } else {
        sourceType = 'check_in';
      }

      // Create reward transaction record with database-compatible structure
      const transactionData = {
        user_id: userId,
        establishment_id: establishmentId,
        points: 10, // Base points for check-in
        transaction_type: 'earn',
        source: sourceType,
        description: `Check-in at ${context.entityName}`,
        metadata: {
          entity_type: context.type,
          entity_id: context.entityId,
          entity_name: context.entityName,
          rating: options.rating,
          note: options.note,
          establishment_name: options.establishmentName,
          location_data: context.locationData,
          ...(context.type === 'swig_circuit' && {
            establishment_id: (context as SwigCircuitCheckIn).establishmentId,
            establishment_name: (context as SwigCircuitCheckIn).establishmentName
          }),
          ...(context.type === 'bar_crawl' && {
            establishment_id: (context as BarCrawlCheckIn).additionalData?.establishment_id,
            establishment_name: (context as BarCrawlCheckIn).additionalData?.establishment_name
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

      const transformedTransaction = transformRewardTransaction(data);

      return {
        success: true,
        message: 'Check-in successful!',
        points: 10,
        transaction: transformedTransaction
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
        .eq('transaction_type', 'earn')
        .order('created_at', { ascending: false });

      if (options.type) {
        // Map type to source for filtering
        let sourceFilter: string;
        if (options.type === 'establishment') {
          sourceFilter = 'check_in';
        } else if (options.type === 'swig_circuit') {
          sourceFilter = 'swig_circuit_check_in';
        } else if (options.type === 'bar_crawl') {
          sourceFilter = 'bar_crawl_check_in';
        } else {
          sourceFilter = options.type;
        }
        query = query.eq('source', sourceFilter);
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

      return (data || []).map(transformRewardTransaction);
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
        .eq('transaction_type', 'earn')
        .in('source', ['check_in', 'swig_circuit_check_in', 'bar_crawl_check_in']);

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
      const uniqueEntities = new Set();
      
      visits.forEach(visit => {
        if (visit.establishment_id) {
          uniqueEntities.add(visit.establishment_id);
        }
        // Also try to get entity from metadata
        if (visit.metadata && typeof visit.metadata === 'object') {
          const metadata = visit.metadata as any;
          if (metadata.entity_id) {
            uniqueEntities.add(metadata.entity_id);
          }
        }
      });

      const totalPoints = visits.reduce((sum, visit) => {
        const points = typeof visit.points === 'number' ? visit.points : 0;
        return sum + points;
      }, 0);

      return {
        total_visits: visits.length,
        unique_establishments: uniqueEntities.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(uniqueEntities) as string[]
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
