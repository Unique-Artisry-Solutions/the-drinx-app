import { supabase } from '@/integrations/supabase/client';
import { toJsonCompatible } from '@/utils/databaseSerialization';

// Define CheckInContext, CheckInOptions, and CheckInResult interfaces
export interface CheckInContext {
  type: 'bar_crawl' | 'establishment' | 'swig_circuit';
  entityId: string;
  entityName: string;
  additionalData?: Record<string, any>;
}

export interface CheckInOptions {
  userId: string;
  establishmentId?: string;
  establishmentName?: string;
  points?: number;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  points?: number;
  streakInfo?: {
    current: number;
    longest: number;
    milestone?: boolean;
  };
}

// Define BarCrawlCheckIn, EstablishmentCheckIn, and SwigCircuitCheckIn interfaces
export interface BarCrawlCheckIn extends CheckInContext {
  type: 'bar_crawl';
  additionalData: {
    establishment_id: string;
    establishment_name: string;
  };
}

export interface EstablishmentCheckIn extends CheckInContext {
  type: 'establishment';
  additionalData?: {
    visit_type?: string;
    special_event?: string;
  };
}

export interface SwigCircuitCheckIn extends CheckInContext {
  type: 'swig_circuit';
  additionalData: {
    establishment_id: string;
    establishment_name: string;
    position_in_circuit: number;
  };
}

// Phase 1: Create proper transformation between database and TypeScript types
function createDatabaseTransaction(userId: string, context: CheckInContext, options: CheckInOptions) {
  const points = options.points || getPointsForCheckIn(context);
  
  // Convert complex objects to JSON-compatible format (Phase 2)
  const jsonMetadata = toJsonCompatible({
    context: {
      type: context.type,
      entityId: context.entityId,
      entityName: context.entityName,
      additionalData: context.additionalData || {}
    },
    options: {
      userId: options.userId,
      establishmentId: options.establishmentId,
      establishmentName: options.establishmentName,
      points: options.points
    }
  });

  return {
    user_id: userId,
    establishment_id: options.establishmentId || null,
    points,
    transaction_type: 'earn' as const,
    source: context.type,
    description: `Check-in at ${context.entityName}`,
    metadata: jsonMetadata
  };
}

// Phase 1: Create proper transformation from database to TypeScript interface
function transformDatabaseToRewardTransaction(dbRecord: any): RewardTransaction {
  return {
    id: dbRecord.id,
    user_id: dbRecord.user_id,
    userId: dbRecord.user_id, // Backward compatibility
    establishment_id: dbRecord.establishment_id,
    points: dbRecord.points,
    pointsAmount: dbRecord.points, // Backward compatibility
    transaction_type: dbRecord.transaction_type,
    type: dbRecord.transaction_type === 'earn' ? 'earned' : 'redeemed', // Component-expected format
    source: dbRecord.source,
    description: dbRecord.description || dbRecord.source,
    timestamp: dbRecord.created_at,
    date: dbRecord.created_at, // Backward compatibility
    created_at: dbRecord.created_at,
    version: dbRecord.version,
    metadata: dbRecord.metadata || {}
  };
}

// Define getPointsForCheckIn function
function getPointsForCheckIn(context: CheckInContext): number {
  switch (context.type) {
    case 'bar_crawl':
      return 25;
    case 'establishment':
      return 10;
    case 'swig_circuit':
      return 15;
    default:
      return 5;
  }
}

// Phase 4: Strengthen type guards
function isDatabaseRewardTransaction(record: any): record is any {
  return (
    record &&
    typeof record.id === 'string' &&
    typeof record.user_id === 'string' &&
    typeof record.points === 'number' &&
    ['earn', 'redeem'].includes(record.transaction_type) &&
    typeof record.source === 'string' &&
    typeof record.created_at === 'string'
  );
}

export class CheckInService {
  async performCheckIn(userId: string, context: CheckInContext, options: CheckInOptions = { userId }): Promise<CheckInResult> {
    try {
      console.log('Performing check-in:', { userId, context, options });

      // Create database-compatible transaction record
      const transactionData = createDatabaseTransaction(userId, context, options);
      
      // Phase 3: Fix database insert method - insert single object, not array
      const { data: transactionResult, error: transactionError } = await supabase
        .from('reward_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (transactionError) {
        console.error('Transaction insert error:', transactionError);
        throw new Error(`Failed to record transaction: ${transactionError.message}`);
      }

      console.log('Transaction recorded:', transactionResult);

      // Transform the database result to RewardTransaction interface
      const transformedTransaction = transformDatabaseToRewardTransaction(transactionResult);

      return {
        success: true,
        message: `Successfully checked in at ${context.entityName}! You earned ${transactionData.points} points.`,
        points: transactionData.points,
        streakInfo: {
          current: 1,
          longest: 1,
          milestone: false
        }
      };

    } catch (error: any) {
      console.error('Check-in service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to process check-in. Please try again.'
      };
    }
  }

  async getCheckInHistory(userId: string, limit: number = 10): Promise<RewardTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('transaction_type', 'earn')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching check-in history:', error);
        return [];
      }

      // Phase 4: Apply type guards and transformations
      return (data || [])
        .filter(isDatabaseRewardTransaction)
        .map(transformDatabaseToRewardTransaction);

    } catch (error) {
      console.error('Error in getCheckInHistory:', error);
      return [];
    }
  }

  async canCheckIn(userId: string, context: CheckInContext): Promise<boolean> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - 1);

      const { data, error } = await supabase
        .from('reward_transactions')
        .select('id')
        .eq('user_id', userId)
        .eq('source', context.type)
        .gte('created_at', cutoffTime.toISOString())
        .limit(1);

      if (error) {
        console.error('Error checking check-in eligibility:', error);
        return true;
      }

      return !data || data.length === 0;
    } catch (error) {
      console.error('Error in canCheckIn:', error);
      return true;
    }
  }
}

// Phase 4: Verify data flow - ensure RewardTransaction interface is properly defined
interface RewardTransaction {
  id: string;
  user_id: string;
  userId: string; // Backward compatibility  
  establishment_id?: string;
  points: number;
  pointsAmount: number; // Backward compatibility
  transaction_type: 'earn' | 'redeem';
  type: 'earned' | 'redeemed'; // Component-expected format
  source: string;
  description?: string;
  timestamp: string;
  date: string; // Backward compatibility
  created_at: string;
  version?: number;
  metadata?: Record<string, any>;
}

export const checkInService = new CheckInService();
