
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

export async function processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
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

export async function processRefund(request: ProcessRefundRequest): Promise<ProcessRefundResponse> {
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to process refunds');
  }
  
  // Call the process-refund edge function
  const { data, error } = await supabase.functions.invoke('process-refund', {
    body: {
      ...request,
      refundedBy: user.id
    }
  });
  
  if (error) {
    console.error('Refund processing error:', error);
    throw new Error(error.message || 'Refund processing failed');
  }
  
  return data as ProcessRefundResponse;
}

export async function getUserTransactions(): Promise<PaymentTransaction[]> {
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

export async function getTransactionById(transactionId: string): Promise<PaymentTransaction> {
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

export async function getTransactionRefunds(transactionId: string): Promise<PaymentRefund[]> {
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

export async function getReceipt(transactionId: string): Promise<PaymentReceipt | null> {
  const { data, error } = await supabase
    .from('payment_receipts')
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
