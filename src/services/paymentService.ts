
import { supabase } from '@/integrations/supabase/client';
import { 
  PaymentTransaction, 
  PaymentRefund, 
  PaymentReceipt,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  ProcessRefundRequest,
  ProcessRefundResponse
} from '@/types/PaymentTypes';
import { paymentValidator, categorizeError } from '@/utils/paymentValidation';
import { PaymentError, PaymentErrorType } from '@/types/PaymentErrors';

export async function processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
  try {
    // Validate payment request
    const validationResult = paymentValidator.validatePaymentRequest({
      paymentMethodId: request.paymentMethodId,
      amount: request.amount,
      currency: request.currency || 'usd',
      description: request.description
    });

    if (!validationResult.isValid) {
      const validationError = validationResult.errors[0];
      console.error('Payment validation failed:', validationError);
      throw validationError;
    }

    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const authError: PaymentError = {
        type: PaymentErrorType.AUTHENTICATION,
        code: 'unauthorized',
        message: 'User must be logged in to process payments',
        retryable: false,
        recoveryAction: 'login_required' as any
      };
      throw authError;
    }
    
    // Add the user ID to the metadata
    const metadata = {
      ...request.metadata,
      userId: user.id,
      validationPassed: true,
      timestamp: new Date().toISOString()
    };
    
    // Call the process-payment edge function with enhanced error context
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: {
        ...request,
        metadata
      }
    });
    
    if (error) {
      console.error('Payment processing error:', error);
      const categorizedError = categorizeError(error);
      categorizedError.context = {
        ...categorizedError.context,
        paymentMethodId: request.paymentMethodId,
        amount: request.amount,
        currency: request.currency
      };
      throw categorizedError;
    }
    
    return data as ProcessPaymentResponse;
  } catch (error) {
    // If it's already a PaymentError, re-throw it
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }
    
    // Otherwise, categorize the error
    const categorizedError = categorizeError(error);
    categorizedError.context = {
      ...categorizedError.context,
      paymentMethodId: request.paymentMethodId,
      amount: request.amount,
      operation: 'processPayment'
    };
    throw categorizedError;
  }
}

export async function processRefund(request: ProcessRefundRequest): Promise<ProcessRefundResponse> {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const authError: PaymentError = {
        type: PaymentErrorType.AUTHENTICATION,
        code: 'unauthorized',
        message: 'User must be logged in to process refunds',
        retryable: false,
        recoveryAction: 'login_required' as any
      };
      throw authError;
    }
    
    // Call the process-refund edge function
    const { data, error } = await supabase.functions.invoke('process-refund', {
      body: {
        ...request,
        refundedBy: user.id,
        timestamp: new Date().toISOString()
      }
    });
    
    if (error) {
      console.error('Refund processing error:', error);
      const categorizedError = categorizeError(error);
      categorizedError.context = {
        ...categorizedError.context,
        transactionId: request.transactionId,
        amount: request.amount,
        operation: 'processRefund'
      };
      throw categorizedError;
    }
    
    return data as ProcessRefundResponse;
  } catch (error) {
    // If it's already a PaymentError, re-throw it
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }
    
    // Otherwise, categorize the error
    const categorizedError = categorizeError(error);
    categorizedError.context = {
      ...categorizedError.context,
      transactionId: request.transactionId,
      operation: 'processRefund'
    };
    throw categorizedError;
  }
}

export async function getUserTransactions(): Promise<PaymentTransaction[]> {
  // Use the fromTable helper with the correct table name
  const { data, error } = await supabase.from('payment_transactions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching transactions:', error);
    throw new Error(error.message);
  }
  
  return data as PaymentTransaction[];
}

export async function getTransactionById(transactionId: string): Promise<PaymentTransaction> {
  // Use the fromTable helper with the correct table name
  const { data, error } = await supabase.from('payment_transactions')
    .select('*')
    .eq('id', transactionId)
    .single();
    
  if (error) {
    console.error('Error fetching transaction:', error);
    throw new Error(error.message);
  }
  
  return data as PaymentTransaction;
}

export async function getTransactionRefunds(transactionId: string): Promise<PaymentRefund[]> {
  // Use the fromTable helper with the correct table name
  const { data, error } = await supabase.from('payment_refunds')
    .select('*')
    .eq('transaction_id', transactionId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching refunds:', error);
    throw new Error(error.message);
  }
  
  return data as PaymentRefund[];
}

export async function getReceipt(transactionId: string): Promise<PaymentReceipt | null> {
  // Use the fromTable helper with the correct table name
  const { data, error } = await supabase.from('payment_receipts')
    .select('*')
    .eq('transaction_id', transactionId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null;
    }
    console.error('Error fetching receipt:', error);
    throw new Error(error.message);
  }
  
  return data as PaymentReceipt;
}
