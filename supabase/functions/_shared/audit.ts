// Audit logging utilities for security compliance

export interface SecurityEvent {
  event_type: 'payment_attempt' | 'rate_limit_exceeded' | 'suspicious_activity' | 'authentication_failed' | 'cors_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address: string;
  user_agent: string;
  user_id?: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface PaymentAuditLog {
  request_id: string;
  user_id?: string;
  ip_address: string;
  user_agent: string;
  payment_method_id?: string;
  amount?: number;
  currency?: string;
  status: 'initiated' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  error_code?: string;
  error_message?: string;
  stripe_payment_intent_id?: string;
  processing_time_ms?: number;
  timestamp: string;
  security_flags: string[];
}

export class AuditLogger {
  private supabaseClient: any;

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient;
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Log to console for immediate visibility
      console.log(`[SECURITY_EVENT] ${event.event_type} - ${event.severity}:`, {
        ip: event.ip_address,
        userAgent: event.user_agent.slice(0, 100),
        userId: event.user_id,
        details: event.details
      });

      // Store in database for compliance
      await this.supabaseClient
        .from('security_event_logs')
        .insert({
          event_type: event.event_type,
          severity: event.severity,
          ip_address: event.ip_address,
          user_agent: event.user_agent.slice(0, 500),
          user_id: event.user_id,
          details: event.details,
          created_at: event.timestamp
        });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  async logPaymentAttempt(auditLog: PaymentAuditLog): Promise<void> {
    try {
      // Enhanced console logging with sanitized data
      console.log(`[PAYMENT_AUDIT] ${auditLog.status}:`, {
        requestId: auditLog.request_id,
        userId: auditLog.user_id,
        ip: auditLog.ip_address,
        amount: auditLog.amount,
        currency: auditLog.currency,
        status: auditLog.status,
        processingTime: auditLog.processing_time_ms,
        securityFlags: auditLog.security_flags,
        paymentMethodId: auditLog.payment_method_id ? 'pm_***' : undefined,
        stripeIntentId: auditLog.stripe_payment_intent_id ? 'pi_***' : undefined
      });

      // Store detailed audit log
      await this.supabaseClient
        .from('payment_audit_logs')
        .insert({
          request_id: auditLog.request_id,
          user_id: auditLog.user_id,
          ip_address: auditLog.ip_address,
          user_agent: auditLog.user_agent.slice(0, 500),
          payment_method_id: auditLog.payment_method_id,
          amount: auditLog.amount,
          currency: auditLog.currency,
          status: auditLog.status,
          error_code: auditLog.error_code,
          error_message: auditLog.error_message?.slice(0, 1000),
          stripe_payment_intent_id: auditLog.stripe_payment_intent_id,
          processing_time_ms: auditLog.processing_time_ms,
          security_flags: auditLog.security_flags,
          created_at: auditLog.timestamp
        });
    } catch (error) {
      console.error('Failed to log payment audit:', error);
    }
  }

  async logRateLimitViolation(
    ip: string, 
    userAgent: string, 
    userId?: string, 
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      event_type: 'rate_limit_exceeded',
      severity: 'medium',
      ip_address: ip,
      user_agent: userAgent,
      user_id: userId,
      details: {
        ...details,
        message: 'Rate limit exceeded for payment endpoint'
      },
      timestamp: new Date().toISOString()
    });
  }

  async logSuspiciousActivity(
    ip: string,
    userAgent: string,
    reason: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      event_type: 'suspicious_activity',
      severity: 'high',
      ip_address: ip,
      user_agent: userAgent,
      details: {
        reason,
        ...details,
        flagged_at: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  }

  async logCorsViolation(
    origin: string,
    ip: string,
    userAgent: string
  ): Promise<void> {
    await this.logSecurityEvent({
      event_type: 'cors_violation',
      severity: 'medium',
      ip_address: ip,
      user_agent: userAgent,
      details: {
        attempted_origin: origin,
        message: 'Attempted access from unauthorized origin'
      },
      timestamp: new Date().toISOString()
    });
  }
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function sanitizeForAudit(data: any): any {
  if (!data) return data;
  
  const sensitiveFields = [
    'card', 'cardNumber', 'cvc', 'cvv', 'password', 'token', 'secret'
  ];
  
  const sanitized = JSON.parse(JSON.stringify(data));
  
  function sanitizeObject(obj: any): void {
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        obj[key] = '***REDACTED***';
      } else if (typeof value === 'object' && value !== null) {
        sanitizeObject(value);
      }
    }
  }
  
  if (typeof sanitized === 'object') {
    sanitizeObject(sanitized);
  }
  
  return sanitized;
}