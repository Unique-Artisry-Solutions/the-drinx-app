
import { supabase } from '@/integrations/supabase/client';
import { 
  DbPaymentTransaction,
  DbPaymentRetry,
  DbPaymentFailureLog,
  DbPaymentReceipt,
  DbPaymentRefund,
  DbSubscriptionPayment
} from '@/types/PaymentDatabaseTypes';
import {
  mapPaymentTransactionFromDb,
  mapPaymentRefundFromDb,
  mapPaymentReceiptFromDb,
  preparePaymentTransactionForDb,
  preparePaymentRetryForDb,
  preparePaymentFailureLogForDb,
  prepareSubscriptionPaymentForDb
} from '@/utils/paymentDataMappers';

// Type-safe payment service with proper database access
class TypedPaymentService {
  // Payment Transactions
  async createPaymentTransaction(
    userId: string,
    amount: number,
    currency: string,
    paymentMethodId: string,
    metadata: Record<string, any> = {}
  ) {
    const insertData = preparePaymentTransactionForDb(
      userId,
      amount,
      currency,
      paymentMethodId,
      metadata
    );

    const { data, error } = await supabase
      .from('payment_transactions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return mapPaymentTransactionFromDb(data as DbPaymentTransaction);
  }

  async updatePaymentTransactionStatus(
    transactionId: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    providerTransactionId?: string
  ) {
    const updateData: Partial<DbPaymentTransaction> = {
      status,
      ...(providerTransactionId && { provider_transaction_id: providerTransactionId })
    };

    const { data, error } = await supabase
      .from('payment_transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;
    return mapPaymentTransactionFromDb(data as DbPaymentTransaction);
  }

  async getPaymentTransaction(transactionId: string) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) throw error;
    return mapPaymentTransactionFromDb(data as DbPaymentTransaction);
  }

  // Payment Retries
  async createPaymentRetry(
    transactionId: string,
    failureReason: string,
    attemptNumber: number = 1,
    retryDelayMinutes: number = 30
  ) {
    const retryScheduledFor = new Date(Date.now() + retryDelayMinutes * 60 * 1000).toISOString();
    const insertData = preparePaymentRetryForDb(
      transactionId,
      failureReason,
      attemptNumber,
      retryScheduledFor
    );

    const { data, error } = await supabase
      .from('payment_retries')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data as DbPaymentRetry;
  }

  async getPendingRetries() {
    const { data, error } = await supabase
      .from('payment_retries')
      .select(`
        *,
        payment_transactions (
          payment_method_id,
          amount,
          currency,
          metadata
        )
      `)
      .lte('retry_scheduled_for', new Date().toISOString())
      .eq('status', 'pending')
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  async updateRetryStatus(
    retryId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'max_retries_exceeded',
    completedAt?: string
  ) {
    const updateData: Partial<DbPaymentRetry> = {
      status,
      ...(completedAt && { completed_at: completedAt })
    };

    const { data, error } = await supabase
      .from('payment_retries')
      .update(updateData)
      .eq('id', retryId)
      .select()
      .single();

    if (error) throw error;
    return data as DbPaymentRetry;
  }

  // Payment Failure Logs
  async logPaymentFailure(
    userId: string | undefined,
    paymentMethodId: string | undefined,
    amount: number | undefined,
    currency: string,
    errorMessage: string | undefined,
    metadata: Record<string, any> = {}
  ) {
    const insertData = preparePaymentFailureLogForDb(
      userId,
      paymentMethodId,
      amount,
      currency,
      errorMessage,
      metadata
    );

    const { data, error } = await supabase
      .from('payment_failure_logs')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data as DbPaymentFailureLog;
  }

  // Payment Receipts
  async createPaymentReceipt(
    transactionId: string,
    receiptNumber: string,
    receiptData: Record<string, any>
  ) {
    const { data, error } = await supabase
      .from('payment_receipts')
      .insert({
        transaction_id: transactionId,
        receipt_number: receiptNumber,
        receipt_data: receiptData
      })
      .select()
      .single();

    if (error) throw error;
    return mapPaymentReceiptFromDb(data as DbPaymentReceipt);
  }

  // Subscription Payments
  async createSubscriptionPayment(
    subscriptionId: string,
    stripeSubscriptionId: string,
    userId: string,
    metadata: Record<string, any> = {}
  ) {
    const insertData = prepareSubscriptionPaymentForDb(
      subscriptionId,
      stripeSubscriptionId,
      userId,
      'active',
      metadata
    );

    const { data, error } = await supabase
      .from('subscription_payments')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data as DbSubscriptionPayment;
  }

  async updateSubscriptionPayment(
    subscriptionId: string,
    updates: Partial<DbSubscriptionPayment>
  ) {
    const { data, error } = await supabase
      .from('subscription_payments')
      .update(updates)
      .eq('stripe_subscription_id', subscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data as DbSubscriptionPayment;
  }
}

export const typedPaymentService = new TypedPaymentService();
