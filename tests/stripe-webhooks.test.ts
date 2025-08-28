// Stripe Webhook Security Tests
// Tests for signature verification, idempotency, and defensive checks

import { assertEquals, assertThrows } from 'https://deno.land/std@0.208.0/assert/mod.ts';

// Mock Stripe webhook signature generation
function generateTestSignature(payload: string, secret: string, timestamp?: number): string {
  const ts = timestamp || Math.floor(Date.now() / 1000);
  // Simple mock signature - in real tests you'd use crypto functions
  const signature = btoa(`${ts}.${payload}.${secret}`).slice(0, 32);
  return `t=${ts},v1=${signature}`;
}

// Mock tampered signature
function generateTamperedSignature(payload: string, secret: string): string {
  const ts = Math.floor(Date.now() / 1000);
  const tamperedPayload = payload + 'TAMPERED';
  const signature = btoa(`${ts}.${tamperedPayload}.${secret}`).slice(0, 32);
  return `t=${ts},v1=${signature}`;
}

// Mock webhook event payload
function createTestEvent(type: string = 'payment_intent.succeeded', eventId?: string): any {
  return {
    id: eventId || 'evt_test_' + Math.random().toString(36).substr(2, 9),
    type,
    data: {
      object: {
        id: 'pi_test_' + Math.random().toString(36).substr(2, 9),
        amount: 1000,
        currency: 'usd',
        status: 'succeeded'
      }
    },
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    api_version: '2023-10-16'
  };
}

// Test signature verification success
Deno.test('Webhook signature verification - happy path', async () => {
  const secret = 'whsec_test_secret';
  const event = createTestEvent();
  const payload = JSON.stringify(event);
  const validSignature = generateTestSignature(payload, secret);
  
  // Mock the verification function behavior
  const verifySignature = (body: string, signature: string, webhookSecret: string) => {
    // In real implementation, this would use Stripe's signature verification
    const elements = signature.split(',');
    const timestamp = elements.find(elem => elem.startsWith('t='))?.split('=')[1];
    const sig = elements.find(elem => elem.startsWith('v1='))?.split('=')[1];
    
    if (!timestamp || !sig) {
      throw new Error('Invalid signature format');
    }
    
    // Mock verification - check if signature contains expected components
    const decoded = atob(sig);
    const expectedComponents = [timestamp, body.slice(0, 10), webhookSecret];
    const hasValidComponents = expectedComponents.every(comp => decoded.includes(comp));
    
    if (!hasValidComponents) {
      throw new Error('Invalid signature');
    }
    
    return true;
  };
  
  // Should not throw for valid signature
  const result = verifySignature(payload, validSignature, secret);
  assertEquals(result, true);
});

// Test signature verification failure with tampered data
Deno.test('Webhook signature verification - tampered payload', async () => {
  const secret = 'whsec_test_secret';
  const event = createTestEvent();
  const payload = JSON.stringify(event);
  const tamperedSignature = generateTamperedSignature(payload, secret);
  
  const verifySignature = (body: string, signature: string, webhookSecret: string) => {
    const elements = signature.split(',');
    const timestamp = elements.find(elem => elem.startsWith('t='))?.split('=')[1];
    const sig = elements.find(elem => elem.startsWith('v1='))?.split('=')[1];
    
    if (!timestamp || !sig) {
      throw new Error('Invalid signature format');
    }
    
    // Mock verification that detects tampering
    const decoded = atob(sig);
    const expectedComponents = [timestamp, body.slice(0, 10), webhookSecret];
    const hasValidComponents = expectedComponents.every(comp => decoded.includes(comp));
    
    if (!hasValidComponents) {
      throw new Error('Invalid signature');
    }
    
    return true;
  };
  
  // Should throw for tampered signature
  assertThrows(
    () => verifySignature(payload, tamperedSignature, secret),
    Error,
    'Invalid signature'
  );
});

// Test missing signature header
Deno.test('Webhook signature verification - missing header', async () => {
  const verifySignature = (body: string, signature: string | null, webhookSecret: string) => {
    if (!signature) {
      throw new Error('Missing Stripe-Signature header');
    }
    return true;
  };
  
  assertThrows(
    () => verifySignature('{}', null, 'secret'),
    Error,
    'Missing Stripe-Signature header'
  );
});

// Test timestamp validation (prevent replay attacks)
Deno.test('Webhook signature verification - old timestamp', async () => {
  const secret = 'whsec_test_secret';
  const event = createTestEvent();
  const payload = JSON.stringify(event);
  const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
  const oldSignature = generateTestSignature(payload, secret, oldTimestamp);
  
  const verifySignature = (body: string, signature: string, webhookSecret: string) => {
    const elements = signature.split(',');
    const timestamp = elements.find(elem => elem.startsWith('t='))?.split('=')[1];
    
    if (!timestamp) {
      throw new Error('Missing timestamp in signature');
    }
    
    const webhookTimestamp = parseInt(timestamp);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tolerance = 5 * 60; // 5 minutes
    
    if (Math.abs(currentTimestamp - webhookTimestamp) > tolerance) {
      throw new Error('Webhook timestamp too old or too far in future');
    }
    
    return true;
  };
  
  assertThrows(
    () => verifySignature(payload, oldSignature, secret),
    Error,
    'Webhook timestamp too old'
  );
});

