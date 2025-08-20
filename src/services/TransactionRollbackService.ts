import { supabase } from '@/integrations/supabase/client';

export interface RollbackTestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: Record<string, any>;
}

export interface RollbackTestScenario {
  id: string;
  name: string;
  description: string;
  testFunction: () => Promise<RollbackTestResult>;
}

export class TransactionRollbackService {
  private scenarios: RollbackTestScenario[] = [
    {
      id: 'payment-failure',
      name: 'Payment Transaction Rollback',
      description: 'Test rollback when payment processing fails',
      testFunction: this.testPaymentRollback.bind(this)
    },
    {
      id: 'database-constraint',
      name: 'Database Constraint Violation',
      description: 'Test rollback on constraint violations',
      testFunction: this.testConstraintViolationRollback.bind(this)
    },
    {
      id: 'multi-table-rollback',
      name: 'Multi-Table Transaction Rollback',
      description: 'Test complex transaction rollback across multiple tables',
      testFunction: this.testMultiTableRollback.bind(this)
    },
    {
      id: 'timeout-rollback',
      name: 'Transaction Timeout Rollback',
      description: 'Test rollback on transaction timeout',
      testFunction: this.testTimeoutRollback.bind(this)
    },
    {
      id: 'concurrent-rollback',
      name: 'Concurrent Transaction Rollback',
      description: 'Test rollback with concurrent operations',
      testFunction: this.testConcurrentRollback.bind(this)
    }
  ];

  getScenarios(): RollbackTestScenario[] {
    return this.scenarios;
  }

  async runAllTests(): Promise<RollbackTestResult[]> {
    const results: RollbackTestResult[] = [];
    
    for (const scenario of this.scenarios) {
      try {
        const result = await scenario.testFunction();
        results.push(result);
      } catch (error) {
        results.push({
          id: scenario.id,
          name: scenario.name,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  async runTest(scenarioId: string): Promise<RollbackTestResult> {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error(`Test scenario not found: ${scenarioId}`);
    }
    
    return await scenario.testFunction();
  }

  private async testPaymentRollback(): Promise<RollbackTestResult> {
    const startTime = Date.now();
    const testId = `test-${Date.now()}`;
    
    try {
      // Call rollback test edge function
      const { data, error } = await supabase.functions.invoke('test-transaction-rollback', {
        body: {
          testType: 'payment-failure',
          testId
        }
      });
      
      if (error) {
        return {
          id: 'payment-failure',
          name: 'Payment Transaction Rollback',
          status: 'failed',
          duration: Date.now() - startTime,
          error: error.message,
          details: { testId, errorData: error }
        };
      }
      
      return {
        id: 'payment-failure',
        name: 'Payment Transaction Rollback',
        status: data.success ? 'passed' : 'failed',
        duration: Date.now() - startTime,
        error: data.error || undefined,
        details: { testId, ...data.details }
      };
    } catch (error) {
      return {
        id: 'payment-failure',
        name: 'Payment Transaction Rollback',
        status: 'failed',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testConstraintViolationRollback(): Promise<RollbackTestResult> {
    const startTime = Date.now();
    const testId = `constraint-test-${Date.now()}`;
    
    try {
      const { data, error } = await supabase.functions.invoke('test-transaction-rollback', {
        body: {
          testType: 'constraint-violation',
          testId
        }
      });
      
      if (error) {
        return {
          id: 'database-constraint',
          name: 'Database Constraint Violation',
          status: 'failed',
          duration: Date.now() - startTime,
          error: error.message
        };
      }
      
      return {
        id: 'database-constraint',
        name: 'Database Constraint Violation',
        status: data.success ? 'passed' : 'failed',
        duration: Date.now() - startTime,
        error: data.error || undefined,
        details: data.details
      };
    } catch (error) {
      return {
        id: 'database-constraint',
        name: 'Database Constraint Violation',
        status: 'failed',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testMultiTableRollback(): Promise<RollbackTestResult> {
    const startTime = Date.now();
    const testId = `multi-table-${Date.now()}`;
    
    try {
      const { data, error } = await supabase.functions.invoke('test-transaction-rollback', {
        body: {
          testType: 'multi-table',
          testId
        }
      });
      
      if (error) {
        return {
          id: 'multi-table-rollback',
          name: 'Multi-Table Transaction Rollback',
          status: 'failed',
          duration: Date.now() - startTime,
          error: error.message
        };
      }
      
      return {
        id: 'multi-table-rollback',
        name: 'Multi-Table Transaction Rollback',
        status: data.success ? 'passed' : 'failed',
        duration: Date.now() - startTime,
        error: data.error || undefined,
        details: data.details
      };
    } catch (error) {
      return {
        id: 'multi-table-rollback',
        name: 'Multi-Table Transaction Rollback',
        status: 'failed',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testTimeoutRollback(): Promise<RollbackTestResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('test-transaction-rollback', {
        body: {
          testType: 'timeout',
          testId: `timeout-${Date.now()}`
        }
      });
      
      if (error) {
        return {
          id: 'timeout-rollback',
          name: 'Transaction Timeout Rollback',
          status: 'failed',
          duration: Date.now() - startTime,
          error: error.message
        };
      }
      
      return {
        id: 'timeout-rollback',
        name: 'Transaction Timeout Rollback',
        status: data.success ? 'passed' : 'failed',
        duration: Date.now() - startTime,
        error: data.error || undefined,
        details: data.details
      };
    } catch (error) {
      return {
        id: 'timeout-rollback',
        name: 'Transaction Timeout Rollback',
        status: 'failed',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testConcurrentRollback(): Promise<RollbackTestResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('test-transaction-rollback', {
        body: {
          testType: 'concurrent',
          testId: `concurrent-${Date.now()}`
        }
      });
      
      if (error) {
        return {
          id: 'concurrent-rollback',
          name: 'Concurrent Transaction Rollback',
          status: 'failed',
          duration: Date.now() - startTime,
          error: error.message
        };
      }
      
      return {
        id: 'concurrent-rollback',
        name: 'Concurrent Transaction Rollback',
        status: data.success ? 'passed' : 'failed',
        duration: Date.now() - startTime,
        error: data.error || undefined,
        details: data.details
      };
    } catch (error) {
      return {
        id: 'concurrent-rollback',
        name: 'Concurrent Transaction Rollback',
        status: 'failed',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async validateDatabaseIntegrity(): Promise<{
    isValid: boolean;
    issues: string[];
    details: Record<string, any>;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('validate-database-integrity');
      
      if (error) {
        return {
          isValid: false,
          issues: [error.message],
          details: { error }
        };
      }
      
      return data;
    } catch (error) {
      return {
        isValid: false,
        issues: [error instanceof Error ? error.message : 'Unknown error'],
        details: { error }
      };
    }
  }

  async cleanupTestData(testId: string): Promise<void> {
    try {
      await supabase.functions.invoke('cleanup-test-data', {
        body: { testId }
      });
    } catch (error) {
      console.error('Failed to cleanup test data:', error);
    }
  }
}

export const transactionRollbackService = new TransactionRollbackService();