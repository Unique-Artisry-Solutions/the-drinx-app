
import { supabase } from '@/integrations/supabase/client';
import { toJsonCompatible } from '@/utils/databaseSerialization';

// JSON-compatible location data for database storage
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
  [key: string]: any; // Make it compatible with Json type
}

// Check-in context interfaces
export interface BaseCheckInContext {
  type: 'establishment' | 'bar_crawl' | 'swig_circuit';
  entityId: string;
  entityName: string;
  locationData?: LocationData;
}

export interface EstablishmentCheckIn extends BaseCheckInContext {
  type: 'establishment';
}

export interface BarCrawlCheckIn extends BaseCheckInContext {
  type: 'bar_crawl';
  additionalData?: {
    establishment_id: string;
    establishment_name: string;
    [key: string]: any;
  };
}

export interface SwigCircuitCheckIn extends BaseCheckInContext {
  type: 'swig_circuit';
  establishmentId: string;
  establishmentName: string;
}

export type CheckInContext = EstablishmentCheckIn | BarCrawlCheckIn | SwigCircuitCheckIn;

export interface CheckInOptions {
  rating?: number | null;
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

// Safe metadata builder that ensures JSON compatibility
function buildCheckInMetadata(
  context: CheckInContext,
  options: CheckInOptions = {}
): Record<string, any> {
  const baseMetadata = {
    entity_type: context.type,
    entity_id: context.entityId,
    entity_name: context.entityName,
    rating: options.rating || null,
    note: options.note || '',
  };

  // Add context-specific data
  if (context.type === 'bar_crawl' && context.additionalData) {
    Object.assign(baseMetadata, {
      establishment_id: context.additionalData.establishment_id,
      establishment_name: context.additionalData.establishment_name,
    });
  }

  if (context.type === 'swig_circuit') {
    Object.assign(baseMetadata, {
      establishment_id: context.establishmentId,
      establishment_name: context.establishmentName,
    });
  }

  // Add location data if present - convert to JSON-compatible format
  if (context.locationData) {
    baseMetadata.location_data = toJsonCompatible(context.locationData);
  }

  return toJsonCompatible(baseMetadata);
}

// Reward transaction transformer
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

function transformRewardTransaction(dbTransaction: DatabaseRewardTransaction): any {
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
    description: dbTransaction.description || '',
    timestamp: dbTransaction.created_at,
    date: dbTransaction.created_at,
    created_at: dbTransaction.created_at,
    version: dbTransaction.version || 1,
    metadata: dbTransaction.metadata || {},
  };
}

class CheckInService {
  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      console.log('Starting check-in process:', { userId, context, options });

      // Validate required parameters
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!context.entityId) {
        throw new Error('Entity ID is required');
      }

      // Determine points to award based on context type
      const pointsToAward = this.calculatePoints(context);

      // Build JSON-compatible metadata
      const metadata = buildCheckInMetadata(context, options);

      // Create reward transaction
      const { data: rewardData, error: rewardError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: userId,
          establishment_id: context.type === 'establishment' ? context.entityId : 
                           context.type === 'bar_crawl' && context.additionalData ? context.additionalData.establishment_id :
                           context.type === 'swig_circuit' ? context.establishmentId : undefined,
          points: pointsToAward,
          transaction_type: 'earn',
          source: `${context.type}_check_in`,
          description: `Check-in at ${context.entityName}`,
          metadata: metadata, // Now properly JSON-compatible
        })
        .select()
        .single();

      if (rewardError) {
        console.error('Error creating reward transaction:', rewardError);
        throw new Error(`Failed to record check-in: ${rewardError.message}`);
      }

      // Update user points balance
      await this.updateUserPoints(userId, pointsToAward, context);

      console.log('Check-in completed successfully:', rewardData);

      return {
        success: true,
        message: `Successfully checked in! You earned ${pointsToAward} points.`,
        pointsEarned: pointsToAward,
      };

    } catch (error: any) {
      console.error('Check-in service error:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred during check-in',
        error: error.message,
      };
    }
  }

  private calculatePoints(context: CheckInContext): number {
    switch (context.type) {
      case 'establishment':
        return 10;
      case 'bar_crawl':
        return 25;
      case 'swig_circuit':
        return 20;
      default:
        return 10;
    }
  }

  private async updateUserPoints(userId: string, points: number, context: CheckInContext): Promise<void> {
    const establishmentId = context.type === 'establishment' ? context.entityId : 
                           context.type === 'bar_crawl' && context.additionalData ? context.additionalData.establishment_id :
                           context.type === 'swig_circuit' ? context.establishmentId : undefined;

    // Try to update existing record
    const { data: existingRecord } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('establishment_id', establishmentId)
      .maybeSingle();

    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_rewards')
        .update({
          points: existingRecord.points + points,
          lifetime_points: existingRecord.lifetime_points + points,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRecord.id);

      if (updateError) {
        console.error('Error updating user points:', updateError);
        throw new Error('Failed to update points balance');
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('user_rewards')
        .insert({
          user_id: userId,
          establishment_id: establishmentId,
          points: points,
          lifetime_points: points,
        });

      if (insertError) {
        console.error('Error creating user rewards record:', insertError);
        throw new Error('Failed to create points balance');
      }
    }
  }

  async getCheckInHistory(
    userId: string,
    options: { type?: string; limit?: number; offset?: number } = {}
  ): Promise<any[]> {
    try {
      let query = supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn')
        .order('created_at', { ascending: false });

      if (options.type) {
        query = query.like('source', `%${options.type}%`);
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
      console.error('Error in getCheckInHistory:', error);
      return [];
    }
  }

  async getVisitStats(userId: string): Promise<any> {
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

      const visits = data || [];
      const uniqueEstablishments = new Set();
      let totalPointsEarned = 0;

      visits.forEach(visit => {
        if (visit.establishment_id) {
          uniqueEstablishments.add(visit.establishment_id);
        }
        totalPointsEarned += visit.points;
      });

      return {
        total_visits: visits.length,
        unique_establishments: uniqueEstablishments.size,
        total_points_earned: totalPointsEarned,
        visited_entities: Array.from(uniqueEstablishments)
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
}

export const checkInService = new CheckInService();
