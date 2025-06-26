import { supabase } from '@/lib/typedSupabase';
import { RewardTransaction } from '@/types/rewards/api';
import { Database } from '@/lib/typedSupabase';

// Base check-in context interface
interface BaseCheckInContext {
  type: string;
  entityId: string;
  entityName: string;
  locationData?: {
    latitude: number;
    longitude: number;
  };
}

// Bar crawl specific check-in context
interface BarCrawlCheckIn extends BaseCheckInContext {
  type: 'bar_crawl';
  additionalData: {
    establishment_id: string;
    establishment_name: string;
  };
}

// Establishment specific check-in context  
interface EstablishmentCheckIn extends BaseCheckInContext {
  type: 'establishment';
}

// Swig circuit specific check-in context
interface SwigCircuitCheckIn extends BaseCheckInContext {
  type: 'swig_circuit';
  establishmentId: string;
  establishmentName: string;
}

// Union type for all check-in contexts
type CheckInContext = BarCrawlCheckIn | EstablishmentCheckIn | SwigCircuitCheckIn;

// Options for check-in operations
interface CheckInOptions {
  rating?: number | null;
  note?: string;
  establishmentName?: string;
}

// Result of check-in operations
interface CheckInResult {
  success: boolean;
  message: string;
  points?: number;
  transaction?: RewardTransaction;
}

// Database transaction type (what comes from Supabase)
interface DatabaseRewardTransaction {
  id: string;
  user_id: string;
  establishment_id?: string;
  points: number;
  transaction_type: 'earn' | 'redeem';
  source: string;
  description?: string;
  metadata?: Record<string, any> | string | null;
  created_at: string;
  version?: number;
}

// Type guard to check if a database record is a valid reward transaction
function isDatabaseRewardTransaction(record: any): record is DatabaseRewardTransaction {
  return (
    record &&
    typeof record.id === 'string' &&
    typeof record.user_id === 'string' &&
    typeof record.points === 'number' &&
    (record.transaction_type === 'earn' || record.transaction_type === 'redeem') &&
    typeof record.source === 'string' &&
    typeof record.created_at === 'string'
  );
}

// Transform database record to RewardTransaction
function transformRewardTransaction(dbRecord: any): RewardTransaction {
  // Ensure transaction_type is properly cast
  const transaction_type = (dbRecord.transaction_type === 'redeem') ? 'redeem' : 'earn';
  
  return {
    id: dbRecord.id,
    user_id: dbRecord.user_id,
    establishment_id: dbRecord.establishment_id || undefined,
    points: dbRecord.points,
    transaction_type,
    source: dbRecord.source,
    description: dbRecord.description || undefined,
    metadata: typeof dbRecord.metadata === 'string' 
      ? JSON.parse(dbRecord.metadata) 
      : dbRecord.metadata || {},
    created_at: dbRecord.created_at,
    version: dbRecord.version || 1
  };
}

// Function to calculate the time remaining until the cooldown expires
const getTimeRemaining = (lastCheckInTime: string, cooldownMinutes: number): number => {
  const lastCheckIn = new Date(lastCheckInTime).getTime();
  const now = Date.now();
  const cooldownExpiration = lastCheckIn + cooldownMinutes * 60 * 1000;
  return Math.max(0, cooldownExpiration - now);
};

