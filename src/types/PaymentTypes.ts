
export interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  provider: string;
  provider_transaction_id?: string;
  payment_method_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaymentRefund {
  id: string;
  transaction_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  reason?: string;
  provider_refund_id?: string;
  refunded_by?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaymentReceipt {
  id: string;
  transaction_id: string;
  receipt_number: string;
  receipt_url?: string;
  receipt_data: Record<string, any>;
  created_at: string;
}

export interface ProcessPaymentRequest {
  paymentMethodId: string;
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface ProcessPaymentResponse {
  success: boolean;
  status: string;
  paymentIntentId: string;
  transactionId: string | null;
}

export interface ProcessRefundRequest {
  transactionId: string;
  amount?: number;
  reason?: string;
  refundedBy?: string;
}

export interface ProcessRefundResponse {
  success: boolean;
  refundId: string;
  status: string;
  transactionId: string;
}

export interface CardInputDetails {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface StripeCardElement {
  update: (options: any) => void;
  on: (event: string, handler: (event: any) => void) => void;
  mount: (element: HTMLElement | string) => void;
  unmount: () => void;
}

export interface StripeElements {
  create: (type: string, options?: any) => StripeCardElement;
}

export interface StripeInstance {
  elements: (options?: any) => StripeElements;
  createPaymentMethod: (params: any) => Promise<any>;
  confirmCardPayment: (clientSecret: string, data: any) => Promise<any>;
}
