// Payment Validation Helpers
// Defensive validation functions for payment processing

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitized?: any;
}

// Validate and sanitize payment intent data
export const validatePaymentIntentData = (paymentIntent: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!paymentIntent) {
    return {
      isValid: false,
      errors: ['Payment intent data is null or undefined'],
      warnings: []
    };
  }

  // Required fields validation
  if (!paymentIntent.id || typeof paymentIntent.id !== 'string') {
    errors.push('Payment intent ID is required and must be a string');
  } else if (!paymentIntent.id.startsWith('pi_')) {
    errors.push('Payment intent ID must start with "pi_"');
  }

  if (typeof paymentIntent.amount !== 'number') {
    errors.push('Payment intent amount must be a number');
  } else if (paymentIntent.amount <= 0) {
    errors.push('Payment intent amount must be positive');
  } else if (paymentIntent.amount > 99999999) { // $999,999.99 max
    warnings.push('Payment intent amount is unusually high');
  }

  if (!paymentIntent.currency || typeof paymentIntent.currency !== 'string') {
    errors.push('Payment intent currency is required');
  } else if (!/^[a-z]{3}$/.test(paymentIntent.currency)) {
    errors.push('Currency must be a 3-letter lowercase code');
  }

  // Status validation
  const validStatuses = [
    'requires_payment_method', 'requires_confirmation', 'requires_action',
    'processing', 'requires_capture', 'canceled', 'succeeded'
  ];
  if (!validStatuses.includes(paymentIntent.status)) {
    errors.push(`Invalid payment intent status: ${paymentIntent.status}`);
  }

  // Metadata sanitization
  const sanitizedMetadata = sanitizePaymentMetadata(paymentIntent.metadata);
  
  // Charges validation for succeeded payments
  if (paymentIntent.status === 'succeeded') {
    if (!paymentIntent.charges || !Array.isArray(paymentIntent.charges.data)) {
      warnings.push('Succeeded payment missing charges data');
    } else if (paymentIntent.charges.data.length === 0) {
      warnings.push('Succeeded payment has empty charges array');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitized: {
      ...paymentIntent,
      metadata: sanitizedMetadata
    }
  };
};

// Validate subscription data
export const validateSubscriptionData = (subscription: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!subscription) {
    return {
      isValid: false,
      errors: ['Subscription data is null or undefined'],
      warnings: []
    };
  }

  // ID validation
  if (!subscription.id || !subscription.id.startsWith('sub_')) {
    errors.push('Invalid subscription ID format');
  }

  // Customer validation
  if (!subscription.customer) {
    errors.push('Subscription missing customer');
  } else if (typeof subscription.customer === 'string' && !subscription.customer.startsWith('cus_')) {
    errors.push('Invalid customer ID format');
  }

  // Status validation
  const validStatuses = [
    'incomplete', 'incomplete_expired', 'trialing', 'active',
    'past_due', 'canceled', 'unpaid', 'paused'
  ];
  if (!validStatuses.includes(subscription.status)) {
    errors.push(`Invalid subscription status: ${subscription.status}`);
  }

  // Period validation
  if (typeof subscription.current_period_start !== 'number' || subscription.current_period_start <= 0) {
    errors.push('Invalid current_period_start timestamp');
  }

  if (typeof subscription.current_period_end !== 'number' || subscription.current_period_end <= subscription.current_period_start) {
    errors.push('Invalid current_period_end timestamp');
  }

  // Items validation
  if (!subscription.items || !Array.isArray(subscription.items.data) || subscription.items.data.length === 0) {
    errors.push('Subscription must have at least one item');
  } else {
    subscription.items.data.forEach((item: any, index: number) => {
      if (!item.price?.id) {
        errors.push(`Subscription item ${index} missing price ID`);
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`Subscription item ${index} has invalid quantity`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitized: subscription
  };
};

// Validate invoice data
export const validateInvoiceData = (invoice: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!invoice) {
    return {
      isValid: false,
      errors: ['Invoice data is null or undefined'],
      warnings: []
    };
  }

  // ID validation
  if (!invoice.id || !invoice.id.startsWith('in_')) {
    errors.push('Invalid invoice ID format');
  }

  // Amount validation
  if (typeof invoice.amount_due !== 'number' || invoice.amount_due < 0) {
    errors.push('Invalid amount_due');
  }

  if (typeof invoice.amount_paid !== 'number' || invoice.amount_paid < 0) {
    errors.push('Invalid amount_paid');
  }

  // Currency validation
  if (!invoice.currency || !/^[a-z]{3}$/.test(invoice.currency)) {
    errors.push('Invalid currency format');
  }

  // Status validation
  const validStatuses = ['draft', 'open', 'paid', 'uncollectible', 'void'];
  if (!validStatuses.includes(invoice.status)) {
    errors.push(`Invalid invoice status: ${invoice.status}`);
  }

  // Period validation
  if (invoice.period_start && (typeof invoice.period_start !== 'number' || invoice.period_start <= 0)) {
    warnings.push('Invalid period_start timestamp');
  }

  if (invoice.period_end && (typeof invoice.period_end !== 'number' || invoice.period_end <= (invoice.period_start || 0))) {
    warnings.push('Invalid period_end timestamp');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitized: invoice
  };
};

// Sanitize payment metadata
export const sanitizePaymentMetadata = (metadata: any): Record<string, string> => {
  if (!metadata || typeof metadata !== 'object') {
    return {};
  }

  const sanitized: Record<string, string> = {};
  const maxKeyLength = 40;
  const maxValueLength = 500;
  const maxKeys = 50; // Stripe limit

  let keyCount = 0;
  for (const [key, value] of Object.entries(metadata)) {
    if (keyCount >= maxKeys) {
      break;
    }

    // Sanitize key
    const cleanKey = String(key)
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .slice(0, maxKeyLength);
    
    if (!cleanKey || cleanKey === '_') {
      continue; // Skip invalid keys
    }

    // Sanitize value
    let cleanValue = '';
    if (value !== null && value !== undefined) {
      if (typeof value === 'object') {
        try {
          cleanValue = JSON.stringify(value);
        } catch {
          cleanValue = String(value);
        }
      } else {
        cleanValue = String(value);
      }
    }

    sanitized[cleanKey] = cleanValue.slice(0, maxValueLength);
    keyCount++;
  }

  return sanitized;
};

// Validate customer data
export const validateCustomerData = (customer: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!customer) {
    return {
      isValid: false,
      errors: ['Customer data is required'],
      warnings: []
    };
  }

  if (typeof customer === 'string') {
    // Customer ID validation
    if (!customer.startsWith('cus_')) {
      errors.push('Customer ID must start with "cus_"');
    }
  } else if (typeof customer === 'object') {
    // Customer object validation
    if (!customer.id || !customer.id.startsWith('cus_')) {
      errors.push('Customer object must have valid ID');
    }

    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      warnings.push('Customer email format appears invalid');
    }

    if (customer.phone && !/^[+]?[\d\s\-\(\)]{7,}$/.test(customer.phone)) {
      warnings.push('Customer phone format appears invalid');
    }
  } else {
    errors.push('Customer must be either ID string or customer object');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitized: customer
  };
};

