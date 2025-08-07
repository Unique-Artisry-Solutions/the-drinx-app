import { 
  PaymentError, 
  PaymentErrorType, 
  PaymentRecoveryAction,
  PaymentValidationResult,
  PAYMENT_ERROR_CODES,
  DEFAULT_ERROR_MESSAGES,
  PaymentErrorCode
} from '@/types/PaymentErrors';

export interface PaymentValidationConfig {
  minAmount: number;
  maxAmount: number;
  allowedCurrencies: string[];
  requiresAuth: boolean;
}

const DEFAULT_CONFIG: PaymentValidationConfig = {
  minAmount: 0.50, // $0.50 minimum
  maxAmount: 999999.99, // $999,999.99 maximum
  allowedCurrencies: ['usd', 'eur', 'gbp'],
  requiresAuth: true
};

export class PaymentValidator {
  private config: PaymentValidationConfig;

  constructor(config: Partial<PaymentValidationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  validateAmount(amount: number, currency: string = 'usd'): PaymentError[] {
    const errors: PaymentError[] = [];

    if (!amount || isNaN(amount)) {
      errors.push(this.createError(
        PaymentErrorType.VALIDATION,
        PAYMENT_ERROR_CODES.INVALID_AMOUNT,
        'Amount must be a valid number'
      ));
      return errors;
    }

    if (amount < this.config.minAmount) {
      errors.push(this.createError(
        PaymentErrorType.VALIDATION,
        PAYMENT_ERROR_CODES.AMOUNT_TOO_SMALL,
        `Amount must be at least $${this.config.minAmount.toFixed(2)}`,
        PaymentRecoveryAction.CHECK_DETAILS
      ));
    }

    if (amount > this.config.maxAmount) {
      errors.push(this.createError(
        PaymentErrorType.VALIDATION,
        PAYMENT_ERROR_CODES.AMOUNT_TOO_LARGE,
        `Amount cannot exceed $${this.config.maxAmount.toFixed(2)}`,
        PaymentRecoveryAction.CHECK_DETAILS
      ));
    }

    return errors;
  }

  validateCurrency(currency: string): PaymentError[] {
    const errors: PaymentError[] = [];

    if (!currency) {
      errors.push(this.createError(
        PaymentErrorType.VALIDATION,
        PAYMENT_ERROR_CODES.INVALID_CURRENCY,
        'Currency is required'
      ));
      return errors;
    }

    const normalizedCurrency = currency.toLowerCase();
    if (!this.config.allowedCurrencies.includes(normalizedCurrency)) {
      errors.push(this.createError(
        PaymentErrorType.VALIDATION,
        PAYMENT_ERROR_CODES.INVALID_CURRENCY,
        `Currency '${currency}' is not supported. Allowed: ${this.config.allowedCurrencies.join(', ')}`
      ));
    }

    return errors;
  }

  validatePaymentMethod(paymentMethodId: string): PaymentError[] {
    const errors: PaymentError[] = [];

    if (!paymentMethodId || typeof paymentMethodId !== 'string') {
      errors.push(this.createError(
        PaymentErrorType.VALIDATION,
        PAYMENT_ERROR_CODES.INVALID_PAYMENT_METHOD,
        'Valid payment method is required',
        PaymentRecoveryAction.UPDATE_CARD
      ));
    }

    // Basic format validation for Stripe payment method IDs
    if (paymentMethodId && !paymentMethodId.startsWith('pm_')) {
      errors.push(this.createError(
        PaymentErrorType.VALIDATION,
        PAYMENT_ERROR_CODES.INVALID_PAYMENT_METHOD,
        'Invalid payment method format',
        PaymentRecoveryAction.UPDATE_CARD
      ));
    }

    return errors;
  }

  validatePaymentRequest(request: {
    paymentMethodId: string;
    amount: number;
    currency?: string;
    description?: string;
  }): PaymentValidationResult {
    const currency = request.currency || 'usd';
    const errors: PaymentError[] = [];

    // Validate each component
    errors.push(...this.validateAmount(request.amount, currency));
    errors.push(...this.validateCurrency(currency));
    errors.push(...this.validatePaymentMethod(request.paymentMethodId));

    // Business rule validations
    if (request.description && request.description.length > 500) {
      errors.push(this.createError(
        PaymentErrorType.BUSINESS_RULE,
        PAYMENT_ERROR_CODES.INVALID_AMOUNT,
        'Description cannot exceed 500 characters'
      ));
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: this.generateWarnings(request)
    };
  }

  private generateWarnings(request: any): string[] {
    const warnings: string[] = [];

    if (request.amount > 1000) {
      warnings.push('Large payment amount - please verify before proceeding');
    }

    return warnings;
  }

  private createError(
    type: PaymentErrorType,
    code: PaymentErrorCode,
    message?: string,
    recoveryAction?: PaymentRecoveryAction
  ): PaymentError {
    return {
      type,
      code,
      message: message || DEFAULT_ERROR_MESSAGES[code] || 'Unknown error occurred',
      recoveryAction: recoveryAction || this.getDefaultRecoveryAction(type),
      retryable: this.isRetryableError(type),
      context: {
        timestamp: new Date().toISOString()
      }
    };
  }

  private getDefaultRecoveryAction(type: PaymentErrorType): PaymentRecoveryAction {
    switch (type) {
      case PaymentErrorType.VALIDATION:
        return PaymentRecoveryAction.CHECK_DETAILS;
      case PaymentErrorType.CARD:
        return PaymentRecoveryAction.UPDATE_CARD;
      case PaymentErrorType.NETWORK:
        return PaymentRecoveryAction.RETRY;
      case PaymentErrorType.AUTHENTICATION:
        return PaymentRecoveryAction.LOGIN_REQUIRED;
      case PaymentErrorType.SYSTEM:
        return PaymentRecoveryAction.CONTACT_SUPPORT;
      default:
        return PaymentRecoveryAction.RETRY;
    }
  }

  private isRetryableError(type: PaymentErrorType): boolean {
    return [
      PaymentErrorType.NETWORK,
      PaymentErrorType.SYSTEM
    ].includes(type);
  }
}

export const paymentValidator = new PaymentValidator();

// Enhanced security validation functions
export function sanitizePaymentInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
      .trim()
      .slice(0, 1000); // Limit string length
  }
  
  if (typeof input === 'number') {
    if (!isFinite(input) || isNaN(input)) {
      throw new Error('Invalid numeric input');
    }
    return input;
  }
  
  if (Array.isArray(input)) {
    return input.slice(0, 10).map(sanitizePaymentInput); // Limit array size
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    const allowedKeys = [
      'paymentMethodId', 'amount', 'currency', 'description', 
      'userId', 'eventId', 'ticketType', 'quantity', 'metadata'
    ];
    
    for (const [key, value] of Object.entries(input)) {
      if (allowedKeys.includes(key) && key.length < 50) {
        sanitized[key] = sanitizePaymentInput(value);
      }
    }
    return sanitized;
  }
  
  return input;
}

