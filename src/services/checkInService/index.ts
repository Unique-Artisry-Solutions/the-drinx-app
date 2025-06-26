import { supabase } from '@/integrations/supabase/client';
import { 
  CheckInContext, 
  CheckInOptions, 
  CheckInResult, 
  HistoryFilterOptions 
} from './types';
import { CheckInFactory } from './checkInFactory';
import { transformDatabaseTransactionRow } from './databaseTransformers';
import { RewardTransaction } from '@/types/rewards/api';

/**
 * Unified Check-In Service using factory pattern
 */
class CheckInService {
  private factory = new CheckInFactory();

  /**
   * Main check-in method using factory pattern
   */
  async performCheckIn(
    userId: string, 
    context: CheckInContext, 
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    return this.factory.processCheckIn(userId, context, options);
  }

  /**
   * Get check-in history with proper filtering
   */
  async getCheckInHistory(
    userId: string, 
    options: HistoryFilterOptions = {}
  ): Promise<RewardTransaction[]> {
    try {
      let query = supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn')
        .order('created_at', { ascending: false });

      if (options.type) {
        const sourceMap = {
          'establishment': 'establishment_checkin',
          'bar_crawl': 'bar_crawl_checkin',
          'swig_circuit': 'swig_circuit_checkin'
        };
        query = query.eq('source', sourceMap[options.type]);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(transformDatabaseTransactionRow);
    } catch (error) {
      console.error('Failed to fetch check-in history:', error);
      return [];
    }
  }

  /**
   * Get visit statistics for a user
   */
  async getVisitStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('points, source, metadata')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn')
        .in('source', ['establishment_checkin', 'bar_crawl_checkin', 'swig_circuit_checkin']);

      if (error) throw error;

      const transactions = data || [];
      const visitedEntities = new Set<string>();
      let totalPoints = 0;

      transactions.forEach(transaction => {
        totalPoints += transaction.points;
        if (transaction.metadata && typeof transaction.metadata === 'object') {
          const metadata = transaction.metadata as Record<string, any>;
          if (metadata.entity_name) {
            visitedEntities.add(metadata.entity_name);
          }
        }
      });

      return {
        total_visits: transactions.length,
        unique_establishments: visitedEntities.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(visitedEntities)
      };
    } catch (error) {
      console.error('Failed to fetch visit stats:', error);
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

// Re-export types for consumers
export type { 
  CheckInContext, 
  CheckInOptions, 
  CheckInResult, 
  HistoryFilterOptions 
} from './types';
