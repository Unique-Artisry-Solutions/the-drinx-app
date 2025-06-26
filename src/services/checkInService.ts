import { supabase } from '@/integrations/supabase/client';
import type { RewardTransaction } from '@/types/rewards/api';
import { 
  transformDatabaseTransactionRow, 
  extractEntityName, 
  createSafeTransactionInsert 
} from './checkInService/databaseTransformers';

export interface CheckInContext {
  type: 'establishment' | 'bar_crawl';
  entityId: string;
  entityName: string;
  locationData?: {
    latitude: number;
    longitude: number;
  };
  additionalData?: Record<string, any>;
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
  transactionId?: string;
}

export interface UserVisitStats {
  total_visits: number;
  unique_establishments: number;
  total_points_earned: number;
  visited_entities: string[];
}

class CheckInService {
  private readonly POINTS_PER_CHECKIN = 25;
  private readonly CHECKIN_COOLDOWN_MINUTES = 60;

  async performCheckIn(
    userId: string, 
    context: CheckInContext, 
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      // Check cooldown
      const canCheckIn = await this.checkCooldown(userId, context.entityId);
      if (!canCheckIn) {
        return {
          success: false,
          message: "You've already checked in recently. Please wait before checking in again."
        };
      }

      // Verify location if provided
      if (context.locationData) {
        const locationValid = await this.verifyLocation(context.entityId, context.locationData);
        if (!locationValid) {
          return {
            success: false,
            message: "You must be at the location to check in."
          };
        }
      }

      // Create transaction record
      const transactionData = createSafeTransactionInsert({
        user_id: userId,
        establishment_id: context.type === 'establishment' ? context.entityId : context.additionalData?.establishment_id,
        points: this.POINTS_PER_CHECKIN,
        transaction_type: 'earn',
        source: 'check_in',
        description: `Check-in at ${context.entityName}`,
        metadata: {
          entity_type: context.type,
          entity_id: context.entityId,
          entity_name: context.entityName,
          rating: options.rating,
          note: options.note,
          location_verified: !!context.locationData,
          ...context.additionalData
        }
      });

      const { data: transaction, error } = await supabase
        .from('reward_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        console.error('Error creating check-in transaction:', error);
        return {
          success: false,
          message: "Failed to record check-in. Please try again."
        };
      }

      // Update user points
      await this.updateUserPoints(userId, this.POINTS_PER_CHECKIN, context.entityId);

      return {
        success: true,
        message: `Check-in successful! You earned ${this.POINTS_PER_CHECKIN} points.`,
        pointsEarned: this.POINTS_PER_CHECKIN,
        transactionId: transaction.id
      };

    } catch (error: any) {
      console.error('Check-in service error:', error);
      return {
        success: false,
        message: error.message || "An unexpected error occurred during check-in."
      };
    }
  }

  async getCheckInHistory(
    userId: string, 
    options: {
      type?: 'establishment' | 'bar_crawl';
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<RewardTransaction[]> {
    try {
      let query = supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('source', 'check_in')
        .order('created_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data: transactions, error } = await query;

      if (error) {
        console.error('Error fetching check-in history:', error);
        return [];
      }

      if (!transactions) {
        return [];
      }

      // Transform database rows to application types
      return transactions.map(transformDatabaseTransactionRow);

    } catch (error) {
      console.error('Error in getCheckInHistory:', error);
      return [];
    }
  }

  async getVisitStats(userId: string): Promise<UserVisitStats> {
    try {
      const { data: transactions, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('source', 'check_in');

      if (error || !transactions) {
        console.error('Error fetching visit stats:', error);
        return {
          total_visits: 0,
          unique_establishments: 0,
          total_points_earned: 0,
          visited_entities: []
        };
      }

      const transformedTransactions = transactions.map(transformDatabaseTransactionRow);
      const establishmentIds = new Set<string>();
      const visitedEntities = new Set<string>();
      let totalPoints = 0;

      transformedTransactions.forEach(transaction => {
        if (transaction.establishment_id) {
          establishmentIds.add(transaction.establishment_id);
        }
        
        // Extract entity name safely
        const entityName = extractEntityName(transaction.metadata);
        if (entityName && entityName !== 'Unknown') {
          visitedEntities.add(entityName);
        }
        
        totalPoints += transaction.points;
      });

      return {
        total_visits: transformedTransactions.length,
        unique_establishments: establishmentIds.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(visitedEntities)
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

  private async checkCooldown(userId: string, entityId: string): Promise<boolean> {
    try {
      const cooldownTime = new Date();
      cooldownTime.setMinutes(cooldownTime.getMinutes() - this.CHECKIN_COOLDOWN_MINUTES);

      const { data: recentCheckIn } = await supabase
        .from('reward_transactions')
        .select('created_at')
        .eq('user_id', userId)
        .eq('source', 'check_in')
        .gte('created_at', cooldownTime.toISOString())
        .limit(1)
        .single();

      return !recentCheckIn;
    } catch (error) {
      return true;
    }
  }

  private async verifyLocation(
    entityId: string, 
    userLocation: { latitude: number; longitude: number }
  ): Promise<boolean> {
    try {
      const { data: establishment } = await supabase
        .from('establishments')
        .select('latitude, longitude')
        .eq('id', entityId)
        .single();

      if (!establishment?.latitude || !establishment?.longitude) {
        return true;
      }

      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        establishment.latitude,
        establishment.longitude
      );

      return distance <= 100;
    } catch (error) {
      console.error('Error verifying location:', error);
      return true;
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private async updateUserPoints(userId: string, points: number, establishmentId?: string): Promise<void> {
    try {
      const { data: existingRecord } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', userId)
        .eq('establishment_id', establishmentId || '')
        .maybeSingle();

      if (existingRecord) {
        await supabase
          .from('user_rewards')
          .update({
            points: existingRecord.points + points,
            lifetime_points: existingRecord.lifetime_points + points,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id);
      } else {
        await supabase
          .from('user_rewards')
          .insert({
            user_id: userId,
            establishment_id: establishmentId,
            points: points,
            lifetime_points: points
          });
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  }
}

export const checkInService = new CheckInService();
