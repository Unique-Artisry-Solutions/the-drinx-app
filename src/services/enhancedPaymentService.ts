
import { supabase } from '@/integrations/supabase/client';
import { 
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  ProcessRefundRequest,
  ProcessRefundResponse
} from '@/types/PaymentTypes';

export interface MultiCurrencyPaymentRequest extends ProcessPaymentRequest {
  currency: string;
  exchangeRate?: number;
  originalAmount?: number;
  originalCurrency?: string;
}

export interface PaymentRetryOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  exponentialBackoff?: boolean;
}

export interface SubscriptionPaymentRequest {
  priceId: string;
  customerId?: string;
  trialPeriodDays?: number;
  metadata?: Record<string, any>;
  currency?: string;
}

class EnhancedPaymentService {
  private readonly supportedCurrencies = [
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
  ];

  async processMultiCurrencyPayment(
    request: MultiCurrencyPaymentRequest,
    retryOptions: PaymentRetryOptions = {}
  ): Promise<ProcessPaymentResponse> {
    // Validate currency
    if (!this.supportedCurrencies.includes(request.currency.toUpperCase())) {
      throw new Error(`Unsupported currency: ${request.currency}`);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be logged in to process payments');
    }

    const metadata = {
      ...request.metadata,
      userId: user.id,
      currency: request.currency,
      exchangeRate: request.exchangeRate,
      originalAmount: request.originalAmount,
      originalCurrency: request.originalCurrency
    };

    return this.processPaymentWithRetry(
      { ...request, metadata },
      retryOptions
    );
  }

  async createSubscription(request: SubscriptionPaymentRequest): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be logged in to create subscriptions');
    }

    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: {
        ...request,
        userId: user.id,
        currency: request.currency || 'USD'
      }
    });

    if (error) {
      console.error('Subscription creation error:', error);
      throw new Error(error.message || 'Failed to create subscription');
    }

    return data;
  }

  async updateSubscription(subscriptionId: string, updates: Partial<SubscriptionPaymentRequest>): Promise<any> {
    const { data, error } = await supabase.functions.invoke('update-subscription', {
      body: {
        subscriptionId,
        ...updates
      }
    });

    if (error) {
      console.error('Subscription update error:', error);
      throw new Error(error.message || 'Failed to update subscription');
    }

    return data;
  }

  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<any> {
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: {
        subscriptionId,
        immediately
      }
    });

    if (error) {
      console.error('Subscription cancellation error:', error);
      throw new Error(error.message || 'Failed to cancel subscription');
    }

    return data;
  }

  private async processPaymentWithRetry(
    request: ProcessPaymentRequest,
    retryOptions: PaymentRetryOptions
  ): Promise<ProcessPaymentResponse> {
    const {
      maxRetries = 3,
      retryDelayMs = 1000,
      exponentialBackoff = true
    } = retryOptions;

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await supabase.functions.invoke('process-payment', {
          body: request
        });

        if (error) {
          throw new Error(error.message || 'Payment processing failed');
        }

        return data as ProcessPaymentResponse;
      } catch (error) {
        lastError = error as Error;
        console.error(`Payment attempt ${attempt + 1} failed:`, error);

        // Don't retry on certain types of errors
        if (this.isNonRetryableError(error as Error)) {
          break;
        }

        // Don't wait after the last attempt
        if (attempt < maxRetries) {
          const delay = exponentialBackoff 
            ? retryDelayMs * Math.pow(2, attempt)
            : retryDelayMs;
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    await this.logPaymentFailure(request, lastError);
    throw lastError || new Error('Payment processing failed after retries');
  }

  private isNonRetryableError(error: Error): boolean {
    const nonRetryableMessages = [
      'card_declined',
      'expired_card',
      'incorrect_cvc',
      'insufficient_funds',
      'invalid_account',
      'authentication_required'
    ];

    return nonRetryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  }

  private async logPaymentFailure(request: ProcessPaymentRequest, error: Error | null) {
    try {
      await supabase.from('payment_failure_logs').insert({
        user_id: request.metadata?.userId,
        payment_method_id: request.paymentMethodId,
        amount: request.amount,
        currency: request.currency || 'USD',
        error_message: error?.message,
        metadata: {
          ...request.metadata,
          failure_timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log payment failure:', logError);
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    return this.supportedCurrencies;
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    // In a real implementation, you'd call a currency exchange API
    // For now, return a mock rate
    if (fromCurrency === toCurrency) return 1;
    
    const mockRates: Record<string, number> = {
      'EUR-USD': 1.08,
      'GBP-USD': 1.27,
      'CAD-USD': 0.74,
      'AUD-USD': 0.67,
      'JPY-USD': 0.0067
    };

    const key = `${fromCurrency}-${toCurrency}`;
    const reverseKey = `${toCurrency}-${fromCurrency}`;
    
    if (mockRates[key]) return mockRates[key];
    if (mockRates[reverseKey]) return 1 / mockRates[reverseKey];
    
    return 1; // Default rate
  }

  async convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    return Math.round(amount * rate);
  }
}

export const enhancedPaymentService = new EnhancedPaymentService();