// Test idempotency - duplicate event prevention
Deno.test('Webhook idempotency - duplicate event detection', async () => {
  const eventId = 'evt_test_duplicate';
  const processedEvents = new Set<string>();
  
  const checkIdempotency = (eventId: string): boolean => {
    if (processedEvents.has(eventId)) {
      return false; // Already processed
    }
    processedEvents.add(eventId);
    return true; // New event
  };
  
  // First processing should succeed
  const firstResult = checkIdempotency(eventId);
  assertEquals(firstResult, true);
  
  // Second processing should be rejected
  const secondResult = checkIdempotency(eventId);
  assertEquals(secondResult, false);
});

// Test webhook data validation
Deno.test('Webhook data validation - missing required fields', async () => {
  const validateWebhookData = (event: any): { valid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];
    
    if (!event.id) missingFields.push('event.id');
    if (!event.type) missingFields.push('event.type');
    if (!event.data?.object) missingFields.push('event.data.object');
    
    // Type-specific validations
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      if (!pi.id) missingFields.push('payment_intent.id');
      if (typeof pi.amount !== 'number') missingFields.push('payment_intent.amount');
    }
    
    return { valid: missingFields.length === 0, missingFields };
  };
  
  // Valid event
  const validEvent = createTestEvent();
  const validResult = validateWebhookData(validEvent);
  assertEquals(validResult.valid, true);
  assertEquals(validResult.missingFields.length, 0);
  
  // Invalid event - missing payment intent ID
  const invalidEvent = createTestEvent();
  delete invalidEvent.data.object.id;
  const invalidResult = validateWebhookData(invalidEvent);
  assertEquals(invalidResult.valid, false);
  assertEquals(invalidResult.missingFields.includes('payment_intent.id'), true);
});

// Test rate limiting
Deno.test('Webhook rate limiting', async () => {
  const rateLimiter = new Map<string, number[]>();
  
  const checkRateLimit = (eventType: string, maxPerMinute: number = 5): boolean => {
    const key = `webhook_${eventType}`;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    
    const timestamps = rateLimiter.get(key) || [];
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
    
    if (validTimestamps.length >= maxPerMinute) {
      return false; // Rate limit exceeded
    }
    
    validTimestamps.push(now);
    rateLimiter.set(key, validTimestamps);
    return true;
  };
  
  // First 5 requests should succeed
  for (let i = 0; i < 5; i++) {
    const result = checkRateLimit('payment_intent.succeeded');
    assertEquals(result, true);
  }
  
  // 6th request should be rate limited
  const rateLimitedResult = checkRateLimit('payment_intent.succeeded');
  assertEquals(rateLimitedResult, false);
});

// Test error handling and logging
Deno.test('Webhook error handling - structured logging', async () => {
  const logs: any[] = [];
  
  const logWebhookEvent = (level: string, event: string, data: any = {}) => {
    logs.push({
      timestamp: new Date().toISOString(),
      level,
      event,
      service: 'stripe-webhooks',
      ...data
    });
  };
  
  const processWebhook = (event: any) => {
    try {
      logWebhookEvent('info', 'webhook_processing_started', { eventId: event.id, eventType: event.type });
      
      if (!event.data?.object?.id) {
        throw new Error('Missing payment intent ID');
      }
      
      logWebhookEvent('info', 'webhook_processed_successfully', { eventId: event.id });
      return { success: true };
    } catch (error) {
      logWebhookEvent('error', 'webhook_processing_failed', { 
        eventId: event.id, 
        error: error.message 
      });
      return { success: false, error: error.message };
    }
  };
  
  // Process invalid event
  const invalidEvent = { id: 'evt_test', type: 'test', data: {} };
  const result = processWebhook(invalidEvent);
  
  assertEquals(result.success, false);
  assertEquals(logs.length, 2);
  assertEquals(logs[0].event, 'webhook_processing_started');
  assertEquals(logs[1].event, 'webhook_processing_failed');
  assertEquals(logs[1].error, 'Missing payment intent ID');
});

// Test signature format validation
Deno.test('Webhook signature format validation', async () => {
  const validateSignatureFormat = (signature: string): boolean => {
    if (!signature.includes('t=') || !signature.includes('v1=')) {
      return false;
    }
    
    const elements = signature.split(',');
    const timestamp = elements.find(elem => elem.startsWith('t='))?.split('=')[1];
    const sig = elements.find(elem => elem.startsWith('v1='))?.split('=')[1];
    
    return !!(timestamp && sig && /^\d+$/.test(timestamp));
  };
  
  // Valid format
  assertEquals(validateSignatureFormat('t=1234567890,v1=signature'), true);
  
  // Invalid formats
  assertEquals(validateSignatureFormat('invalid'), false);
  assertEquals(validateSignatureFormat('t=abc,v1=sig'), false);
  assertEquals(validateSignatureFormat('v1=sig'), false);
  assertEquals(validateSignatureFormat('t=123'), false);
});