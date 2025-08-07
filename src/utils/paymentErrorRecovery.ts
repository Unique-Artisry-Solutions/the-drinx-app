import { PaymentError, PaymentErrorType, PaymentRecoveryAction } from '@/types/PaymentErrors';

export interface RecoveryStrategy {
  action: PaymentRecoveryAction;
  priority: number;
  description: string;
  userMessage: string;
  preventiveActions?: string[];
}

export interface RecoveryPlan {
  primary: RecoveryStrategy;
  alternatives: RecoveryStrategy[];
  preventiveActions: string[];
  estimatedRecoveryTime: number; // in minutes
}

export class PaymentErrorRecoveryService {
  private static readonly RECOVERY_STRATEGIES: Record<PaymentErrorType, RecoveryStrategy[]> = {
    [PaymentErrorType.CARD]: [
      {
        action: PaymentRecoveryAction.UPDATE_CARD,
        priority: 1,
        description: 'Update payment method with valid card details',
        userMessage: 'Please try a different payment method or check your card details',
        preventiveActions: [
          'Verify card is not expired',
          'Check if card supports online transactions',
          'Ensure sufficient funds available'
        ]
      },
      {
        action: PaymentRecoveryAction.CONTACT_SUPPORT,
        priority: 2,
        description: 'Contact bank or card issuer',
        userMessage: 'Contact your bank if the issue persists',
        preventiveActions: [
          'Check if card is blocked for international transactions',
          'Verify with bank for any spending limits'
        ]
      }
    ],
    [PaymentErrorType.NETWORK]: [
      {
        action: PaymentRecoveryAction.RETRY,
        priority: 1,
        description: 'Retry payment after network stabilizes',
        userMessage: 'Please check your connection and try again',
        preventiveActions: [
          'Use stable WiFi connection',
          'Disable VPN if causing issues',
          'Clear browser cache'
        ]
      }
    ],
    [PaymentErrorType.AUTHENTICATION]: [
      {
        action: PaymentRecoveryAction.LOGIN_REQUIRED,
        priority: 1,
        description: 'Re-authenticate user session',
        userMessage: 'Please log in again to continue',
        preventiveActions: [
          'Keep browser session active',
          'Enable "Remember me" option',
          'Use trusted devices'
        ]
      }
    ],
    [PaymentErrorType.SYSTEM]: [
      {
        action: PaymentRecoveryAction.RETRY,
        priority: 1,
        description: 'Wait and retry when system is available',
        userMessage: 'System temporarily unavailable. Please try again in a few minutes',
        preventiveActions: [
          'Check system status page',
          'Subscribe to service notifications'
        ]
      },
      {
        action: PaymentRecoveryAction.CONTACT_SUPPORT,
        priority: 2,
        description: 'Contact support for system issues',
        userMessage: 'Contact support if the problem continues',
        preventiveActions: []
      }
    ],
    [PaymentErrorType.VALIDATION]: [
      {
        action: PaymentRecoveryAction.CHECK_DETAILS,
        priority: 1,
        description: 'Correct validation errors in payment form',
        userMessage: 'Please review and correct the highlighted fields',
        preventiveActions: [
          'Double-check all required fields',
          'Ensure amount meets minimum requirements',
          'Verify currency is supported'
        ]
      }
    ],
    [PaymentErrorType.BUSINESS_RULE]: [
      {
        action: PaymentRecoveryAction.CHECK_DETAILS,
        priority: 1,
        description: 'Review payment against business rules',
        userMessage: 'Payment does not meet requirements. Please review the details',
        preventiveActions: [
          'Check payment limits',
          'Verify account status',
          'Review terms and conditions'
        ]
      },
      {
        action: PaymentRecoveryAction.CONTACT_SUPPORT,
        priority: 2,
        description: 'Contact support for rule clarification',
        userMessage: 'Contact support for assistance with payment requirements',
        preventiveActions: []
      }
    ]
  };

  static createRecoveryPlan(error: PaymentError): RecoveryPlan {
    const strategies = this.RECOVERY_STRATEGIES[error.type] || [];
    
    if (strategies.length === 0) {
      // Fallback strategy
      return {
        primary: {
          action: PaymentRecoveryAction.CONTACT_SUPPORT,
          priority: 1,
          description: 'Contact support for assistance',
          userMessage: 'Please contact support for help with this issue',
          preventiveActions: []
        },
        alternatives: [],
        preventiveActions: ['Contact customer support'],
        estimatedRecoveryTime: 30
      };
    }

    const [primary, ...alternatives] = strategies.sort((a, b) => a.priority - b.priority);
    
    return {
      primary,
      alternatives,
      preventiveActions: this.getAllPreventiveActions(strategies),
      estimatedRecoveryTime: this.estimateRecoveryTime(error)
    };
  }

