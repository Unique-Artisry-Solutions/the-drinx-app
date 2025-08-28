/**
 * Test utilities for notification idempotency and retry logic
 * This can be used to verify the notification system works correctly
 */

import { db, executeIdempotentOperation, generateTraceId, createRequestHash } from './db.ts';

export async function testNotificationIdempotency() {
  const traceId = generateTraceId();
  console.log(`[Test] Testing notification idempotency, trace: ${traceId}`);
  
  const testData = {
    recipientId: 'test-user-123',
    title: 'Test Notification',
    content: 'Testing idempotency system',
    priority: 'medium'
  };
  
  const requestHash = await createRequestHash(testData);
  const idempotencyKey = `test_notification_${traceId}`;
  
  // First execution - should create new notification
  console.log('[Test] First execution attempt...');
  const result1 = await executeIdempotentOperation(
    {
      key: idempotencyKey,
      operationType: 'test_notification',
      requestHash,
      traceId,
      expirationDays: 1
    },
    async () => {
      console.log('[Test] Creating test notification...');
      return {
        id: crypto.randomUUID(),
        message: 'Test notification created',
        timestamp: new Date().toISOString(),
        trace_id: traceId
      };
    }
  );
  
  console.log('[Test] First result:', result1);
  
  // Second execution with same key - should return cached result
  console.log('[Test] Second execution attempt (should be cached)...');
  const result2 = await executeIdempotentOperation(
    {
      key: idempotencyKey,
      operationType: 'test_notification',
      requestHash,
      traceId: generateTraceId(), // Different trace ID but same operation
      expirationDays: 1
    },
    async () => {
      console.log('[Test] This should not execute (cached result should be returned)');
      return {
        id: crypto.randomUUID(),
        message: 'This should not be created',
        timestamp: new Date().toISOString()
      };
    }
  );
  
  console.log('[Test] Second result (should match first):', result2);
  
  // Verify results match
  const match = JSON.stringify(result1) === JSON.stringify(result2);
  console.log(`[Test] Idempotency test ${match ? 'PASSED' : 'FAILED'}`);
  
  return {
    success: match,
    result1,
    result2,
    traceId
  };
}

export async function testRetryLogic() {
  const traceId = generateTraceId();
  console.log(`[Test] Testing retry logic, trace: ${traceId}`);
  
  let attemptCount = 0;
  
  try {
    const result = await executeIdempotentOperation(
      {
        key: `test_retry_${traceId}`,
        operationType: 'test_retry',
        requestHash: await createRequestHash({ test: 'retry' }),
        traceId,
        expirationDays: 1
      },
      async () => {
        attemptCount++;
        console.log(`[Test] Retry attempt ${attemptCount}`);
        
        // Simulate transient error on first two attempts
        if (attemptCount <= 2) {
          throw new Error('connection timeout');
        }
        
        return {
          success: true,
          attempts: attemptCount,
          message: 'Retry logic worked correctly',
          trace_id: traceId
        };
      },
      {
        maxAttempts: 3,
        baseDelayMs: 100, // Faster for testing
        retryableErrors: ['connection', 'timeout']
      }
    );
    
    console.log(`[Test] Retry test PASSED after ${attemptCount} attempts:`, result);
    return result;
  } catch (error) {
    console.log(`[Test] Retry test FAILED after ${attemptCount} attempts:`, error);
    throw error;
  }
}