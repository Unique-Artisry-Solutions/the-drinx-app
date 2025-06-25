
import { supabase } from '@/integrations/supabase/client';
import { safeJsonToRecord } from '@/utils/typeGuards';

// Database layer types - exactly what Supabase returns
interface DatabaseRewardTransaction {
  id: string;
  user_id: string;
  establishment_id?: string;
  points: number;
  transaction_type: string; // This is a string from the database
  source: string;
  description?: string;
  metadata?: any; // Json type from Supabase
  created_at: string;
  version?: number;
}

// API layer types for the application
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
  rating?: number | null;
  note?: string;
  duration?: number;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  pointsEarned?: number;
  achievements?: string[];
  data?: any;
}

// Transform database result to safe API format
function transformDatabaseTransaction(dbTransaction: DatabaseRewardTransaction) {
  return {
    id: dbTransaction.id,
    user_id: dbTransaction.user_id,
    userId: dbTransaction.user_id,
    establishment_id: dbTransaction.establishment_id,
    points: dbTransaction.points,
    pointsAmount: dbTransaction.points,
    transaction_type: dbTransaction.transaction_type === 'earn' ? 'earn' : 'redeem' as 'earn' | 'redeem',
    type: dbTransaction.transaction_type === 'earn' ? 'earned' : 'redeemed' as 'earned' | 'redeemed',
    source: dbTransaction.source,
    description: dbTransaction.description || dbTransaction.source,
    timestamp: dbTransaction.created_at,
    date: dbTransaction.created_at,
    created_at: dbTransaction.created_at,
    metadata: safeJsonToRecord(dbTransaction.metadata || {})
  };
}

class CheckInService {
  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      console.log('CheckIn attempt:', { userId, context, options });

      // Validate cooldown period first
      const canCheckIn = await this.validateCheckInCooldown(userId, context);
      if (!canCheckIn.allowed) {
        return {
          success: false,
          message: canCheckIn.message || 'Check-in not allowed at this time'
        };
      }

      // Verify location if provided
      if (context.locationData) {
        const locationValid = await this.verifyLocation(context.entityId, context.locationData);
        if (!locationValid.valid) {
          return {
            success: false,
            message: locationValid.message || 'Location verification failed'
          };
        }
      }

      // Calculate points based on context type
      const pointsToAward = this.calculatePoints(context);
      
      // Create reward transaction with proper metadata
      const metadata = {
        entity_name: context.entityName,
        check_in_type: context.type,
        rating: options.rating,
        note: options.note,
        duration_minutes: options.duration,
        ...context.additionalData
      };

      const { data: transaction, error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: userId,
          establishment_id: context.type === 'establishment' ? context.entityId : context.additionalData?.establishment_id,
          points: pointsToAward,
          transaction_type: 'earn',
          source: this.getSourceFromContext(context),
          description: `Check-in at ${context.entityName}`,
          metadata: metadata
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Transaction creation error:', transactionError);
        return {
          success: false,
          message: 'Failed to record check-in reward'
        };
      }

      // Record type-specific check-in data
      await this.recordTypeSpecificCheckIn(userId, context, transaction.id);

      // Update user's total points
      await this.updateUserPoints(userId, pointsToAward);

