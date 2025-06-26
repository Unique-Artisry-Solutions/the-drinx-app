
import type { Json } from '@/integrations/supabase/types';
import type { RewardTransaction } from '@/types/rewards/api';
import { safeJsonToRecord, safeJsonToString } from '@/utils/typeGuards';

/**
 * Type-safe transformer for database reward transaction rows
 */
export function transformDatabaseTransactionRow(row: any): RewardTransaction {
  // Safely extract metadata
  const metadata = safeJsonToRecord(row.metadata);
  
  // Map database transaction_type to application type
  const transactionType = mapTransactionType(row.transaction_type);
  
  return {
    id: row.id,
    user_id: row.user_id,
    userId: row.user_id, // Backward compatibility
    establishment_id: row.establishment_id,
    points: row.points,
    pointsAmount: row.points, // Backward compatibility
    transaction_type: transactionType,
    type: transactionType === 'earn' ? 'earned' : 'redeemed', // Component-expected format
    source: row.source,
    description: row.description || row.source,
    timestamp: row.created_at,
    date: row.created_at, // Backward compatibility
    created_at: row.created_at,
    version: row.version || 1, // Default version if not present
    metadata
  };
}

/**
 * Safely maps database transaction_type to application literal type
 */
function mapTransactionType(dbType: any): 'earn' | 'redeem' {
  if (typeof dbType === 'string') {
    switch (dbType.toLowerCase()) {
      case 'earn':
      case 'earned':
        return 'earn';
      case 'redeem':
      case 'redeemed':
        return 'redeem';
      default:
        console.warn(`Unknown transaction type: ${dbType}, defaulting to 'earn'`);
        return 'earn';
    }
  }
  console.warn(`Invalid transaction type format: ${dbType}, defaulting to 'earn'`);
  return 'earn';
}

/**
 * Safely extracts entity name from metadata
 */
export function extractEntityName(metadata: Json): string {
  const metadataObj = safeJsonToRecord(metadata);
  return safeJsonToString(metadataObj.entity_name) || 'Unknown';
}

/**
 * Creates a safe reward transaction for database insertion
 */
export function createSafeTransactionInsert(data: {
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
