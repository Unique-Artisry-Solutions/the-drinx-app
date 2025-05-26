
import { supabase } from '@/integrations/supabase/client';
import { enhancedPaymentService } from './enhancedPaymentService';

export interface PaymentRetryRecord {
  id: string;
  transaction_id: string;
  attempt_number: number;
  failure_reason: string;
  retry_scheduled_for: string;
  max_retries: number;
  metadata: Record<string, any>;
  created_at: string;
}

class PaymentRetryService {
  async scheduleRetry(transactionId: string, failureReason: string, attemptNumber: number = 1): Promise<void> {
    const maxRetries = 3;
    const retryDelayMinutes = attemptNumber * 30; // 30, 60, 90 minutes
    
    if (attemptNumber > maxRetries) {
      console.log(`Max retries exceeded for transaction ${transactionId}`);
      await this.markTransactionAsFailed(transactionId);
      return;
    }

    const retryScheduledFor = new Date(Date.now() + retryDelayMinutes * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('payment_retries')
      .insert({
        transaction_id: transactionId,
        attempt_number: attemptNumber,
        failure_reason: failureReason,
        retry_scheduled_for: retryScheduledFor,
        max_retries: maxRetries,
        metadata: {
          original_failure: failureReason,
          retry_delay_minutes: retryDelayMinutes
        }
      });

    if (error) {
      console.error('Error scheduling payment retry:', error);
      throw error;
    }
  }

  async processPendingRetries(): Promise<void> {
    const { data: pendingRetries, error } = await supabase
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

    if (error) {
      console.error('Error fetching pending retries:', error);
      return;
    }

    for (const retry of pendingRetries || []) {
      await this.executeRetry(retry);
    }
  }

  private async executeRetry(retry: any): Promise<void> {
    try {
      // Mark retry as processing
      await supabase
        .from('payment_retries')
        .update({ status: 'processing' })
        .eq('id', retry.id);

      const transaction = retry.payment_transactions;
      if (!transaction) {
        throw new Error('Associated transaction not found');
      }

      // Attempt the payment retry
      const result = await enhancedPaymentService.processMultiCurrencyPayment({
        paymentMethodId: transaction.payment_method_id,
        amount: transaction.amount,
        currency: transaction.currency,
        metadata: transaction.metadata
      });

      if (result.success) {
        // Retry successful
        await supabase
          .from('payment_retries')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', retry.id);

        console.log(`Payment retry successful for transaction ${retry.transaction_id}`);
      } else {
        throw new Error(result.status || 'Payment retry failed');
      }
    } catch (error) {
      console.error(`Payment retry failed for transaction ${retry.transaction_id}:`, error);
      
      // Schedule next retry if not exceeded max attempts
      if (retry.attempt_number < retry.max_retries) {
        await this.scheduleRetry(
          retry.transaction_id, 
          error.message, 
          retry.attempt_number + 1
        );
        
        // Mark current retry as failed
        await supabase
          .from('payment_retries')
          .update({ 
            status: 'failed',
            failure_reason: error.message
          })
          .eq('id', retry.id);
      } else {
        // Max retries exceeded
        await supabase
          .from('payment_retries')
          .update({ 
            status: 'max_retries_exceeded',
            failure_reason: error.message
          })
          .eq('id', retry.id);

        await this.markTransactionAsFailed(retry.transaction_id);
      }
    }
  }

  private async markTransactionAsFailed(transactionId: string): Promise<void> {
    await supabase
      .from('payment_transactions')
      .update({ 
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId);

    // Send notification to user about failed payment
    // This would integrate with your notification system
    console.log(`Transaction ${transactionId} marked as permanently failed`);
  }

  async getRetryHistory(transactionId: string): Promise<PaymentRetryRecord[]> {
    const { data, error } = await supabase
      .from('payment_retries')
      .select('*')
      .eq('transaction_id', transactionId)
      .order('attempt_number', { ascending: true });

    if (error) {
      console.error('Error fetching retry history:', error);
      throw error;
    }

    return data || [];
  }
}

export const paymentRetryService = new PaymentRetryService();
