/**
 * Shared database utilities for edge functions
 * Provides retry logic, idempotency, and transaction helpers
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
export const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

// Types for idempotency and retry logic
export interface IdempotencyOptions {
  key: string;
  operationType: string;
  requestHash: string;
  traceId: string;
  expirationDays?: number;
}

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

export interface IdempotencyResult {
  isNew: boolean;
  existingData?: any;
  logId: string;
}

/**
 * Generate a unique trace ID for request tracking
 */
export function generateTraceId(): string {
  return crypto.randomUUID();
}

/**
 * Create a hash of request data for idempotency checking
 */
export async function createRequestHash(data: any): Promise<string> {
  const encoder = new TextEncoder();
  const dataString = JSON.stringify(data, Object.keys(data).sort());
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(dataString));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if operation is idempotent and handle deduplication
 */
export async function checkIdempotency(options: IdempotencyOptions): Promise<IdempotencyResult> {
  const { key, operationType, requestHash, traceId, expirationDays = 7 } = options;
  
  console.log(`[DB] Checking idempotency for key: ${key}, trace: ${traceId}`);
  
  try {
    // Check for existing operation
    const { data: existing, error: selectError } = await db
      .from('notification_dedup_log')
      .select('*')
      .eq('idempotency_key', key)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw selectError;
    }

    if (existing) {
      console.log(`[DB] Found existing operation for key: ${key}, status: ${existing.status}`);
      
      // Check if request hash matches to ensure identical operation
      if (existing.request_hash !== requestHash) {
        throw new Error(`Idempotency key conflict: ${key} used for different operation`);
      }

      return {
        isNew: false,
        existingData: existing.response_data,
        logId: existing.id
      };
    }

    // Create new dedup log entry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    const { data: newLog, error: insertError } = await db
      .from('notification_dedup_log')
      .insert({
        idempotency_key: key,
        operation_type: operationType,
        request_hash: requestHash,
        trace_id: traceId,
        status: 'processing',
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log(`[DB] Created new idempotency log: ${newLog.id}, trace: ${traceId}`);
    
    return {
      isNew: true,
      logId: newLog.id
    };
  } catch (error) {
    console.error(`[DB] Idempotency check failed for key: ${key}`, error);
    throw error;
  }
}

/**
 * Complete an idempotent operation with success/failure
 */
export async function completeIdempotentOperation(
  logId: string, 
  success: boolean, 
  data?: any, 
  error?: any
): Promise<void> {
  console.log(`[DB] Completing operation ${logId}, success: ${success}`);
  
  try {
    const updateData: any = {
      status: success ? 'completed' : 'failed',
      completed_at: new Date().toISOString()
    };

    if (success && data) {
      updateData.response_data = data;
    }

    if (!success && error) {
      updateData.error_details = {
        message: error.message || String(error),
        stack: error.stack,
        timestamp: new Date().toISOString()
      };
    }

    const { error: updateError } = await db
      .from('notification_dedup_log')
      .update(updateData)
      .eq('id', logId);

    if (updateError) {
      console.error(`[DB] Failed to complete operation ${logId}:`, updateError);
      throw updateError;
    }

    console.log(`[DB] Successfully completed operation ${logId}`);
  } catch (error) {
    console.error(`[DB] Error completing operation ${logId}:`, error);
    throw error;
  }
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any, retryableErrors: string[] = []): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.code || '';
  
  // Default retryable error patterns
  const defaultRetryablePatterns = [
    'timeout',
    'connection',
    'network',
    'temporary',
    'deadlock',
    'lock_timeout',
    '23503', // Foreign key violation (might be temporary)
    '40001', // Serialization failure
    '40P01', // Deadlock detected
  ];
  
  const allRetryablePatterns = [...defaultRetryablePatterns, ...retryableErrors];
  
  return allRetryablePatterns.some(pattern => 
    errorMessage.includes(pattern.toLowerCase()) || 
    errorCode === pattern
  );
}

/**
 * Execute operation with exponential backoff retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
    retryableErrors = []
  } = options;

  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[DB] Attempting operation (${attempt}/${maxAttempts})`);
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`[DB] Operation failed on attempt ${attempt}:`, error);
      
      // Don't retry on last attempt or non-retryable errors
      if (attempt === maxAttempts || !isRetryableError(error, retryableErrors)) {
        break;
      }
      
      // Calculate delay with exponential backoff and jitter
      const baseDelay = Math.min(baseDelayMs * Math.pow(backoffMultiplier, attempt - 1), maxDelayMs);
      const jitter = Math.random() * 0.1 * baseDelay; // Add up to 10% jitter
      const delay = Math.floor(baseDelay + jitter);
      
      console.log(`[DB] Retrying in ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error(`[DB] Operation failed after ${maxAttempts} attempts`);
  throw lastError;
}

/**
 * Execute idempotent operation with retry logic
 */
export async function executeIdempotentOperation<T>(
  idempotencyOptions: IdempotencyOptions,
  operation: () => Promise<T>,
  retryOptions?: RetryOptions
): Promise<T> {
  const traceId = idempotencyOptions.traceId;
  console.log(`[DB] Starting idempotent operation, trace: ${traceId}`);
  
  // Check idempotency
  const idempotencyResult = await checkIdempotency(idempotencyOptions);
  
  if (!idempotencyResult.isNew) {
    console.log(`[DB] Returning cached result for trace: ${traceId}`);
    return idempotencyResult.existingData as T;
  }
  
  // Execute operation with retry logic
  try {
    const result = await withRetry(operation, retryOptions);
    
    // Mark operation as completed
    await completeIdempotentOperation(idempotencyResult.logId, true, result);
    
    console.log(`[DB] Successfully completed idempotent operation, trace: ${traceId}`);
    return result;
  } catch (error) {
    // Mark operation as failed
    await completeIdempotentOperation(idempotencyResult.logId, false, null, error);
    
    console.error(`[DB] Failed idempotent operation, trace: ${traceId}:`, error);
    throw error;
  }
}

/**
 * Clean up expired deduplication logs (utility function)
 */
export async function cleanupExpiredLogs(): Promise<number> {
  console.log('[DB] Cleaning up expired deduplication logs');
  
  try {
    const { error } = await db.rpc('cleanup_notification_dedup_log');
    
    if (error) {
      console.error('[DB] Error cleaning up expired logs:', error);
      throw error;
    }
    
    console.log('[DB] Successfully cleaned up expired logs');
    return 0; // RPC doesn't return count, but operation succeeded
  } catch (error) {
    console.error('[DB] Failed to clean up expired logs:', error);
    throw error;
  }
}