
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckInContext, 
  CheckInOptions, 
  CheckInResult,
  isEstablishmentContext,
  isBarCrawlContext,
  isSwigCircuitContext
} from './types';
import { transformDatabaseTransactionRow, createSafeTransactionInsert } from './databaseTransformers';

/**
 * Factory-based check-in service that avoids union type issues
 */
export class CheckInFactory {
  /**
   * Process check-in using factory pattern instead of switch on union types
   */
  async processCheckIn(
    userId: string, 
    context: CheckInContext, 
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      if (isEstablishmentContext(context)) {
        return this.handleEstablishmentCheckIn(userId, context, options);
      } else if (isBarCrawlContext(context)) {
        return this.handleBarCrawlCheckIn(userId, context, options);
      } else if (isSwigCircuitContext(context)) {
        return this.handleSwigCircuitCheckIn(userId, context, options);
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

  private async handleEstablishmentCheckIn(
    userId: string,
    context: EstablishmentCheckInContext,
    options: CheckInOptions
  ): Promise<CheckInResult> {
    const transactionData = createSafeTransactionInsert({
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
      transaction: transformDatabaseTransactionRow(data)
    };
  }

  private async handleBarCrawlCheckIn(
    userId: string,
    context: BarCrawlCheckInContext,
    options: CheckInOptions
  ): Promise<CheckInResult> {
    const transactionData = createSafeTransactionInsert({
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
  }

  private async handleSwigCircuitCheckIn(
    userId: string,
    context: SwigCircuitCheckInContext,
    options: CheckInOptions
  ): Promise<CheckInResult> {
    const transactionData = createSafeTransactionInsert({
      user_id: userId,
      establishment_id: context.additionalData.establishment_id,
      points: 20,
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
  }
}