      return {
        success: true,
        message: `Successfully checked in! You earned ${pointsToAward} points.`,
        pointsEarned: pointsToAward,
        data: transformDatabaseTransaction(transaction)
      };

    } catch (error) {
      console.error('CheckIn service error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during check-in'
      };
    }
  }

  private async recordTypeSpecificCheckIn(
    userId: string,
    context: CheckInContext,
    transactionId: string
  ): Promise<void> {
    try {
      switch (context.type) {
        case 'establishment':
          // Record establishment visit
          await supabase.from('user_visits').insert({
            user_id: userId,
            establishment_id: context.entityId,
            visit_date: new Date().toISOString(),
            rating: context.additionalData?.rating,
            duration_minutes: context.additionalData?.duration
          });
          break;

        case 'bar_crawl':
          // Record bar crawl check-in with establishment_id
          const establishmentId = context.additionalData?.establishment_id;
          if (establishmentId) {
            await supabase.from('bar_crawl_check_ins').insert({
              user_id: userId,
              bar_crawl_id: context.entityId,
              establishment_id: establishmentId,
              checked_in_at: new Date().toISOString()
            });
          }
          break;

        case 'swig_circuit':
          // Record swig circuit check-in
          const swigEstablishmentId = context.additionalData?.establishment_id;
          if (swigEstablishmentId) {
            // First find the attendee record
            const { data: attendee } = await supabase
              .from('swig_circuit_attendees')
              .select('id')
              .eq('swig_circuit_id', context.entityId)
              .eq('user_id', userId)
              .single();

            if (attendee) {
              await supabase.from('swig_circuit_check_ins').insert({
                swig_circuit_id: context.entityId,
                attendee_id: attendee.id,
                establishment_id: swigEstablishmentId,
                checked_in_by: userId,
                checked_in_at: new Date().toISOString()
              });
            }
          }
          break;
      }
    } catch (error) {
      console.error('Error recording type-specific check-in:', error);
      // Don't throw - the main transaction succeeded
    }
  }

  private async validateCheckInCooldown(
    userId: string,
    context: CheckInContext
  ): Promise<{ allowed: boolean; message?: string }> {
    try {
      const cooldownMinutes = 15; // 15 minute cooldown
      const cutoffTime = new Date();
      cutoffTime.setMinutes(cutoffTime.getMinutes() - cooldownMinutes);

      const { data: recentCheckIn } = await supabase
        .from('reward_transactions')
        .select('created_at, metadata')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn')
        .gte('created_at', cutoffTime.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (recentCheckIn) {
        const recentMetadata = safeJsonToRecord(recentCheckIn.metadata);
        if (recentMetadata.check_in_type === context.type) {
          const timeRemaining = Math.ceil((new Date(recentCheckIn.created_at).getTime() + (cooldownMinutes * 60000) - Date.now()) / 60000);
          return {
            allowed: false,
            message: `Please wait ${timeRemaining} more minutes before checking in again`
          };
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error('Cooldown validation error:', error);
      return { allowed: true }; // Allow check-in if validation fails
    }
  }

  private async verifyLocation(
    establishmentId: string,
    userLocation: { latitude: number; longitude: number }
  ): Promise<{ valid: boolean; message?: string }> {
    try {
      // Get establishment location
      const { data: establishment } = await supabase
        .from('establishments')
        .select('latitude, longitude')
        .eq('id', establishmentId)
        .single();

      if (!establishment?.latitude || !establishment?.longitude) {
        return { valid: true }; // Allow if no location data
      }

      // Calculate distance (simple approximation)
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        establishment.latitude,
        establishment.longitude
      );

      const maxDistance = 0.1; // 0.1 miles
      if (distance > maxDistance) {
        return {
          valid: false,
          message: 'You must be within the establishment to check in'
        };
      }

      return { valid: true };
    } catch (error) {
      console.error('Location verification error:', error);
      return { valid: true }; // Allow if verification fails
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculatePoints(context: CheckInContext): number {
    switch (context.type) {
      case 'establishment':
        return 10;
      case 'bar_crawl':
        return 25;
      case 'swig_circuit':
        return 30;
      default:
        return 10;
    }
  }

  private getSourceFromContext(context: CheckInContext): string {
    switch (context.type) {
      case 'establishment':
        return 'establishment_check_in';
      case 'bar_crawl':
        return 'bar_crawl_check_in';
      case 'swig_circuit':
        return 'swig_circuit_check_in';
      default:
        return 'check_in';
    }
  }

  private async updateUserPoints(userId: string, pointsToAdd: number): Promise<void> {
    try {
      // Get or create user reward profile
      const { data: existingProfile } = await supabase
        .from('user_rewards')
        .select('points, lifetime_points')
        .eq('user_id', userId)
        .single();

      if (existingProfile) {
        // Update existing profile
        await supabase
          .from('user_rewards')
          .update({
            points: existingProfile.points + pointsToAdd,
            lifetime_points: existingProfile.lifetime_points + pointsToAdd,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Create new profile
        await supabase.from('user_rewards').insert({
          user_id: userId,
          points: pointsToAdd,
          lifetime_points: pointsToAdd
        });
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  }

  async getCheckInHistory(
    userId: string,
    options: { type?: string; limit?: number; offset?: number } = {}
  ) {
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
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching check-in history:', error);
        return [];
      }

      // Transform database results to API format
      return (data || []).map(transformDatabaseTransaction);
    } catch (error) {
      console.error('Check-in history service error:', error);
      return [];
    }
  }

  async getVisitStats(userId: string) {
    try {
      // Get all user transactions
      const { data: transactions } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn');

      if (!transactions) {
        return {
          total_visits: 0,
          unique_establishments: 0,
          total_points_earned: 0,
          visited_entities: []
        };
      }

      const visitedEntities = new Set<string>();
      let totalPoints = 0;

      transactions.forEach(transaction => {
        totalPoints += transaction.points;
        if (transaction.establishment_id) {
          visitedEntities.add(transaction.establishment_id);
        }
      });

      return {
        total_visits: transactions.length,
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
}

export const checkInService = new CheckInService();
