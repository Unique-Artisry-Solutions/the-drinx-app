
import { supabase } from '@/integrations/supabase/client';
import { typedPaymentService } from './typedPaymentService';
import { enhancedPaymentService } from './enhancedPaymentService';
import { mapPaymentRetryFromDb } from '@/utils/paymentDataMappers';

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

    await typedPaymentService.createPaymentRetry(
      transactionId,
      failureReason,
      attemptNumber,
      retryDelayMinutes
    );
  }

  async processPendingRetries(): Promise<void> {
    const pendingRetries = await typedPaymentService.getPendingRetries();

    for (const retry of pendingRetries || []) {
      await this.executeRetry(retry);
    }
  }

  private async executeRetry(retry: any): Promise<void> {
    try {
      // Mark retry as processing
      await typedPaymentService.updateRetryStatus(retry.id, 'processing');

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
        await typedPaymentService.updateRetryStatus(
          retry.id, 
          'completed', 
          new Date().toISOString()
        );

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
        await typedPaymentService.updateRetryStatus(retry.id, 'failed');
      } else {
        // Max retries exceeded
        await typedPaymentService.updateRetryStatus(retry.id, 'max_retries_exceeded');
        await this.markTransactionAsFailed(retry.transaction_id);
      }
    }
  }

  private async markTransactionAsFailed(transactionId: string): Promise<void> {
    await typedPaymentService.updatePaymentTransactionStatus(transactionId, 'failed');
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

    return (data || []).map(mapPaymentRetryFromDb);
  }
}

export const paymentRetryService = new PaymentRetryService();
