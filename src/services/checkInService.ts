
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
  newBalance?: number;
}

class CheckInService {
  private readonly COOLDOWN_MINUTES = 15;
  private readonly BASE_POINTS = 10;

  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      // Step 1: Check cooldown period
      const canCheckIn = await this.canUserCheckIn(userId, context);
      if (!canCheckIn) {
        return {
          success: false,
          message: `You must wait ${this.COOLDOWN_MINUTES} minutes between check-ins at the same location.`
        };
      }

      // Step 2: Record reward transaction
      const pointsEarned = await this.recordRewardTransaction(userId, context, options);
      if (!pointsEarned) {
        return {
          success: false,
          message: 'Failed to record reward points. Please try again.'
        };
      }

      // Step 2: Record type-specific check-in data
      await this.recordTypeSpecificCheckIn(userId, context, options);

      return {
        success: true,
        message: `Check-in successful! You earned ${pointsEarned} points.`,
        pointsEarned
      };
    } catch (error: any) {
      console.error('Error during check-in:', error);
      return {
        success: false,
        message: error.message || 'Check-in failed. Please try again.'
      };
    }
  }

  private async canUserCheckIn(userId: string, context: CheckInContext): Promise<boolean> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setMinutes(cutoffTime.getMinutes() - this.COOLDOWN_MINUTES);

      const { data, error } = await supabase
        .from('reward_transactions')
        .select('created_at')
        .eq('user_id', userId)
        .eq('source', context.type)
        .gte('created_at', cutoffTime.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return !data || data.length === 0;
    } catch (error) {
      console.error('Error checking cooldown:', error);
      return false;
    }
  }

  private async recordRewardTransaction(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions
  ): Promise<number> {
    const points = this.BASE_POINTS;
    
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

      const { data, error } = await supabase
        .from('reward_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        console.error('Error recording reward transaction:', error);
        throw new Error('Failed to record reward points');
      }

      return points;
    } catch (error: any) {
      console.error('Error in recordRewardTransaction:', error);
      throw error;
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
            await supabase
              .from('bar_crawl_check_ins')
              .insert({
                bar_crawl_id: context.entityId,
                user_id: userId,
                establishment_id: context.additionalData.establishment_id,
                checked_in_at: new Date().toISOString()
              });
          }
          break;

        case 'swig_circuit':
          if (context.additionalData?.establishment_id) {
            await supabase
              .from('swig_circuit_check_ins')
              .insert({
                swig_circuit_id: context.entityId,
                attendee_id: userId,
                establishment_id: context.additionalData.establishment_id,
                checked_in_by: userId,
                checked_in_at: new Date().toISOString()
              });
          }
          break;

        case 'establishment':
          // For establishment check-ins, the reward transaction is sufficient
          break;

        default:
          console.warn(`Unknown check-in type: ${context.type}`);
      }
    } catch (error) {
      console.error(`Error recording ${context.type} check-in:`, error);
      // Don't throw error as the main transaction was successful
    }
  }

  async getCheckInHistory(
    userId: string,
    options: {
      type?: string;
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

      if (options.type) {
        query = query.eq('source', options.type);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform database rows to RewardTransaction objects with all required properties
      return (data || []).map((row): RewardTransaction => ({
        id: row.id,
        user_id: row.user_id,
        userId: row.user_id, // Backward compatibility
        establishment_id: row.establishment_id,
        points: row.points,
        pointsAmount: row.points, // Backward compatibility
        transaction_type: row.transaction_type,
        type: row.transaction_type === 'earn' ? 'earned' : 'redeemed', // Component-expected format
        source: row.source,
        description: row.description || row.source,
        timestamp: row.created_at,
        date: row.created_at, // Backward compatibility
        created_at: row.created_at,
        version: row.version || 1, // Default version if not present
        metadata: row.metadata || {}
      }));

    } catch (error) {
      console.error('Error fetching check-in history:', error);
      return [];
    }
  }

  async getVisitStats(userId: string): Promise<{
    total_visits: number;
    unique_establishments: number;
    total_points_earned: number;
    visited_entities: string[];
  }> {
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('points, source, establishment_id, metadata')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn');

      if (error) throw error;

      const visits = data || [];
      const uniqueEntities = new Set<string>();
      let totalPoints = 0;

      visits.forEach(visit => {
        totalPoints += visit.points;
        
        // Track unique entities
        if (visit.establishment_id) {
          uniqueEntities.add(visit.establishment_id);
        } else if (visit.metadata?.entity_name) {
          uniqueEntities.add(visit.metadata.entity_name);
        }
      });

      return {
        total_visits: visits.length,
        unique_establishments: uniqueEntities.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(uniqueEntities)
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

export const checkInService = new CheckInService();
