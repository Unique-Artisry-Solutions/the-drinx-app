export interface PaymentError {
  type: PaymentErrorType;
  code: string;
  message: string;
  details?: string;
  recoveryAction?: PaymentRecoveryAction;
  retryable: boolean;
  context?: Record<string, any>;
}

export enum PaymentErrorType {
  VALIDATION = 'validation',
  CARD = 'card',
  NETWORK = 'network', 
  SYSTEM = 'system',
  AUTHENTICATION = 'authentication',
  BUSINESS_RULE = 'business_rule'
}

export enum PaymentRecoveryAction {
  RETRY = 'retry',
  UPDATE_CARD = 'update_card',
  CONTACT_SUPPORT = 'contact_support',
  TRY_DIFFERENT_METHOD = 'try_different_method',
  CHECK_DETAILS = 'check_details',
  LOGIN_REQUIRED = 'login_required'
}

export interface PaymentValidationResult {
  isValid: boolean;
  errors: PaymentError[];
  warnings?: string[];
}

export interface PaymentRetryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  retryableErrorTypes: PaymentErrorType[];
}

export interface PaymentErrorContext {
  paymentMethodId?: string;
  amount?: number;
  currency?: string;
  attemptNumber?: number;
  userAgent?: string;
  timestamp: Date;
}

export const PAYMENT_ERROR_CODES = {
  // Validation errors
  INVALID_AMOUNT: 'invalid_amount',
  INVALID_CURRENCY: 'invalid_currency', 
  INVALID_PAYMENT_METHOD: 'invalid_payment_method',
  AMOUNT_TOO_SMALL: 'amount_too_small',
  AMOUNT_TOO_LARGE: 'amount_too_large',
  
  // Card errors
  CARD_DECLINED: 'card_declined',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  EXPIRED_CARD: 'expired_card',
  INCORRECT_CVC: 'incorrect_cvc',
  PROCESSING_ERROR: 'processing_error',
  
  // Network errors
  NETWORK_ERROR: 'network_error',
  TIMEOUT: 'timeout',
  CONNECTION_FAILED: 'connection_failed',
  
  // System errors
  SERVER_ERROR: 'server_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  RATE_LIMITED: 'rate_limited',
  
  // Authentication errors
  UNAUTHORIZED: 'unauthorized',
  SESSION_EXPIRED: 'session_expired',
  
  // Business rule errors
  DUPLICATE_PAYMENT: 'duplicate_payment',
  PAYMENT_LIMIT_EXCEEDED: 'payment_limit_exceeded'
} as const;

export type PaymentErrorCode = typeof PAYMENT_ERROR_CODES[keyof typeof PAYMENT_ERROR_CODES];

export const DEFAULT_ERROR_MESSAGES: Record<PaymentErrorCode, string> = {
  // Validation
  invalid_amount: 'Please enter a valid payment amount',
  invalid_currency: 'Invalid currency specified',
  invalid_payment_method: 'Please provide valid payment details',
  amount_too_small: 'Payment amount is below minimum',
  amount_too_large: 'Payment amount exceeds maximum limit',
  
  // Card
  card_declined: 'Your card was declined. Please try a different payment method',
  insufficient_funds: 'Insufficient funds. Please check your account balance',
  expired_card: 'Your card has expired. Please use a different card',
  incorrect_cvc: 'Invalid security code. Please check your card details',
  processing_error: 'Error processing your card. Please try again',
  
  // Network
  network_error: 'Connection issue. Please check your internet and try again',
  timeout: 'Request timed out. Please try again',
  connection_failed: 'Failed to connect. Please try again',
  
  // System
  server_error: 'System error occurred. Please try again later',
  service_unavailable: 'Payment service temporarily unavailable',
  rate_limited: 'Too many requests. Please wait a moment and try again',
  
  // Authentication
  unauthorized: 'Please log in to continue',
  session_expired: 'Your session has expired. Please log in again',
  
  // Business rules
  duplicate_payment: 'This payment has already been processed',
  payment_limit_exceeded: 'Payment exceeds allowed limit'
};