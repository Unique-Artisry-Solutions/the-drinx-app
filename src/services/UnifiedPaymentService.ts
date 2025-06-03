
// Unified Payment Service - consolidates all payment functionality
import { supabase } from '@/integrations/supabase/client';
import { serviceConfig } from './ServiceConfig';
import { ServiceUtils, type ServiceResponse } from './ServiceUtils';

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method_id: string;
  user_id?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface PaymentRefund {
  id: string;
  transaction_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  reason?: string;
  refunded_by?: string;
  created_at: string;
}

export interface ProcessPaymentRequest {
  paymentMethodId: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface ProcessPaymentResponse {
  success: boolean;
  transaction_id?: string;
  status?: string;
  error?: string;
}

export class UnifiedPaymentService {
  private static initialized = false;

  static async initialize(): Promise<void> {
    if (this.initialized) return;
    
    const config = serviceConfig.getConfig();
    if (config.enableLogging) {
      console.log('UnifiedPaymentService: Initializing...');
    }
    
    this.initialized = true;
  }

  // Payment processing
  static async processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to process payments');
    }
    
    // Add the user ID to the metadata
    const metadata = {
      ...request.metadata,
      userId: user.id
    };
    
    // Call the process-payment edge function
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: {
        ...request,
        metadata
      }
    });
    
    if (error) {
      console.error('Payment processing error:', error);
      throw new Error(error.message || 'Payment processing failed');
    }
    
    return data as ProcessPaymentResponse;
  }

  // Multi-currency payment processing
  static async processMultiCurrencyPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    try {
      // Validate currency
      const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD'];
      if (!supportedCurrencies.includes(request.currency)) {
        return {
          success: false,
          error: `Unsupported currency: ${request.currency}`
        };
      }

      // Process the payment
      const result = await this.processPayment(request);
      return result;
    } catch (error) {
      console.error('Multi-currency payment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  // Refund processing
  static async processRefund(transactionId: string, amount: number, reason?: string): Promise<ProcessPaymentResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to process refunds');
    }
    
    const { data, error } = await supabase.functions.invoke('process-refund', {
      body: {
        transactionId,
        amount,
        reason,
        refundedBy: user.id
      }
    });
    
    if (error) {
      console.error('Refund processing error:', error);
      throw new Error(error.message || 'Refund processing failed');
    }
    
    return data as ProcessPaymentResponse;
  }

  // Transaction management
  static async getUserTransactions(): Promise<PaymentTransaction[]> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching transactions:', error);
      throw new Error(error.message);
    }
    
    return data as PaymentTransaction[];
  }

  static async getTransactionById(transactionId: string): Promise<PaymentTransaction> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
      
    if (error) {
      console.error('Error fetching transaction:', error);
      throw new Error(error.message);
    }
    
    return data as PaymentTransaction;
  }

  static async getTransactionRefunds(transactionId: string): Promise<PaymentRefund[]> {
    const { data, error } = await supabase
      .from('payment_refunds')
      .select('*')
      .eq('transaction_id', transactionId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching refunds:', error);
      throw new Error(error.message);
    }
    
    return data as PaymentRefund[];
  }

  // Retry functionality
  static async schedulePaymentRetry(transactionId: string, failureReason: string, attemptNumber: number = 1): Promise<void> {
    const maxRetries = 3;
    const retryDelayMinutes = attemptNumber * 30; // 30, 60, 90 minutes
    
    if (attemptNumber > maxRetries) {
      console.log(`Max retries exceeded for transaction ${transactionId}`);
      await this.markTransactionAsFailed(transactionId);
      return;
    }

    // Create retry record (this would typically use a proper service)
    console.log(`Scheduling retry ${attemptNumber} for transaction ${transactionId} in ${retryDelayMinutes} minutes`);
  }

  private static async markTransactionAsFailed(transactionId: string): Promise<void> {
    const { error } = await supabase
      .from('payment_transactions')
      .update({ status: 'failed' })
      .eq('id', transactionId);

    if (error) {
      console.error('Error marking transaction as failed:', error);
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      // Test basic database connectivity
      const { error } = await supabase
        .from('payment_transactions')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('UnifiedPaymentService health check failed:', error);
      return false;
    }
  }
}