  static generateRecoveryInstructions(error: PaymentError): string[] {
    const plan = this.createRecoveryPlan(error);
    const instructions: string[] = [];

    // Add primary recovery instruction
    instructions.push(`1. ${plan.primary.userMessage}`);

    // Add alternative instructions
    plan.alternatives.forEach((alt, index) => {
      instructions.push(`${index + 2}. ${alt.userMessage}`);
    });

    // Add preventive measures for future
    if (plan.preventiveActions.length > 0) {
      instructions.push('');
      instructions.push('To prevent this issue in the future:');
      plan.preventiveActions.forEach((action, index) => {
        instructions.push(`• ${action}`);
      });
    }

    return instructions;
  }

  static isRecoverable(error: PaymentError): boolean {
    return error.retryable || error.recoveryAction !== PaymentRecoveryAction.CONTACT_SUPPORT;
  }

  static shouldRetryAutomatically(error: PaymentError): boolean {
    return error.retryable && [
      PaymentErrorType.NETWORK,
      PaymentErrorType.SYSTEM
    ].includes(error.type);
  }

  static getRecoveryTimeEstimate(error: PaymentError): number {
    return this.estimateRecoveryTime(error);
  }

  private static getAllPreventiveActions(strategies: RecoveryStrategy[]): string[] {
    const allActions = strategies.flatMap(s => s.preventiveActions || []);
    return [...new Set(allActions)]; // Remove duplicates
  }

  private static estimateRecoveryTime(error: PaymentError): number {
    switch (error.type) {
      case PaymentErrorType.VALIDATION:
        return 2; // 2 minutes to correct form
      case PaymentErrorType.CARD:
        return 5; // 5 minutes to try different card
      case PaymentErrorType.NETWORK:
        return 3; // 3 minutes for network to stabilize
      case PaymentErrorType.AUTHENTICATION:
        return 2; // 2 minutes to log back in
      case PaymentErrorType.SYSTEM:
        return 15; // 15 minutes for system recovery
      case PaymentErrorType.BUSINESS_RULE:
        return 10; // 10 minutes to understand and resolve
      default:
        return 30; // 30 minutes for support contact
    }
  }
}

export const paymentErrorRecovery = PaymentErrorRecoveryService;

// Analytics helpers for error recovery tracking
export interface RecoveryAttempt {
  errorType: PaymentErrorType;
  recoveryAction: PaymentRecoveryAction;
  timestamp: Date;
  successful: boolean;
  timeToResolve?: number;
}

export class RecoveryAnalytics {
  private static attempts: RecoveryAttempt[] = [];

  static recordAttempt(attempt: RecoveryAttempt): void {
    this.attempts.push(attempt);
    
    // Keep only last 100 attempts to prevent memory issues
    if (this.attempts.length > 100) {
      this.attempts = this.attempts.slice(-100);
    }
  }

  static getSuccessRate(errorType?: PaymentErrorType): number {
    const relevantAttempts = errorType 
      ? this.attempts.filter(a => a.errorType === errorType)
      : this.attempts;
    
    if (relevantAttempts.length === 0) return 0;
    
    const successful = relevantAttempts.filter(a => a.successful).length;
    return successful / relevantAttempts.length;
  }

  static getAverageRecoveryTime(errorType?: PaymentErrorType): number {
    const relevantAttempts = (errorType 
      ? this.attempts.filter(a => a.errorType === errorType)
      : this.attempts
    ).filter(a => a.successful && a.timeToResolve);
    
    if (relevantAttempts.length === 0) return 0;
    
    const totalTime = relevantAttempts.reduce((sum, a) => sum + (a.timeToResolve || 0), 0);
    return totalTime / relevantAttempts.length;
  }

  static getMostEffectiveAction(errorType: PaymentErrorType): PaymentRecoveryAction | null {
    const typeAttempts = this.attempts.filter(a => a.errorType === errorType && a.successful);
    
    if (typeAttempts.length === 0) return null;
    
    const actionCounts = typeAttempts.reduce((counts, attempt) => {
      counts[attempt.recoveryAction] = (counts[attempt.recoveryAction] || 0) + 1;
      return counts;
    }, {} as Record<PaymentRecoveryAction, number>);
    
    return Object.entries(actionCounts).reduce((best, [action, count]) => 
      count > (actionCounts[best] || 0) ? action as PaymentRecoveryAction : best
    , Object.keys(actionCounts)[0] as PaymentRecoveryAction);
  }
}
