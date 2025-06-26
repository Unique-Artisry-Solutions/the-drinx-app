
import { supabase } from '@/integrations/supabase/client';
import { RewardTransaction } from '@/types/rewards/api';

/**
 * Unified Check-In Service - Simplified Architecture
 * All types and logic in one place to eliminate import/export issues
 */

// Core check-in types - defined here to avoid import issues
export interface CheckInLocationData {
  latitude: number;
  longitude: number;
}

export interface CheckInOptions {
  rating?: number | null;
  note?: string;
  establishmentName?: string;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  pointsEarned?: number;
  transaction?: any;
}

export interface HistoryFilterOptions {
  type?: 'establishment' | 'bar_crawl' | 'swig_circuit';
  limit?: number;
  offset?: number;
}

// Context interfaces for different check-in types
export interface EstablishmentCheckIn {
  type: 'establishment';
  entityId: string;
  entityName: string;
  locationData?: CheckInLocationData;
}

export interface BarCrawlCheckIn {
  type: 'bar_crawl';
  entityId: string;
  entityName: string;
  locationData?: CheckInLocationData;
}

export interface SwigCircuitCheckIn {
  type: 'swig_circuit';
  entityId: string;
  entityName: string;
  locationData?: CheckInLocationData;
  establishmentId: string;
  establishmentName: string;
}

// Union type for all check-in contexts
export type CheckInContext = EstablishmentCheckIn | BarCrawlCheckIn | SwigCircuitCheckIn;

/**
 * Database transaction creation helper
 */
function createTransactionData(data: {
  user_id: string;
  establishment_id?: string;
  points: number;
  transaction_type: 'earn' | 'redeem';
  source: string;
  description?: string;
  metadata?: Record<string, any>;
}) {
  return {
    user_id: data.user_id,
    establishment_id: data.establishment_id,
    points: data.points,
    transaction_type: data.transaction_type,
    source: data.source,
    description: data.description || data.source,
    metadata: data.metadata || {},
    version: 1
  };
}

/**
 * Transform database row to RewardTransaction
 */
function transformDatabaseRow(row: any): RewardTransaction {
  const metadata = typeof row.metadata === 'object' ? row.metadata as Record<string, any> : {};
  
  return {
    id: row.id,
    user_id: row.user_id,
    userId: row.user_id,
    establishment_id: row.establishment_id,
    points: row.points,
    pointsAmount: row.points,
    transaction_type: row.transaction_type,
    type: row.transaction_type === 'earn' ? 'earned' : 'redeemed',
    source: row.source,
    description: row.description || row.source,
    timestamp: row.created_at,
    date: row.created_at,
    created_at: row.created_at,
    version: row.version || 1,
    metadata
  };
}

/**
 * Main Check-In Service Class
 */
class CheckInService {
  /**
   * Handle establishment check-in
   */
  private async handleEstablishmentCheckIn(
    userId: string,
    context: EstablishmentCheckIn,
    options: CheckInOptions
  ): Promise<CheckInResult> {
    const transactionData = createTransactionData({
      user_id: userId,
      establishment_id: context.entityId,
      points: 10,
      transaction_type: 'earn',
      source: 'establishment_checkin',
      description: `Check-in at ${context.entityName}`,
      metadata: {
        entity_name: context.entityName,
        rating: options.rating,
        note: options.note,
        location: context.locationData
      }
    });

    const { data, error } = await supabase
      .from('reward_transactions')
      .insert(transactionData)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Successfully checked in at ${context.entityName}! Earned 10 points.`,
      pointsEarned: 10,
      transaction: transformDatabaseRow(data)
    };
  }

  /**
   * Handle bar crawl check-in
   */
  private async handleBarCrawlCheckIn(
    userId: string,
    context: BarCrawlCheckIn,
    options: CheckInOptions
  ): Promise<CheckInResult> {
    const transactionData = createTransactionData({
      user_id: userId,
      points: 15,
      transaction_type: 'earn',
      source: 'bar_crawl_checkin',
      description: `Bar crawl check-in: ${context.entityName}`,
      metadata: {
        entity_name: context.entityName,
        bar_crawl_id: context.entityId,
        rating: options.rating,
        note: options.note,
        location: context.locationData
      }
    });

    const { data, error } = await supabase
      .from('reward_transactions')
      .insert(transactionData)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Bar crawl check-in successful! Earned 15 points.`,
      pointsEarned: 15,
      transaction: transformDatabaseRow(data)
    };
  }

  /**
   * Handle swig circuit check-in
   */
  private async handleSwigCircuitCheckIn(
    userId: string,
    context: SwigCircuitCheckIn,
    options: CheckInOptions
  ): Promise<CheckInResult> {
    const transactionData = createTransactionData({
      user_id: userId,
      establishment_id: context.establishmentId,
      points: 20,
      transaction_type: 'earn',
      source: 'swig_circuit_checkin',
      description: `Swig Circuit check-in: ${context.entityName}`,
      metadata: {
        entity_name: context.entityName,
        swig_circuit_id: context.entityId,
        establishment_id: context.establishmentId,
        establishment_name: context.establishmentName,
        rating: options.rating,
        note: options.note,
        location: context.locationData
      }
    });

    const { data, error } = await supabase
      .from('reward_transactions')
      .insert(transactionData)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Swig Circuit check-in successful! Earned 20 points.`,
      pointsEarned: 20,
      transaction: transformDatabaseRow(data)
    };
  }

  /**
   * Main check-in method - uses simple type checking instead of complex union discrimination
   */
  async performCheckIn(
    userId: string, 
    context: CheckInContext, 
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      if (context.type === 'establishment') {
        return this.handleEstablishmentCheckIn(userId, context as EstablishmentCheckIn, options);
      } else if (context.type === 'bar_crawl') {
        return this.handleBarCrawlCheckIn(userId, context as BarCrawlCheckIn, options);
      } else if (context.type === 'swig_circuit') {
        return this.handleSwigCircuitCheckIn(userId, context as SwigCircuitCheckIn, options);
      } else {
        return {
          success: false,
          message: 'Invalid check-in context type'
        };
      }
    } catch (error: any) {
      console.error('Check-in failed:', error);
      return {
        success: false,
        message: error.message || 'Check-in failed'
      };
    }
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

      return (data || []).map(transformDatabaseRow);
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