export function validateNoSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /('|('')|;|--|\/\*|\*\/)/g,
    /(0x[0-9a-f]+)/gi,
    /(\bOR\s+\d+\s*=\s*\d+)/gi,
    /(\bAND\s+\d+\s*=\s*\d+)/gi
  ];
  
  return !sqlPatterns.some(pattern => pattern.test(input));
}

export function validateNoXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]*src\s*=\s*["']?javascript:/gi,
    /data:text\/html/gi
  ];
  
  return !xssPatterns.some(pattern => pattern.test(input));
}

export function validatePaymentAmount(amount: number): { isValid: boolean; error?: string } {
  if (typeof amount !== 'number' || !isFinite(amount) || isNaN(amount)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }
  
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than zero' };
  }
  
  if (amount < 0.50) {
    return { isValid: false, error: 'Amount must be at least $0.50' };
  }
  
  if (amount > 999999.99) {
    return { isValid: false, error: 'Amount cannot exceed $999,999.99' };
  }
  
  // Check for suspicious amounts (very precise decimals might indicate manipulation)
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { isValid: false, error: 'Amount cannot have more than 2 decimal places' };
  }
  
  return { isValid: true };
}

export function validateCurrencyCode(currency: string): { isValid: boolean; error?: string } {
  if (!currency || typeof currency !== 'string') {
    return { isValid: false, error: 'Currency code is required' };
  }
  
  if (!validateNoSQLInjection(currency) || !validateNoXSS(currency)) {
    return { isValid: false, error: 'Currency code contains invalid characters' };
  }
  
  const normalizedCurrency = currency.toLowerCase().trim();
  const allowedCurrencies = ['usd', 'eur', 'gbp', 'cad', 'aud'];
  
  if (!allowedCurrencies.includes(normalizedCurrency)) {
    return { isValid: false, error: `Currency '${currency}' is not supported` };
  }
  
  return { isValid: true };
}