// Function to format the time remaining into a human-readable string
const formatTimeRemaining = (timeRemaining: number): string => {
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

class CheckInService {
  private readonly CHECK_IN_COOLDOWN_MINUTES = 1;

  async performCheckIn(
    userId: string,
    context: CheckInContext,
    options: CheckInOptions = {}
  ): Promise<CheckInResult> {
    try {
      // Check if the user is on cooldown for this establishment
      const lastCheckInTime = localStorage.getItem('last_check_in_time');
      const lastCheckedInEstablishment = localStorage.getItem('last_checked_in_establishment');
      const now = new Date();
  
      if (lastCheckInTime && lastCheckedInEstablishment === context.entityId) {
        const timeRemaining = getTimeRemaining(lastCheckInTime, this.CHECK_IN_COOLDOWN_MINUTES);
        if (timeRemaining > 0) {
          const formattedTime = formatTimeRemaining(timeRemaining);
          return {
            success: false,
            message: `You're on cooldown. Please wait ${formattedTime} before checking in again.`,
          };
        }
      }

      // Define points earned for the check-in
      let points = 10;
      if (context.type === 'swig_circuit') {
        points = 25;
      }

      // Prepare metadata for the reward transaction
      const metadata = {
        context: context,
        options: options
      };

      // Create the reward transaction
      const { data, error } = await supabase
        .from('reward_transactions')
        .insert([
          {
            user_id: userId,
            points: points,
            transaction_type: 'earn',
            source: context.type,
            description: `Check-in at ${context.entityName}`,
            metadata: metadata,
          },
        ])
        .select('*')

      if (error) {
        console.error('Error during check-in:', error);
        return { success: false, message: 'Failed to record check-in.' };
      }
      
      if (!data || data.length === 0) {
        return { success: false, message: 'No data returned from check-in.' };
      }

      // Transform the database record to a RewardTransaction
      const transaction = transformRewardTransaction(data[0]);

      // Return success with the reward transaction
      return {
        success: true,
        message: `Successfully checked in at ${context.entityName}!`,
        points: points,
        transaction: transaction
      };
    } catch (error: any) {
      console.error('Error during check-in:', error);
      return { success: false, message: error.message || 'Failed to record check-in.' };
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
      console.log('Fetching check-in history for user:', userId, 'with options:', options);
      
      let query = supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn')
        .order('created_at', { ascending: false });

      if (options.type === 'establishment') {
        query = query.not('establishment_id', 'is', null);
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
        throw error;
      }

      if (!data) return [];

      // Cast the transaction_type properly and transform the data
      return data
        .map(record => ({
          ...record,
          transaction_type: (record.transaction_type === 'redeem') ? 'redeem' as const : 'earn' as const
        }))
        .filter(isDatabaseRewardTransaction)
        .map(transformRewardTransaction);

    } catch (error) {
      console.error('Error in getCheckInHistory:', error);
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
      // Fetch total visits and points earned
      const { data: transactions, error: transactionError } = await supabase
        .from('reward_transactions')
        .select('points')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn');

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError);
        throw transactionError;
      }

      const total_visits = transactions ? transactions.length : 0;
      const total_points_earned = transactions ? transactions.reduce((sum, transaction) => sum + transaction.points, 0) : 0;

      // Fetch unique establishments visited
      const { data: uniqueEstablishments, error: uniqueError } = await supabase
        .from('reward_transactions')
        .select('establishment_id')
        .eq('user_id', userId)
        .neq('establishment_id', null)
        .eq('transaction_type', 'earn');

      if (uniqueError) {
        console.error('Error fetching unique establishments:', uniqueError);
        throw uniqueError;
      }

      const unique_establishments = uniqueEstablishments ? new Set(uniqueEstablishments.map(e => e.establishment_id)).size : 0;
    
      // Fetch visited entities
      const { data: visitedEntitiesData, error: visitedEntitiesError } = await supabase
        .from('reward_transactions')
        .select('source')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn');

      if (visitedEntitiesError) {
        console.error('Error fetching visited entities:', visitedEntitiesError);
        throw visitedEntitiesError;
      }

      const visited_entities = visitedEntitiesData ? visitedEntitiesData.map(e => e.source) : [];

      return {
        total_visits,
        unique_establishments,
        total_points_earned,
        visited_entities
      };
    } catch (error: any) {
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

// Export the service instance
export const checkInService = new CheckInService();

// Export types for external use
export type {
  BarCrawlCheckIn,
  EstablishmentCheckIn, 
  SwigCircuitCheckIn,
  CheckInContext,
  CheckInOptions,
  CheckInResult
};
