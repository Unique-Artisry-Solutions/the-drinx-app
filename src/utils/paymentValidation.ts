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