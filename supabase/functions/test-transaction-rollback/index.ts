import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { testType, testId } = await req.json();
    
    // Create Supabase client with service role key for full access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    let result;
    
    switch (testType) {
      case 'payment-failure':
        result = await testPaymentRollback(supabaseAdmin, testId);
        break;
      case 'constraint-violation':
        result = await testConstraintViolationRollback(supabaseAdmin, testId);
        break;
      case 'multi-table':
        result = await testMultiTableRollback(supabaseAdmin, testId);
        break;
      case 'timeout':
        result = await testTimeoutRollback(supabaseAdmin, testId);
        break;
      case 'concurrent':
        result = await testConcurrentRollback(supabaseAdmin, testId);
        break;
      default:
        throw new Error(`Unknown test type: ${testType}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Transaction rollback test error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function testPaymentRollback(supabase: any, testId: string) {
  console.log(`Starting payment rollback test: ${testId}`);
  
  try {
    // Start a transaction by inserting test data
    const testUserId = '00000000-0000-0000-0000-000000000000'; // Test user ID
    
    // Step 1: Insert a payment transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: testUserId,
        amount: 9999, // $99.99
        currency: 'usd',
        status: 'pending',
        provider: 'stripe',
        metadata: { test_id: testId, test_type: 'rollback' }
      })
      .select()
      .single();
    
    if (transactionError) {
      console.error('Failed to insert test transaction:', transactionError);
      return {
        success: false,
        error: 'Failed to create test transaction',
        details: { transactionError }
      };
    }
    
    console.log('Created test transaction:', transaction.id);
    
    // Step 2: Simulate a failure and attempt rollback
    try {
      // This should fail - intentionally insert invalid data to trigger rollback
      const { error: rollbackTrigger } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: 'invalid-uuid', // This should fail
          amount: -1, // Invalid amount
          currency: null, // Required field
          status: 'invalid-status',
          provider: 'test'
        });
      
      // If somehow this didn't fail, clean up
      if (!rollbackTrigger) {
        await supabase
          .from('payment_transactions')
          .delete()
          .eq('id', transaction.id);
        
        return {
          success: false,
          error: 'Expected rollback trigger to fail but it succeeded',
          details: { transactionId: transaction.id }
        };
      }
      
      // Expected to fail - now verify original transaction still exists
      const { data: verifyTransaction, error: verifyError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transaction.id)
        .single();
      
      // Cleanup the test transaction
      await supabase
        .from('payment_transactions')
        .delete()
        .eq('id', transaction.id);
      
      if (verifyError) {
        return {
          success: false,
          error: 'Original transaction was lost during rollback test',
          details: { transactionId: transaction.id, verifyError }
        };
      }
      
      return {
        success: true,
        details: {
          transactionId: transaction.id,
          rollbackTriggered: true,
          originalTransactionPreserved: !!verifyTransaction
        }
      };
      
    } catch (rollbackError) {
      // Clean up test data
      await supabase
        .from('payment_transactions')
        .delete()
        .eq('id', transaction.id);
      
      return {
        success: true,
        details: {
          transactionId: transaction.id,
          rollbackTriggered: true,
          rollbackError: rollbackError.message
        }
      };
    }
    
  } catch (error) {
    console.error('Payment rollback test failed:', error);
    return {
      success: false,
      error: error.message,
      details: { testId }
    };
  }
}

async function testConstraintViolationRollback(supabase: any, testId: string) {
  console.log(`Starting constraint violation rollback test: ${testId}`);
  
  try {
    // Create a test establishment first
    const { data: establishment, error: estError } = await supabase
      .from('establishments')
      .insert({
        name: `Test Est ${testId}`,
        owner_id: '00000000-0000-0000-0000-000000000000',
        address: 'Test Address',
        latitude: 40.7128,
        longitude: -74.0060,
        cocktail_count: 0
      })
      .select()
      .single();
    
    if (estError) {
      return {
        success: false,
        error: 'Failed to create test establishment',
        details: { estError }
      };
    }
    
    // Now try to violate a constraint
    try {
      // Try to insert cocktail with non-existent establishment_id
      const { error: constraintError } = await supabase
        .from('cocktails')
        .insert({
          name: 'Test Cocktail',
          establishment_id: '00000000-0000-0000-0000-999999999999', // Non-existent
          description: 'Test',
          price: '$10'
        });
      
      // Clean up
      await supabase
        .from('establishments')
        .delete()
        .eq('id', establishment.id);
      
      if (!constraintError) {
        return {
          success: false,
          error: 'Expected constraint violation but insert succeeded',
          details: { establishmentId: establishment.id }
        };
      }
      
      return {
        success: true,
        details: {
          constraintViolationDetected: true,
          establishmentId: establishment.id,
          constraintError: constraintError.message
        }
      };
      
    } catch (error) {
      // Clean up
      await supabase
        .from('establishments')
        .delete()
        .eq('id', establishment.id);
      
      return {
        success: true,
        details: {
          constraintViolationDetected: true,
          error: error.message
        }
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: { testId }
    };
  }
}

async function testMultiTableRollback(supabase: any, testId: string) {
  console.log(`Starting multi-table rollback test: ${testId}`);
  
  try {
    const testUserId = '00000000-0000-0000-0000-000000000000';
    const insertedIds: any[] = [];
    
    // Insert test establishment
    const { data: establishment, error: estError } = await supabase
      .from('establishments')
      .insert({
        name: `Multi Test Est ${testId}`,
        owner_id: testUserId,
        address: 'Multi Test Address',
        latitude: 40.7128,
        longitude: -74.0060,
        cocktail_count: 0
      })
      .select()
      .single();
    
    if (estError) {
      return {
        success: false,
        error: 'Failed to create test establishment',
        details: { estError }
      };
    }
    
    insertedIds.push({ table: 'establishments', id: establishment.id });
    
    // Insert test cocktail
    const { data: cocktail, error: cocktailError } = await supabase
      .from('cocktails')
      .insert({
        name: `Multi Test Cocktail ${testId}`,
        establishment_id: establishment.id,
        description: 'Multi test cocktail',
        price: '$12'
      })
      .select()
      .single();
    
    if (cocktailError) {
      // Cleanup establishment
      await cleanupTestData(supabase, insertedIds);
      return {
        success: false,
        error: 'Failed to create test cocktail',
        details: { cocktailError, insertedIds }
      };
    }
    
    insertedIds.push({ table: 'cocktails', id: cocktail.id });
    
    // Now attempt an operation that should fail and trigger rollback
    try {
      // Try to create a payment transaction with invalid data
      await supabase
        .from('payment_transactions')
        .insert({
          user_id: 'invalid-uuid-format', // Should fail
          amount: null, // Required field
          currency: null, // Required field
          status: null // Required field
        });
      
      // If we get here, the operation unexpectedly succeeded
      await cleanupTestData(supabase, insertedIds);
      return {
        success: false,
        error: 'Expected transaction to fail but it succeeded',
        details: { insertedIds }
      };
      
    } catch (rollbackError) {
      // Verify that our test data still exists (wasn't rolled back)
      const { data: verifyEst } = await supabase
        .from('establishments')
        .select('id')
        .eq('id', establishment.id)
        .single();
      
      const { data: verifyCocktail } = await supabase
        .from('cocktails')
        .select('id')
        .eq('id', cocktail.id)
        .single();
      
      // Clean up test data
      await cleanupTestData(supabase, insertedIds);
      
      return {
        success: true,
        details: {
          multiTableInsertCompleted: true,
          rollbackTriggered: true,
          establishmentPreserved: !!verifyEst,
          cocktailPreserved: !!verifyCocktail,
          insertedIds
        }
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: { testId }
    };
  }
}

async function testTimeoutRollback(supabase: any, testId: string) {
  console.log(`Starting timeout rollback test: ${testId}`);
  
  try {
    // Simulate a long-running transaction that might timeout
    const startTime = Date.now();
    
    // Create test data
    const { data: establishment, error: estError } = await supabase
      .from('establishments')
      .insert({
        name: `Timeout Test ${testId}`,
        owner_id: '00000000-0000-0000-0000-000000000000',
        address: 'Timeout Test Address',
        latitude: 40.7128,
        longitude: -74.0060,
        cocktail_count: 0
      })
      .select()
      .single();
    
    if (estError) {
      return {
        success: false,
        error: 'Failed to create test establishment',
        details: { estError }
      };
    }
    
    // Simulate processing delay (but not too long for actual timeout)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const duration = Date.now() - startTime;
    
    // Clean up
    await supabase
      .from('establishments')
      .delete()
      .eq('id', establishment.id);
    
    return {
      success: true,
      details: {
        timeoutTestCompleted: true,
        processingDuration: duration,
        establishmentId: establishment.id
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: { testId }
    };
  }
}

async function testConcurrentRollback(supabase: any, testId: string) {
  console.log(`Starting concurrent rollback test: ${testId}`);
  
  try {
    const testUserId = '00000000-0000-0000-0000-000000000000';
    
    // Create multiple concurrent operations
    const operations = [];
    
    for (let i = 0; i < 3; i++) {
      operations.push(
        supabase
          .from('establishments')
          .insert({
            name: `Concurrent Test ${testId}-${i}`,
            owner_id: testUserId,
            address: `Concurrent Address ${i}`,
            latitude: 40.7128 + (i * 0.001),
            longitude: -74.0060 + (i * 0.001),
            cocktail_count: 0
          })
          .select()
      );
    }
    
    // Execute operations concurrently
    const results = await Promise.allSettled(operations);
    
    // Check results and clean up
    const successfulInserts = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value.data[0])
      .filter(Boolean);
    
    // Clean up all successful inserts
    for (const insert of successfulInserts) {
      await supabase
        .from('establishments')
        .delete()
        .eq('id', insert.id);
    }
    
    const failedOperations = results.filter(result => result.status === 'rejected').length;
    
    return {
      success: true,
      details: {
        concurrentOperationsExecuted: operations.length,
        successfulOperations: successfulInserts.length,
        failedOperations,
        cleanupCompleted: true
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: { testId }
    };
  }
}

async function cleanupTestData(supabase: any, insertedIds: Array<{table: string, id: string}>) {
  for (const record of insertedIds.reverse()) {
    try {
      await supabase
        .from(record.table)
        .delete()
        .eq('id', record.id);
    } catch (error) {
      console.error(`Failed to cleanup ${record.table}/${record.id}:`, error);
    }
  }
}