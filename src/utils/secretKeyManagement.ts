// Enhanced Secret Key Management
// Level 3: Advanced Security Measures

export interface ApiKeyConfiguration {
  id: string;
  serviceName: string;
  keyName: string;
  isActive: boolean;
  createdAt: string;
  lastRotated?: string;
  nextRotation?: string;
  rotationInterval?: number; // days
  status: 'active' | 'rotating' | 'expired' | 'compromised';
}

export interface KeyRotationRequest {
  serviceName: string;
  reason?: string;
  forceRotation?: boolean;
}

export interface KeyValidationResult {
  isValid: boolean;
  error?: string;
  metadata?: {
    keyFormat: string;
    estimatedStrength: 'weak' | 'medium' | 'strong';
    hasSpecialChars: boolean;
    length: number;
  };
}

class SecretKeyManager {
  private readonly API_KEY_PATTERNS = {
    stripe: /^sk_(test_|live_)[a-zA-Z0-9]{24,}$/,
    openai: /^sk-[a-zA-Z0-9]{48,}$/,
    google: /^AIza[0-9A-Za-z-_]{35}$/,
    sendgrid: /^SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}$/,
    twilio: /^AC[a-fA-F0-9]{32}$/,
    mailgun: /^key-[a-fA-F0-9]{32}$/,
    aws: /^AKIA[0-9A-Z]{16}$/
  };

  private readonly ROTATION_INTERVALS = {
    stripe: 90, // 3 months
    openai: 60, // 2 months
    google: 90,
    sendgrid: 60,
    twilio: 90,
    default: 90
  };

  /**
   * Validates API key format and strength
   */
  public validateApiKey(serviceName: string, apiKey: string): KeyValidationResult {
    if (!apiKey || typeof apiKey !== 'string') {
      return {
        isValid: false,
        error: 'API key is required and must be a string'
      };
    }

    // Remove whitespace
    const trimmedKey = apiKey.trim();
    
    if (trimmedKey.length === 0) {
      return {
        isValid: false,
        error: 'API key cannot be empty'
      };
    }

    // Check for common weak patterns
    const weakPatterns = [
      /^(test|demo|sample|example)/i,
      /^(123|abc|key)/i,
      /password/i,
      /admin/i
    ];

    if (weakPatterns.some(pattern => pattern.test(trimmedKey))) {
      return {
        isValid: false,
        error: 'API key appears to be a test or weak key'
      };
    }

    // Service-specific validation
    const servicePattern = this.API_KEY_PATTERNS[serviceName.toLowerCase() as keyof typeof this.API_KEY_PATTERNS];
    
    if (servicePattern && !servicePattern.test(trimmedKey)) {
      return {
        isValid: false,
        error: `Invalid ${serviceName} API key format`
      };
    }

    // General strength assessment
    const strength = this.assessKeyStrength(trimmedKey);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmedKey);

    return {
      isValid: true,
      metadata: {
        keyFormat: servicePattern ? 'service_specific' : 'generic',
        estimatedStrength: strength,
        hasSpecialChars,
        length: trimmedKey.length
      }
    };
  }

  /**
   * Assesses the strength of an API key
   */
  private assessKeyStrength(key: string): 'weak' | 'medium' | 'strong' {
    let score = 0;

    // Length scoring
    if (key.length >= 32) score += 2;
    else if (key.length >= 16) score += 1;

    // Character variety
    if (/[a-z]/.test(key)) score += 1;
    if (/[A-Z]/.test(key)) score += 1;
    if (/[0-9]/.test(key)) score += 1;
    if (/[^a-zA-Z0-9]/.test(key)) score += 1;

    // Entropy check (simplified)
    const uniqueChars = new Set(key).size;
    if (uniqueChars / key.length > 0.7) score += 1;

    if (score >= 6) return 'strong';
    if (score >= 4) return 'medium';
    return 'weak';
  }

  /**
   * Determines if a key needs rotation
   */
  public needsRotation(config: ApiKeyConfiguration): boolean {
    if (!config.lastRotated) return true;

    const lastRotated = new Date(config.lastRotated);
    const rotationInterval = this.ROTATION_INTERVALS[config.serviceName.toLowerCase() as keyof typeof this.ROTATION_INTERVALS] 
      || this.ROTATION_INTERVALS.default;
    
    const nextRotationDate = new Date(lastRotated);
    nextRotationDate.setDate(nextRotationDate.getDate() + rotationInterval);

    return new Date() >= nextRotationDate;
  }

  /**
   * Calculates the next rotation date
   */
  public getNextRotationDate(serviceName: string, lastRotated: Date = new Date()): Date {
    const interval = this.ROTATION_INTERVALS[serviceName.toLowerCase() as keyof typeof this.ROTATION_INTERVALS] 
      || this.ROTATION_INTERVALS.default;
    
    const nextDate = new Date(lastRotated);
    nextDate.setDate(nextDate.getDate() + interval);
    return nextDate;
  }

  /**
   * Validates multiple keys at startup
   */
  public async validateConfiguredKeys(configs: ApiKeyConfiguration[]): Promise<{
    valid: ApiKeyConfiguration[];
    invalid: Array<ApiKeyConfiguration & { error: string }>;
    needsRotation: ApiKeyConfiguration[];
  }> {
    const valid: ApiKeyConfiguration[] = [];
    const invalid: Array<ApiKeyConfiguration & { error: string }> = [];
    const needsRotation: ApiKeyConfiguration[] = [];

    for (const config of configs) {
      // Note: We can't validate the actual key value here since it's stored securely
      // This would validate configuration completeness
      
      if (!config.serviceName || !config.keyName) {
        invalid.push({
          ...config,
          error: 'Missing service name or key name'
        });
        continue;
      }

      if (this.needsRotation(config)) {
        needsRotation.push(config);
      }

      valid.push(config);
    }

    return { valid, invalid, needsRotation };
  }

  /**
   * Generates rotation recommendations
   */
  public getRotationRecommendations(configs: ApiKeyConfiguration[]): Array<{
    config: ApiKeyConfiguration;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    recommendedAction: string;
  }> {
    return configs.map(config => {
      const daysSinceRotation = config.lastRotated 
        ? Math.floor((Date.now() - new Date(config.lastRotated).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      const rotationInterval = this.ROTATION_INTERVALS[config.serviceName.toLowerCase() as keyof typeof this.ROTATION_INTERVALS] 
        || this.ROTATION_INTERVALS.default;

      let priority: 'high' | 'medium' | 'low' = 'low';
      let reason = '';
      let recommendedAction = '';

      if (config.status === 'compromised') {
        priority = 'high';
        reason = 'Key marked as compromised';
        recommendedAction = 'Rotate immediately';
      } else if (daysSinceRotation > rotationInterval + 30) {
        priority = 'high';
        reason = `Key is ${daysSinceRotation - rotationInterval} days overdue for rotation`;
        recommendedAction = 'Rotate within 24 hours';
      } else if (daysSinceRotation > rotationInterval) {
        priority = 'medium';
        reason = `Key is ${daysSinceRotation - rotationInterval} days overdue for rotation`;
        recommendedAction = 'Schedule rotation within a week';
      } else if (daysSinceRotation > rotationInterval - 7) {
        priority = 'low';
        reason = 'Key rotation due soon';
        recommendedAction = 'Plan rotation for next maintenance window';
      }

      return {
        config,
        priority,
        reason,
        recommendedAction
      };
    }).filter(rec => rec.reason); // Only return items that need attention
  }

  /**
   * Masks sensitive key for logging/display
   */
  public maskApiKey(key: string): string {
    if (!key || key.length < 8) return '***';
    
    const visibleChars = 4;
    const start = key.substring(0, visibleChars);
    const end = key.substring(key.length - visibleChars);
    const masked = '*'.repeat(Math.max(8, key.length - (visibleChars * 2)));
    
    return `${start}${masked}${end}`;
  }
}

export const secretKeyManager = new SecretKeyManager();

/**
 * Hook for startup key validation
 */
export async function validateStartupKeys(): Promise<{
  success: boolean;
  warnings: string[];
  errors: string[];
}> {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // This would fetch configurations from the database
    // For now, we'll simulate some checks
    
    const requiredServices = ['stripe', 'openai'];
    const configuredServices: string[] = []; // This would come from env/database
    
    for (const service of requiredServices) {
      if (!configuredServices.includes(service)) {
        warnings.push(`${service} API key not configured`);
      }
    }

    return {
      success: errors.length === 0,
      warnings,
      errors
    };
  } catch (error) {
    errors.push(`Failed to validate startup keys: ${error}`);
    return {
      success: false,
      warnings,
      errors
    };
  }
}