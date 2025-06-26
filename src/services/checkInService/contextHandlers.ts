
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckInContext, 
  EstablishmentCheckInContext, 
  BarCrawlCheckInContext, 
  SwigCircuitCheckInContext,
  CheckInOptions,
  CheckInResult 
} from './types';
import { transformDatabaseTransactionRow, createSafeTransactionInsert } from './databaseTransformers';

/**
 * Context-specific check-in handlers
 */

export class EstablishmentCheckInHandler {
  async performCheckIn(
    userId: string, 
    context: EstablishmentCheckInContext, 
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      // Create transaction record for establishment check-in
      const transactionData = createSafeTransactionInsert({
        user_id: userId,
        establishment_id: context.entityId,
        points: 10, // Base points for establishment check-in
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
        transaction: transformDatabaseTransactionRow(data)
      };
    } catch (error: any) {
      console.error('Establishment check-in failed:', error);
      return {
        success: false,
        message: error.message || 'Check-in failed'
      };
    }
  }
}

export class BarCrawlCheckInHandler {
  async performCheckIn(
    userId: string, 
    context: BarCrawlCheckInContext, 
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      const transactionData = createSafeTransactionInsert({
        user_id: userId,
        points: 15, // Higher points for bar crawl participation
        transaction_type: 'earn',
        source: 'bar_crawl_checkin',
        description: `Bar crawl check-in: ${context.entityName}`,
        metadata: {
          entity_name: context.entityName,
          bar_crawl_id: context.entityId,
          rating: options.rating,
          note: options.note,
          location: context.locationData,
          ...context.additionalData
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
        transaction: transformDatabaseTransactionRow(data)
      };
    } catch (error: any) {
      console.error('Bar crawl check-in failed:', error);
      return {
        success: false,
        message: error.message || 'Bar crawl check-in failed'
      };
    }
  }
}

export class SwigCircuitCheckInHandler {
  async performCheckIn(
    userId: string, 
    context: SwigCircuitCheckInContext, 
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      const transactionData = createSafeTransactionInsert({
        user_id: userId,
        establishment_id: context.additionalData.establishment_id,
        points: 20, // Premium points for swig circuit
        transaction_type: 'earn',
        source: 'swig_circuit_checkin',
        description: `Swig Circuit check-in: ${context.entityName}`,
        metadata: {
          entity_name: context.entityName,
          swig_circuit_id: context.entityId,
          establishment_id: context.additionalData.establishment_id,
          establishment_name: context.additionalData.establishment_name,
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
        transaction: transformDatabaseTransactionRow(data)
      };
    } catch (error: any) {
      console.error('Swig circuit check-in failed:', error);
      return {
        success: false,
        message: error.message || 'Swig circuit check-in failed'
      };
    }
  }
}
