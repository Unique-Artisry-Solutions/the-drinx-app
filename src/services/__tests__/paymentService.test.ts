import { vi, describe, it, expect, beforeEach } from 'vitest';
import { processPayment, getUserTransactions, getTransactionById } from '../paymentService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    functions: {
      invoke: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

describe('PaymentService', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  });

  describe('processPayment', () => {
    it('processes payment successfully', async () => {
      const mockResponse = {
        success: true,
        status: 'succeeded',
        paymentIntentId: 'pi_test_123',
        transactionId: 'txn_123',
      };

      (supabase.functions.invoke as any).mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const request = {
        paymentMethodId: 'pm_test_123',
        amount: 5000,
        currency: 'usd',
        description: 'Test payment',
      };

      const result = await processPayment(request);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('process-payment', {
        body: {
          ...request,
          metadata: { userId: mockUser.id },
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it('throws error when user is not logged in', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const request = {
        paymentMethodId: 'pm_test_123',
        amount: 5000,
      };

      await expect(processPayment(request)).rejects.toThrow(
        'User must be logged in to process payments'
      );
    });

    it('handles edge function error', async () => {
      (supabase.functions.invoke as any).mockResolvedValue({
        data: null,
        error: { message: 'Payment failed' },
      });

      const request = {
        paymentMethodId: 'pm_test_123',
        amount: 5000,
      };

      await expect(processPayment(request)).rejects.toThrow('Payment failed');
    });
  });

  describe('getUserTransactions', () => {
    it('fetches user transactions successfully', async () => {
      const mockTransactions = [
        { id: 'txn_1', amount: 5000, status: 'completed' },
        { id: 'txn_2', amount: 3000, status: 'pending' },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockTransactions,
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const result = await getUserTransactions();

      expect(supabase.from).toHaveBeenCalledWith('payment_transactions');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('getTransactionById', () => {
    it('fetches transaction by ID successfully', async () => {
      const mockTransaction = { id: 'txn_1', amount: 5000, status: 'completed' };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockTransaction,
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const result = await getTransactionById('txn_1');

      expect(supabase.from).toHaveBeenCalledWith('payment_transactions');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'txn_1');
      expect(result).toEqual(mockTransaction);
    });
  });
});