// Fraud Detection Engine
// Level 3: Advanced Security Measures

export interface FraudDetectionRule {
  id: string;
  ruleName: string;
  ruleType: 'velocity' | 'pattern' | 'amount' | 'geo' | 'device';
  conditions: Record<string, any>;
  action: 'flag' | 'block' | 'review' | 'require_2fa';
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
}

export interface PaymentAttempt {
  userId?: string;
  deviceFingerprintId?: string;
  amount: number;
  currency: string;
  ipAddress?: string;
  userAgent?: string;
  geolocation?: {
    country: string;
    region: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  timestamp: Date;
  cardBin?: string;
  metadata?: Record<string, any>;
}

export interface FraudAssessmentResult {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: 'allow' | 'flag' | 'block' | 'review' | 'require_2fa';
  triggeredRules: Array<{
    rule: FraudDetectionRule;
    score: number;
    reason: string;
  }>;
  factors: string[];
  confidence: number;
}

export interface VelocityCheck {
  timeWindow: number; // minutes
  transactionCount: number;
  totalAmount: number;
  uniqueCards: number;
  uniqueDevices: number;
}

class FraudDetectionEngine {
  private rules: FraudDetectionRule[] = [];
  private recentAttempts = new Map<string, PaymentAttempt[]>();
  private readonly MAX_HISTORY_SIZE = 1000;

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default fraud detection rules
   */
  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'velocity_high',
        ruleName: 'High Transaction Velocity',
        ruleType: 'velocity',
        conditions: {
          maxTransactions: 5,
          timeWindowMinutes: 10,
          scope: 'user'
        },
        action: 'flag',
        severity: 'high',
        isActive: true
      },
      {
        id: 'velocity_critical',
        ruleName: 'Critical Transaction Velocity',
        ruleType: 'velocity',
        conditions: {
          maxTransactions: 10,
          timeWindowMinutes: 5,
          scope: 'user'
        },
        action: 'block',
        severity: 'critical',
        isActive: true
      },
      {
        id: 'amount_large',
        ruleName: 'Large Amount Transaction',
        ruleType: 'amount',
        conditions: {
          threshold: 1000,
          currency: 'usd'
        },
        action: 'review',
        severity: 'medium',
        isActive: true
      },
      {
        id: 'amount_suspicious',
        ruleName: 'Suspicious Amount Pattern',
        ruleType: 'pattern',
        conditions: {
          roundNumbers: true,
          maxDecimalPlaces: 0,
          minAmount: 100
        },
        action: 'flag',
        severity: 'low',
        isActive: true
      },
      {
        id: 'geo_anomaly',
        ruleName: 'Geographic Anomaly',
        ruleType: 'geo',
        conditions: {
          maxDistanceKm: 1000,
          timeWindowHours: 1
        },
        action: 'flag',
        severity: 'medium',
        isActive: true
      },
      {
        id: 'device_new_high_amount',
        ruleName: 'New Device High Amount',
        ruleType: 'device',
        conditions: {
          deviceAge: 24, // hours
          minAmount: 500
        },
        action: 'require_2fa',
        severity: 'medium',
        isActive: true
      },
      {
        id: 'failed_attempts',
        ruleName: 'Multiple Failed Attempts',
        ruleType: 'pattern',
        conditions: {
          maxFailures: 3,
          timeWindowMinutes: 15
        },
        action: 'block',
        severity: 'high',
        isActive: true
      }
    ];
  }

  /**
   * Assess fraud risk for a payment attempt
   */
  public async assessFraudRisk(attempt: PaymentAttempt): Promise<FraudAssessmentResult> {
    const triggeredRules: Array<{ rule: FraudDetectionRule; score: number; reason: string }> = [];
    const factors: string[] = [];
    let totalScore = 0;

    // Store attempt for velocity checks
    this.storeAttempt(attempt);

    // Evaluate each active rule
    for (const rule of this.rules.filter(r => r.isActive)) {
      const evaluation = await this.evaluateRule(rule, attempt);
      
      if (evaluation.triggered) {
        triggeredRules.push({
          rule,
          score: evaluation.score,
          reason: evaluation.reason
        });
        
        totalScore += evaluation.score;
        factors.push(evaluation.factor);
      }
    }

    // Determine risk level and recommended action
    const { riskLevel, recommendedAction, confidence } = this.calculateRiskLevel(totalScore, triggeredRules);

    return {
      overallScore: Math.min(100, totalScore),
      riskLevel,
      recommendedAction,
      triggeredRules,
      factors,
      confidence
    };
  }

  /**
   * Evaluate a specific fraud detection rule
   */
  private async evaluateRule(rule: FraudDetectionRule, attempt: PaymentAttempt): Promise<{
    triggered: boolean;
    score: number;
    reason: string;
    factor: string;
  }> {
    try {
      switch (rule.ruleType) {
        case 'velocity':
          return this.evaluateVelocityRule(rule, attempt);
        
        case 'amount':
          return this.evaluateAmountRule(rule, attempt);
        
        case 'pattern':
          return this.evaluatePatternRule(rule, attempt);
        
        case 'geo':
          return this.evaluateGeoRule(rule, attempt);
        
        case 'device':
          return this.evaluateDeviceRule(rule, attempt);
        
        default:
          return { triggered: false, score: 0, reason: '', factor: '' };
      }
    } catch (error) {
      console.error(`Error evaluating rule ${rule.id}:`, error);
      return { triggered: false, score: 0, reason: '', factor: '' };
    }
  }

  /**
   * Evaluate velocity-based rules
   */
  private evaluateVelocityRule(rule: FraudDetectionRule, attempt: PaymentAttempt): {
    triggered: boolean;
    score: number;
    reason: string;
    factor: string;
  } {
    const { maxTransactions, timeWindowMinutes, scope } = rule.conditions;
    const windowStart = new Date(attempt.timestamp.getTime() - (timeWindowMinutes * 60 * 1000));
    
    let recentAttempts: PaymentAttempt[] = [];
    
    if (scope === 'user' && attempt.userId) {
      recentAttempts = this.getRecentAttempts('user', attempt.userId, windowStart);
    } else if (scope === 'device' && attempt.deviceFingerprintId) {
      recentAttempts = this.getRecentAttempts('device', attempt.deviceFingerprintId, windowStart);
    } else if (scope === 'ip' && attempt.ipAddress) {
      recentAttempts = this.getRecentAttempts('ip', attempt.ipAddress, windowStart);
    }
    
    const transactionCount = recentAttempts.length + 1; // +1 for current attempt
    
    if (transactionCount > maxTransactions) {
      const score = this.getSeverityScore(rule.severity) * Math.min(2, transactionCount / maxTransactions);
      return {
        triggered: true,
        score,
        reason: `${transactionCount} transactions in ${timeWindowMinutes} minutes`,
        factor: `velocity_${scope}`
      };
    }
    
    return { triggered: false, score: 0, reason: '', factor: '' };
  }

  /**
   * Evaluate amount-based rules
   */
  private evaluateAmountRule(rule: FraudDetectionRule, attempt: PaymentAttempt): {
    triggered: boolean;
    score: number;
    reason: string;
    factor: string;
  } {
    const { threshold, currency } = rule.conditions;
    
    // Convert amount to USD if needed (simplified)
    let normalizedAmount = attempt.amount;
    if (attempt.currency !== 'usd' && currency === 'usd') {
      // In production, use real exchange rates
      const exchangeRates: Record<string, number> = {
        'eur': 1.1,
        'gbp': 1.3,
        'cad': 0.8
      };
      normalizedAmount = attempt.amount * (exchangeRates[attempt.currency] || 1);
    }
    
    if (normalizedAmount > threshold) {
      const score = this.getSeverityScore(rule.severity) * Math.min(2, normalizedAmount / threshold);
      return {
        triggered: true,
        score,
        reason: `Amount $${normalizedAmount.toFixed(2)} exceeds threshold $${threshold}`,
        factor: 'high_amount'
      };
    }
    
    return { triggered: false, score: 0, reason: '', factor: '' };
  }

  /**
   * Evaluate pattern-based rules
   */
  private evaluatePatternRule(rule: FraudDetectionRule, attempt: PaymentAttempt): {
    triggered: boolean;
    score: number;
    reason: string;
    factor: string;
  } {
    let triggered = false;
    let reason = '';
    let factor = '';

    if (rule.ruleName.includes('Suspicious Amount Pattern')) {
      const { roundNumbers, maxDecimalPlaces, minAmount } = rule.conditions;
      
      if (attempt.amount >= minAmount) {
        // Check for round numbers
        if (roundNumbers && attempt.amount % 100 === 0) {
          triggered = true;
          reason = 'Round number amount';
          factor = 'round_amount';
        }
        
        // Check decimal places
        const decimalPlaces = (attempt.amount.toString().split('.')[1] || '').length;
        if (decimalPlaces > maxDecimalPlaces) {
          triggered = true;
          reason = `Too many decimal places: ${decimalPlaces}`;
          factor = 'precise_amount';
        }
      }
    }

    if (rule.ruleName.includes('Multiple Failed Attempts')) {
      // This would check failed attempt history
      // For now, we'll simulate this check
      const failedAttempts = 0; // Would come from database
      if (failedAttempts >= rule.conditions.maxFailures) {
        triggered = true;
        reason = `${failedAttempts} failed attempts in ${rule.conditions.timeWindowMinutes} minutes`;
        factor = 'failed_attempts';
      }
    }
    
    if (triggered) {
      return {
        triggered: true,
        score: this.getSeverityScore(rule.severity),
        reason,
        factor
      };
    }
    
    return { triggered: false, score: 0, reason: '', factor: '' };
  }

  /**
   * Evaluate geographic rules
   */
  private evaluateGeoRule(rule: FraudDetectionRule, attempt: PaymentAttempt): {
    triggered: boolean;
    score: number;
    reason: string;
    factor: string;
  } {
    if (!attempt.geolocation || !attempt.userId) {
      return { triggered: false, score: 0, reason: '', factor: '' };
    }

    const { maxDistanceKm, timeWindowHours } = rule.conditions;
    const windowStart = new Date(attempt.timestamp.getTime() - (timeWindowHours * 60 * 60 * 1000));
    
    const recentAttempts = this.getRecentAttempts('user', attempt.userId, windowStart);
    
    for (const prevAttempt of recentAttempts) {
      if (prevAttempt.geolocation) {
        const distance = this.calculateDistance(
          attempt.geolocation.lat || 0,
          attempt.geolocation.lng || 0,
          prevAttempt.geolocation.lat || 0,
          prevAttempt.geolocation.lng || 0
        );
        
        if (distance > maxDistanceKm) {
          const score = this.getSeverityScore(rule.severity) * Math.min(2, distance / maxDistanceKm);
          return {
            triggered: true,
            score,
            reason: `${distance.toFixed(0)}km from previous transaction`,
            factor: 'geo_anomaly'
          };
        }
      }
    }
    
    return { triggered: false, score: 0, reason: '', factor: '' };
  }

  /**
   * Evaluate device-based rules
   */
  private evaluateDeviceRule(rule: FraudDetectionRule, attempt: PaymentAttempt): {
    triggered: boolean;
    score: number;
    reason: string;
    factor: string;
  } {
    if (rule.ruleName.includes('New Device High Amount')) {
      const { deviceAge, minAmount } = rule.conditions;
      
      // This would check device age from database
      const deviceAgeHours = 1; // Simulated - would come from device_fingerprints table
      
      if (deviceAgeHours < deviceAge && attempt.amount >= minAmount) {
        const score = this.getSeverityScore(rule.severity);
        return {
          triggered: true,
          score,
          reason: `New device (${deviceAgeHours}h old) with high amount $${attempt.amount}`,
          factor: 'new_device_high_amount'
        };
      }
    }
    
    return { triggered: false, score: 0, reason: '', factor: '' };
  }

  /**
   * Calculate risk level and recommended action
   */
  private calculateRiskLevel(totalScore: number, triggeredRules: any[]): {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendedAction: 'allow' | 'flag' | 'block' | 'review' | 'require_2fa';
    confidence: number;
  } {
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let recommendedAction: 'allow' | 'flag' | 'block' | 'review' | 'require_2fa' = 'allow';
    
    // Determine risk level based on score
    if (totalScore >= 80) {
      riskLevel = 'critical';
      recommendedAction = 'block';
    } else if (totalScore >= 50) {
      riskLevel = 'high';
      recommendedAction = 'review';
    } else if (totalScore >= 25) {
      riskLevel = 'medium';
      recommendedAction = 'flag';
    }

    // Override with most severe rule action if applicable
    const severestAction = triggeredRules.reduce((max, rule) => {
      const actionSeverity = this.getActionSeverity(rule.rule.action);
      const maxSeverity = this.getActionSeverity(max);
      return actionSeverity > maxSeverity ? rule.rule.action : max;
    }, 'allow' as any);

    if (severestAction !== 'allow') {
      recommendedAction = severestAction;
    }

    // Calculate confidence based on number and quality of triggered rules
    const confidence = Math.min(100, 60 + (triggeredRules.length * 10) + (totalScore / 2));

    return { riskLevel, recommendedAction, confidence };
  }

  /**
   * Helper methods
   */
  private getSeverityScore(severity: string): number {
    const scores = { low: 10, medium: 25, high: 40, critical: 60 };
    return scores[severity as keyof typeof scores] || 10;
  }

  private getActionSeverity(action: string): number {
    const severities = { allow: 0, flag: 1, require_2fa: 2, review: 3, block: 4 };
    return severities[action as keyof typeof severities] || 0;
  }

  private storeAttempt(attempt: PaymentAttempt): void {
    const key = attempt.userId || attempt.deviceFingerprintId || attempt.ipAddress || 'anonymous';
    
    if (!this.recentAttempts.has(key)) {
      this.recentAttempts.set(key, []);
    }
    
    const attempts = this.recentAttempts.get(key)!;
    attempts.push(attempt);
    
    // Keep only recent attempts
    if (attempts.length > this.MAX_HISTORY_SIZE) {
      attempts.splice(0, attempts.length - this.MAX_HISTORY_SIZE);
    }
  }

  private getRecentAttempts(scope: string, identifier: string, since: Date): PaymentAttempt[] {
    const attempts = this.recentAttempts.get(identifier) || [];
    return attempts.filter(attempt => attempt.timestamp >= since);
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const fraudDetectionEngine = new FraudDetectionEngine();

/**
 * Quick fraud assessment function
 */
export async function assessPaymentFraud(attempt: PaymentAttempt): Promise<FraudAssessmentResult> {
  return fraudDetectionEngine.assessFraudRisk(attempt);
}
