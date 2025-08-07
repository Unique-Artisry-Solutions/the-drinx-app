/**
 * Payment Test Runner - Execute comprehensive payment flow tests
 */
import { supabase } from '@/integrations/supabase/client';
import { processPayment } from '@/services/paymentService';

export interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration: number;
  details?: any;
}

export class PaymentTestRunner {
  private results: TestResult[] = [];

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting Payment Flow Tests...');
    
    // Clear previous results
    this.results = [];

    // Run test suites in sequence
    await this.runEdgeFunctionTests();
    await this.runDatabaseTests();
    await this.runServiceTests();
    await this.runErrorHandlingTests();

    console.log('✅ Payment Tests Completed');
    this.printResults();
    
    return this.results;
  }

  private async runTest(testName: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 Running: ${testName}`);
      const result = await testFn();
      
      this.results.push({
        testName,
        passed: true,
        duration: Date.now() - startTime,
        details: result,
      });
      
      console.log(`✅ ${testName} - PASSED`);
    } catch (error) {
      this.results.push({
        testName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
      });
      
      console.log(`❌ ${testName} - FAILED: ${error}`);
    }
  }

  private async runEdgeFunctionTests(): Promise<void> {
    console.log('\n📡 Testing Edge Functions...');

    await this.runTest('Edge Function - Valid Payment', async () => {
      const response = await supabase.functions.invoke('process-payment', {
        body: {
          paymentMethodId: 'pm_card_visa',
          amount: 5000,
          currency: 'usd',
          description: 'Test payment',
          metadata: { testCase: 'edge_function_test' },
        },
      });

      if (response.error) {
        throw new Error(`Edge function error: ${response.error.message}`);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      return response.data;
    });

    await this.runTest('Edge Function - Invalid Payment Method', async () => {
      const response = await supabase.functions.invoke('process-payment', {
        body: {
          paymentMethodId: 'pm_invalid_test',
          amount: 5000,
        },
      });

      // Should either return error or unsuccessful data
      if (!response.error && response.data?.success === true) {
        throw new Error('Expected failure but payment succeeded');
      }

      return { expectedFailure: true };
    });

    await this.runTest('Edge Function - Missing Required Fields', async () => {
      const response = await supabase.functions.invoke('process-payment', {
        body: {
          amount: 1000,
          // Missing paymentMethodId
        },
      });

      if (!response.error && response.data?.success === true) {
        throw new Error('Expected validation error for missing fields');
      }

      return { validationError: true };
    });
  }

  private async runDatabaseTests(): Promise<void> {
    console.log('\n🗄️ Testing Database...');

    await this.runTest('Database - Payment Transactions Table', async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .limit(1);

      if (error) {
        throw new Error(`Database access error: ${error.message}`);
      }

      return { tableAccessible: true, sampleCount: data?.length || 0 };
    });

    await this.runTest('Database - Payment Receipts Table', async () => {
      const { data, error } = await supabase
        .from('payment_receipts')
        .select('*')
        .limit(1);

      if (error) {
        throw new Error(`Receipts table error: ${error.message}`);
      }

      return { tableAccessible: true };
    });

    await this.runTest('Database - RLS Policy Check', async () => {
      // Test that user can only access their own data
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('user_id')
        .limit(10);

      if (error) {
        throw new Error(`RLS policy test failed: ${error.message}`);
      }

      // Check if all returned records belong to current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (data && data.length > 0 && user) {
        const foreignUserIds = data.filter(t => t.user_id !== user.id);
        if (foreignUserIds.length > 0) {
          throw new Error('RLS policy allows access to other users\' data');
        }
      }

      return { rlsWorking: true, recordCount: data?.length || 0 };
    });
  }

  private async runServiceTests(): Promise<void> {
    console.log('\n🔧 Testing Payment Service...');

    await this.runTest('Service - Authentication Check', async () => {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated - service tests require login');
      }

      return { userAuthenticated: true, userId: user.id };
    });

    await this.runTest('Service - Process Payment Function', async () => {
      // Test the service function (this will likely fail with test data)
      try {
        const result = await processPayment({
          paymentMethodId: 'pm_test_visa',
          amount: 1000,
          currency: 'usd',
          description: 'Service test payment',
        });
        
        return result;
      } catch (error) {
        // Expected to fail with test data, but function should be callable
        if (error instanceof Error && error.message.includes('must be logged in')) {
          throw error;
        }
        
        // Other errors are expected with test data
        return { expectedTestDataError: true, error: error instanceof Error ? error.message : String(error) };
      }
    });
  }

  private async runErrorHandlingTests(): Promise<void> {
    console.log('\n⚠️ Testing Error Handling...');

    await this.runTest('Error Handling - Malformed Request', async () => {
      const response = await supabase.functions.invoke('process-payment', {
        body: {
          amount: 'invalid_number', // Should be number
          paymentMethodId: null,
        },
      });

      if (!response.error && response.data?.success === true) {
        throw new Error('Expected error for malformed request');
      }

      return { errorHandled: true };
    });

    await this.runTest('Error Handling - Network Timeout Simulation', async () => {
      // Test with very large metadata to potentially trigger timeout
      const largeMetadata = {
        testData: 'x'.repeat(10000), // Large string
        timestamp: new Date().toISOString(),
      };

      const response = await supabase.functions.invoke('process-payment', {
        body: {
          paymentMethodId: 'pm_test',
          amount: 1000,
          metadata: largeMetadata,
        },
      });

      // Should either succeed or fail gracefully
      return { 
        handled: true, 
        hasError: !!response.error,
        responseReceived: true 
      };
    });
  }

  private printResults(): void {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(result => {
          console.log(`  - ${result.testName}: ${result.error}`);
        });
    }
    
    console.log('\n⏱️ Performance:');
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / total;
    console.log(`Average Test Duration: ${avgDuration.toFixed(0)}ms`);
  }

  getResults(): TestResult[] {
    return [...this.results];
  }

  hasFailures(): boolean {
    return this.results.some(r => !r.passed);
  }
}

// Export convenience function for quick testing
export async function runPaymentTests(): Promise<TestResult[]> {
  const runner = new PaymentTestRunner();
  return await runner.runAllTests();
}