export async function validatePaymentMethodId(
  paymentMethodId: string,
  cardNumber?: string,
  clientCountry?: string
): Promise<{ isValid: boolean; error?: string; riskLevel?: string; warnings?: string[] }> {
  if (!paymentMethodId || typeof paymentMethodId !== 'string') {
    return { isValid: false, error: 'Payment method ID is required' };
  }
  
  if (!validateNoSQLInjection(paymentMethodId) || !validateNoXSS(paymentMethodId)) {
    return { isValid: false, error: 'Payment method ID contains invalid characters' };
  }
  
  // Stripe payment method IDs should start with 'pm_'
  if (!paymentMethodId.startsWith('pm_')) {
    return { isValid: false, error: 'Invalid payment method ID format' };
  }
  
  // Basic length validation
  if (paymentMethodId.length < 10 || paymentMethodId.length > 50) {
    return { isValid: false, error: 'Payment method ID has invalid length' };
  }

  // Enhanced validation with BIN and country checks
  if (cardNumber) {
    try {
      const { paymentMethodValidator } = await import('./paymentMethodValidation');
      const validation = await paymentMethodValidator.validatePaymentMethod(cardNumber, clientCountry);
      
      if (!validation.isValid) {
        return { 
          isValid: false, 
          error: validation.errors[0],
          riskLevel: validation.riskAssessment.level,
          warnings: validation.warnings
        };
      }

      return { 
        isValid: true,
        riskLevel: validation.riskAssessment.level,
        warnings: validation.warnings
      };
    } catch (error) {
      console.warn('Enhanced payment method validation failed:', error);
      // Fall back to basic validation
    }
  }
  
  return { isValid: true };
}

export function validatePaymentDescription(description?: string): { isValid: boolean; error?: string } {
  if (!description) {
    return { isValid: true }; // Description is optional
  }
  
  if (typeof description !== 'string') {
    return { isValid: false, error: 'Description must be a string' };
  }
  
  if (!validateNoSQLInjection(description) || !validateNoXSS(description)) {
    return { isValid: false, error: 'Description contains invalid characters' };
  }
  
  if (description.length > 500) {
    return { isValid: false, error: 'Description cannot exceed 500 characters' };
  }
  
  return { isValid: true };
}

export function validateCompletePaymentRequest(request: {
  paymentMethodId: string;
  amount: number;
  currency?: string;
  description?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate amount
  const amountValidation = validatePaymentAmount(request.amount);
  if (!amountValidation.isValid) {
    errors.push(amountValidation.error!);
  }
  
  // Validate currency
  const currency = request.currency || 'usd';
  const currencyValidation = validateCurrencyCode(currency);
  if (!currencyValidation.isValid) {
    errors.push(currencyValidation.error!);
  }
  
  // Validate payment method (sync version for backwards compatibility)
  if (!request.paymentMethodId || typeof request.paymentMethodId !== 'string') {
    errors.push('Payment method ID is required');
  } else if (!request.paymentMethodId.startsWith('pm_')) {
    errors.push('Invalid payment method ID format');
  } else if (request.paymentMethodId.length < 10 || request.paymentMethodId.length > 50) {
    errors.push('Payment method ID has invalid length');
  }
  
  // Validate description
  const descriptionValidation = validatePaymentDescription(request.description);
  if (!descriptionValidation.isValid) {
    errors.push(descriptionValidation.error!);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function categorizeError(error: any): PaymentError {
  const errorMessage = error?.message || error || 'Unknown error';
  const errorCode = error?.code || error?.type || '';

  // Categorize based on error patterns
  if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return {
      type: PaymentErrorType.NETWORK,
      code: PAYMENT_ERROR_CODES.NETWORK_ERROR,
      message: DEFAULT_ERROR_MESSAGES.network_error,
      recoveryAction: PaymentRecoveryAction.RETRY,
      retryable: true,
      context: { originalError: errorMessage }
    };
  }

  if (errorMessage.includes('card') || errorMessage.includes('declined')) {
    return {
      type: PaymentErrorType.CARD,
      code: PAYMENT_ERROR_CODES.CARD_DECLINED,
      message: DEFAULT_ERROR_MESSAGES.card_declined,
      recoveryAction: PaymentRecoveryAction.UPDATE_CARD,
      retryable: false,
      context: { originalError: errorMessage }
    };
  }

  if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
    return {
      type: PaymentErrorType.AUTHENTICATION,
      code: PAYMENT_ERROR_CODES.UNAUTHORIZED,
      message: DEFAULT_ERROR_MESSAGES.unauthorized,
      recoveryAction: PaymentRecoveryAction.LOGIN_REQUIRED,
      retryable: false,
      context: { originalError: errorMessage }
    };
  }

  // Default to system error
  return {
    type: PaymentErrorType.SYSTEM,
    code: PAYMENT_ERROR_CODES.SERVER_ERROR,
    message: DEFAULT_ERROR_MESSAGES.server_error,
    recoveryAction: PaymentRecoveryAction.CONTACT_SUPPORT,
    retryable: true,
    context: { originalError: errorMessage }
  };
}