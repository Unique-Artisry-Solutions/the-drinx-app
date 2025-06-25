
import { supabase } from '@/integrations/supabase/client';
import { RewardTransaction } from '@/types/rewards/api';

export interface CheckInContext {
  type: 'establishment' | 'event' | 'swig_circuit' | 'bar_crawl';
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
  duration_minutes?: number;
}

export interface CheckInResult {
  success: boolean;
  transactionId?: string;
  pointsEarned?: number;
  message: string;
  error?: string;
}

class CheckInService {
  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      // Calculate points based on context and user activity
      const pointsToAward = await this.calculateCheckInPoints(userId, context);
      
      // Create the reward transaction for the check-in
      const { data: transaction, error } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: userId,
          establishment_id: context.type === 'establishment' ? context.entityId : null,
          points: pointsToAward,
          transaction_type: 'earn',
          source: `${context.type}_check_in`,
          description: `Check-in at ${context.entityName}`,
          metadata: {
            check_in_type: context.type,
            entity_id: context.entityId,
            entity_name: context.entityName,
            rating: options.rating,
            note: options.note,
            duration_minutes: options.duration_minutes,
            location_data: context.locationData,
            check_in_date: new Date().toISOString(),
            ...context.additionalData
          }
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Handle specific check-in types
      await this.handleSpecificCheckIn(context, userId, transaction.id);

      return {
        success: true,
        transactionId: transaction.id,
        pointsEarned: pointsToAward,
        message: `Successfully checked in at ${context.entityName}! You earned ${pointsToAward} points.`
      };

    } catch (error: any) {
      console.error('Check-in failed:', error);
      return {
        success: false,
        message: 'Check-in failed. Please try again.',
        error: error.message
      };
    }
  }

  private async calculateCheckInPoints(userId: string, context: CheckInContext): Promise<number> {
    // Base points for different check-in types
    const basePoints = {
      establishment: 10,
      event: 15,
      swig_circuit: 20,
      bar_crawl: 25
    };

    let points = basePoints[context.type] || 10;

    // Check for streak bonuses
    const streakBonus = await this.getStreakBonus(userId, context.type);
    points += streakBonus;

    // Check for first-time visit bonus
    const isFirstVisit = await this.isFirstVisit(userId, context);
    if (isFirstVisit) {
      points += 5; // First visit bonus
    }

    return points;
  }

  private async getStreakBonus(userId: string, checkInType: string): Promise<number> {
    try {
      const { data: streaks } = await supabase
        .from('user_activity_streaks')
        .select('current_count')
        .eq('user_id', userId)
        .eq('streak_type', `${checkInType}_check_in`)
        .single();

      if (!streaks) return 0;

      // Bonus points based on streak length
      if (streaks.current_count >= 7) return 5;
      if (streaks.current_count >= 3) return 2;
      return 0;
    } catch {
      return 0;
    }
  }

  private async isFirstVisit(userId: string, context: CheckInContext): Promise<boolean> {
    try {
      const { data: existingVisits } = await supabase
        .from('reward_transactions')
        .select('id')
        .eq('user_id', userId)
        .eq('source', `${context.type}_check_in`)
        .eq('metadata->entity_id', context.entityId)
        .limit(1);

      return !existingVisits || existingVisits.length === 0;
    } catch {
      return false;
    }
  }

  private async handleSpecificCheckIn(context: CheckInContext, userId: string, transactionId: string): Promise<void> {
    // Handle specific check-in logic for different types
    switch (context.type) {
      case 'swig_circuit':
        await this.handleSwigCircuitCheckIn(context.entityId, userId);
        break;
      case 'bar_crawl':
        await this.handleBarCrawlCheckIn(context.entityId, userId);
        break;
      case 'event':
        await this.handleEventCheckIn(context.entityId, userId);
        break;
      // establishment check-ins are handled by the reward transaction alone
    }
  }

  private async handleSwigCircuitCheckIn(swigCircuitId: string, userId: string): Promise<void> {
    // Find the attendee record
    const { data: attendee } = await supabase
      .from('swig_circuit_attendees')
      .select('id')
      .eq('swig_circuit_id', swigCircuitId)
      .eq('user_id', userId)
      .single();

    if (attendee) {
      // Record the check-in in the specific swig circuit table
      await supabase
        .from('swig_circuit_check_ins')
        .insert({
          swig_circuit_id: swigCircuitId,
          attendee_id: attendee.id,
          checked_in_by: userId
        });
    }
  }

  private async handleBarCrawlCheckIn(barCrawlId: string, userId: string): Promise<void> {
    // Record bar crawl specific check-in
    await supabase
      .from('bar_crawl_check_ins')
      .insert({
        bar_crawl_id: barCrawlId,
        user_id: userId
      });
  }

  private async handleEventCheckIn(eventId: string, userId: string): Promise<void> {
    // Update event attendee status
    await supabase
      .from('event_attendees')
      .update({ 
        status: 'checked_in',
        checked_in_at: new Date().toISOString()
      })
      .eq('event_id', eventId)
      .eq('user_id', userId);
  }

  async getCheckInHistory(userId: string, options: {
    type?: string;
    entityId?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<RewardTransaction[]> {
    let query = supabase
      .from('reward_transactions')
      .select('*')
      .eq('user_id', userId)
      .like('source', '%_check_in')
      .order('created_at', { ascending: false });

    if (options.type) {
      query = query.eq('source', `${options.type}_check_in`);
    }

    if (options.entityId) {
      query = query.eq('metadata->entity_id', options.entityId);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  }

  async getVisitStats(userId: string): Promise<{
    total_visits: number;
    unique_establishments: number;
    total_points_earned: number;
    visited_entities: string[];
  }> {
    try {
      const { data: checkIns } = await supabase
        .from('reward_transactions')
        .select('points, metadata')
        .eq('user_id', userId)
        .like('source', '%_check_in');

      if (!checkIns) {
        return {
          total_visits: 0,
          unique_establishments: 0,
          total_points_earned: 0,
          visited_entities: []
        };
      }

      const uniqueEntities = new Set<string>();
      let totalPoints = 0;

      checkIns.forEach(checkIn => {
        if (checkIn.metadata?.entity_id) {
          uniqueEntities.add(checkIn.metadata.entity_id);
        }
        totalPoints += checkIn.points || 0;
      });

      return {
        total_visits: checkIns.length,
        unique_establishments: uniqueEntities.size,
        total_points_earned: totalPoints,
        visited_entities: Array.from(uniqueEntities)
      };
    } catch (error) {
      console.error('Error getting visit stats:', error);
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