// Validate webhook event structure
export const validateWebhookEventStructure = (event: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!event) {
    return {
      isValid: false,
      errors: ['Event data is required'],
      warnings: []
    };
  }

  // Required top-level fields
  if (!event.id || typeof event.id !== 'string') {
    errors.push('Event ID is required');
  } else if (!event.id.startsWith('evt_')) {
    errors.push('Event ID must start with "evt_"');
  }

  if (!event.type || typeof event.type !== 'string') {
    errors.push('Event type is required');
  } else if (!event.type.includes('.')) {
    errors.push('Event type must contain a dot (e.g., "payment_intent.succeeded")');
  }

  if (!event.data || typeof event.data !== 'object') {
    errors.push('Event data is required');
  } else if (!event.data.object) {
    errors.push('Event data.object is required');
  }

  // Validate timestamps
  if (typeof event.created !== 'number' || event.created <= 0) {
    errors.push('Event created timestamp is invalid');
  } else {
    const eventAge = Date.now() / 1000 - event.created;
    if (eventAge > 86400) { // 24 hours
      warnings.push('Event is more than 24 hours old');
    }
  }

  // API version validation
  if (event.api_version && typeof event.api_version !== 'string') {
    warnings.push('API version should be a string');
  }

  // Livemode validation
  if (typeof event.livemode !== 'boolean') {
    warnings.push('Livemode should be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitized: event
  };
};

// Create safe error response
export const createSafeErrorResponse = (error: any, requestId?: string): Record<string, any> => {
  const safeError: Record<string, any> = {
    error: 'An error occurred processing the webhook',
    timestamp: new Date().toISOString()
  };

  if (requestId) {
    safeError.requestId = requestId;
  }

  // Only include safe error information
  if (error && typeof error === 'object') {
    if (error.message && typeof error.message === 'string') {
      // Sanitize error message - remove sensitive information
      const sanitizedMessage = error.message
        .replace(/sk_live_[A-Za-z0-9]+/g, 'sk_live_***')
        .replace(/sk_test_[A-Za-z0-9]+/g, 'sk_test_***')
        .replace(/whsec_[A-Za-z0-9]+/g, 'whsec_***');
      
      safeError.details = sanitizedMessage.slice(0, 200); // Limit length
    }

    if (error.type) {
      safeError.type = String(error.type).slice(0, 50);
    }
  }

  return safeError;
};