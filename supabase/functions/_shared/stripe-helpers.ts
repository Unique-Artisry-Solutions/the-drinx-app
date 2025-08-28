// Stripe Helper Functions for Payment Processing
// Defensive utilities for payment validation and error handling

export interface PaymentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StripeEventContext {
  eventId: string;
  eventType: string;
  livemode: boolean;
  requestId?: string;
}

// Validate payment amounts and currency
export const validatePaymentAmount = (
  amount: number | null | undefined,
  currency: string | null | undefined,
  context: StripeEventContext
): PaymentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Amount validation
  if (typeof amount !== 'number') {
    errors.push('Payment amount must be a number');
  } else if (amount <= 0) {
    errors.push('Payment amount must be positive');
  } else if (amount > 999999999) { // $9,999,999.99 limit
    errors.push('Payment amount exceeds maximum limit');
  }

  // Currency validation
  if (!currency || typeof currency !== 'string') {
    errors.push('Currency is required');
  } else if (currency.length !== 3) {
    errors.push('Currency must be a 3-letter ISO code');
  } else if (!/^[A-Z]{3}$/.test(currency.toUpperCase())) {
    errors.push('Currency format is invalid');
  }

  // Context-specific warnings
  if (context.livemode && amount && amount < 50) { // $0.50 minimum for live mode
    warnings.push('Payment amount is below recommended minimum for live mode');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate customer data
export const validateCustomerData = (customer: any): PaymentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!customer) {
    errors.push('Customer data is missing');
    return { valid: false, errors, warnings };
  }

  if (typeof customer === 'string') {
    if (!customer.startsWith('cus_')) {
      errors.push('Customer ID format is invalid');
    }
  } else if (typeof customer === 'object') {
    if (!customer.id || !customer.id.startsWith('cus_')) {
      errors.push('Customer object missing valid ID');
    }
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      warnings.push('Customer email format appears invalid');
    }
  } else {
    errors.push('Customer must be either ID string or customer object');
  }

  return { valid: errors.length === 0, errors, warnings };
};

// Sanitize metadata for safe storage
export const sanitizeMetadata = (metadata: Record<string, any> | null | undefined): Record<string, any> => {
  if (!metadata || typeof metadata !== 'object') {
    return {};
  }

  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    // Skip null/undefined values
    if (value == null) continue;
    
    // Sanitize key - only alphanumeric and underscores
    const cleanKey = key.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40);
    if (!cleanKey) continue;
    
    // Sanitize value based on type
    if (typeof value === 'string') {
      sanitized[cleanKey] = value.slice(0, 500); // Stripe metadata value limit
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[cleanKey] = value;
    } else {
      // Convert objects/arrays to JSON string, truncated
      try {
        sanitized[cleanKey] = JSON.stringify(value).slice(0, 500);
      } catch {
        sanitized[cleanKey] = String(value).slice(0, 500);
      }
    }
  }
  
  return sanitized;
};

// Generate idempotency key for operations
export const generateIdempotencyKey = (prefix: string, data: Record<string, any>): string => {
  const timestamp = Date.now();
  const dataStr = JSON.stringify(data, Object.keys(data).sort());
  const hash = btoa(dataStr).replace(/[+/=]/g, '').slice(0, 16);
  return `${prefix}_${timestamp}_${hash}`;
};

// Safe error extraction from Stripe errors
export const extractStripeError = (error: any): { code: string; message: string; type: string } => {
  const defaultError = {
    code: 'unknown_error',
    message: 'An unknown error occurred',
    type: 'api_error'
  };

  if (!error) return defaultError;

  return {
    code: error.code || error.decline_code || 'unknown_error',
    message: error.message || error.user_message || defaultError.message,
    type: error.type || defaultError.type
  };
};

// Validate subscription data
export const validateSubscriptionData = (subscription: any): PaymentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!subscription) {
    errors.push('Subscription data is missing');
    return { valid: false, errors, warnings };
  }

  // Required fields
  if (!subscription.id || !subscription.id.startsWith('sub_')) {
    errors.push('Invalid subscription ID');
  }

  if (!subscription.customer) {
    errors.push('Subscription missing customer');
  }

  if (!subscription.status || !['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'paused', 'trialing', 'unpaid'].includes(subscription.status)) {
    errors.push('Invalid subscription status');
  }

  // Date validations
  if (typeof subscription.current_period_start !== 'number' || subscription.current_period_start <= 0) {
    errors.push('Invalid subscription period start');
  }

  if (typeof subscription.current_period_end !== 'number' || subscription.current_period_end <= subscription.current_period_start) {
    errors.push('Invalid subscription period end');
  }

  // Items validation
  if (!subscription.items || !Array.isArray(subscription.items.data) || subscription.items.data.length === 0) {
    errors.push('Subscription missing items');
  } else {
    subscription.items.data.forEach((item: any, index: number) => {
      if (!item.price || !item.price.id) {
        errors.push(`Subscription item ${index} missing price ID`);
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        warnings.push(`Subscription item ${index} has invalid quantity`);
      }
    });
  }

  return { valid: errors.length === 0, errors, warnings };
};

// Rate limiting helper for webhook processing
export const checkWebhookRateLimit = (eventType: string, maxPerMinute: number = 60): boolean => {
  // Simple in-memory rate limiting (in production, use Redis or similar)
  const key = `webhook_rate_${eventType}`;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  
  if (typeof globalThis !== 'undefined') {
    // @ts-ignore - using globalThis for edge function state
    if (!globalThis._webhookRateLimits) {
      // @ts-ignore
      globalThis._webhookRateLimits = new Map();
    }
    
    // @ts-ignore
    const limits = globalThis._webhookRateLimits as Map<string, number[]>;
    const timestamps = limits.get(key) || [];
    
    // Remove old timestamps
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
    
    if (validTimestamps.length >= maxPerMinute) {
      return false; // Rate limit exceeded
    }
    
    validTimestamps.push(now);
    limits.set(key, validTimestamps);
  }
  
  return true;
};

// Webhook event deduplication helper
export const checkEventDeduplication = (eventId: string, windowMinutes: number = 60): boolean => {
  const key = `webhook_event_${eventId}`;
  const now = Date.now();
  const windowMs = windowMinutes * 60000;
  
  if (typeof globalThis !== 'undefined') {
    // @ts-ignore
    if (!globalThis._webhookEvents) {
      // @ts-ignore
      globalThis._webhookEvents = new Map();
    }
    
    // @ts-ignore
    const events = globalThis._webhookEvents as Map<string, number>;
    const lastSeen = events.get(key);
    
    if (lastSeen && now - lastSeen < windowMs) {
      return false; // Duplicate event
    }
    
    events.set(key, now);
    
    // Cleanup old events
    if (events.size > 1000) {
      for (const [k, timestamp] of events.entries()) {
        if (now - timestamp > windowMs) {
          events.delete(k);
        }
      }
    }
  }
  
  return true;
};