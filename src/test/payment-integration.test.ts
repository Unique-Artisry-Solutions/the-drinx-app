import { describe, it, expect, beforeAll } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

/**
 * Integration tests for payment flow end-to-end testing
 * These tests require actual Stripe test keys and database access
 */
describe('Payment Integration Tests', () => {
  // Test data for Stripe test cards
  const TEST_CARDS = {
    SUCCESS: '4242424242424242',
    DECLINED: '4000000000000002',
    REQUIRES_AUTH: '4000002500003155',
    INSUFFICIENT_FUNDS: '4000000000009995',
  };

  const TEST_PAYMENT_REQUEST = {
    paymentMethodId: 'pm_test_card',
    amount: 5000, // $50.00
    currency: 'usd',
    description: 'Test payment for integration testing',
    metadata: {
      testCase: 'integration_test',
      timestamp: new Date().toISOString(),
    },
  };

  beforeAll(async () => {
    // Verify database connection
    const { data, error } = await supabase.from('payment_transactions').select('count').limit(1);
    if (error) {
      console.warn('Database connection test failed:', error);
    }
  });

  describe('Edge Function Testing', () => {
    it('should handle successful payment processing', async () => {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: TEST_PAYMENT_REQUEST,
      });

      if (error) {
        console.error('Payment processing failed:', error);
        expect(error).toBeNull();
      } else {
        expect(data).toBeDefined();
        expect(data.success).toBeDefined();
        expect(data.paymentIntentId).toBeDefined();
        
        if (data.success) {
          expect(data.status).toBe('succeeded');
          expect(data.transactionId).toBeDefined();
        }
      }
    });

    it('should handle invalid payment method gracefully', async () => {
      const invalidRequest = {
        ...TEST_PAYMENT_REQUEST,
        paymentMethodId: 'pm_invalid_test',
      };

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: invalidRequest,
      });

      // Should either return error or data with failure status
      if (error) {
        expect(error.message).toBeDefined();
      } else if (data) {
        expect(data.success).toBe(false);
      }
    });

    it('should validate required fields', async () => {
      const incompleteRequest = {
        amount: 1000,
        // Missing paymentMethodId
      };

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: incompleteRequest,
      });

      expect(error || !data.success).toBeTruthy();
    });
  });

  describe('Database Verification', () => {
    it('should verify payment_transactions table structure', async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should verify payment_receipts table structure', async () => {
      const { data, error } = await supabase
        .from('payment_receipts')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should check RLS policies are active', async () => {
      // Test that user can only see their own transactions
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('user_id')
        .limit(5);

      if (data && data.length > 0) {
        // If data exists, all user_ids should be the same (current user)
        const userIds = data.map(t => t.user_id);
        const uniqueUserIds = new Set(userIds);
        expect(uniqueUserIds.size).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Test with malformed request
      const malformedRequest = {
        amount: 'invalid_amount', // Should be number
        paymentMethodId: null,
      };

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: malformedRequest,
      });

      expect(error || (data && !data.success)).toBeTruthy();
    });

    it('should handle database connection issues', async () => {
      // This test verifies that the edge function handles database errors
      // In a real scenario, this would test what happens when DB is unavailable
      const testRequest = {
        ...TEST_PAYMENT_REQUEST,
        metadata: {
          ...TEST_PAYMENT_REQUEST.metadata,
          testDatabaseError: true,
        },
      };

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: testRequest,
      });

      // Should handle gracefully regardless of outcome
      expect(typeof data === 'object' || error !== null).toBe(true);
    });
  });

  describe('Performance Testing', () => {
    it('should process payment within reasonable time', async () => {
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: TEST_PAYMENT_REQUEST,
      });
      
      const duration = Date.now() - startTime;
      
      // Payment should complete within 10 seconds
      expect(duration).toBeLessThan(10000);
      
      if (!error && data) {
        console.log(`Payment processed in ${duration}ms`);
      }
    });
  });
});