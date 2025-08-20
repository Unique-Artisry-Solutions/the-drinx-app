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
    const { testId } = await req.json();
    
    if (!testId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'testId is required'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create Supabase client with service role key for full access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const cleanupResults: Record<string, number> = {};

    // Clean up payment transactions with matching test_id in metadata
    try {
      const { error: paymentError, count: paymentCount } = await supabaseAdmin
        .from('payment_transactions')
        .delete()
        .contains('metadata', { test_id: testId });

      cleanupResults.payment_transactions = paymentCount || 0;
      
      if (paymentError) {
        console.error('Error cleaning payment transactions:', paymentError);
      }
    } catch (error) {
      console.error('Failed to cleanup payment transactions:', error);
      cleanupResults.payment_transactions_error = error.message;
    }

    // Clean up establishments with test names
    try {
      const { error: estError, count: estCount } = await supabaseAdmin
        .from('establishments')
        .delete()
        .ilike('name', `%${testId}%`);

      cleanupResults.establishments = estCount || 0;
      
      if (estError) {
        console.error('Error cleaning establishments:', estError);
      }
    } catch (error) {
      console.error('Failed to cleanup establishments:', error);
      cleanupResults.establishments_error = error.message;
    }

    // Clean up cocktails with test names
    try {
      const { error: cocktailError, count: cocktailCount } = await supabaseAdmin
        .from('cocktails')
        .delete()
        .ilike('name', `%${testId}%`);

      cleanupResults.cocktails = cocktailCount || 0;
      
      if (cocktailError) {
        console.error('Error cleaning cocktails:', cocktailError);
      }
    } catch (error) {
      console.error('Failed to cleanup cocktails:', error);
      cleanupResults.cocktails_error = error.message;
    }

    // Clean up payment refunds related to test transactions
    try {
      // First find transactions with the test_id
      const { data: testTransactions } = await supabaseAdmin
        .from('payment_transactions')
        .select('id')
        .contains('metadata', { test_id: testId });

      if (testTransactions && testTransactions.length > 0) {
        const transactionIds = testTransactions.map(t => t.id);
        
        const { error: refundError, count: refundCount } = await supabaseAdmin
          .from('payment_refunds')
          .delete()
          .in('transaction_id', transactionIds);

        cleanupResults.payment_refunds = refundCount || 0;
        
        if (refundError) {
          console.error('Error cleaning payment refunds:', refundError);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup payment refunds:', error);
      cleanupResults.payment_refunds_error = error.message;
    }

    // Clean up any other test data that might have been created
    const tablesToClean = [
      'cocktail_reviews',
      'reward_transactions', 
      'user_rewards',
      'analytics_events'
    ];

    for (const table of tablesToClean) {
      try {
        // Check if table exists and has metadata column
        const { data: tableData, error: selectError } = await supabaseAdmin
          .from(table)
          .select('id')
          .limit(1);

        if (!selectError) {
          // Try to clean based on metadata if it exists
          try {
            const { error: cleanError, count: cleanCount } = await supabaseAdmin
              .from(table)
              .delete()
              .contains('metadata', { test_id: testId });

            if (!cleanError) {
              cleanupResults[table] = cleanCount || 0;
            }
          } catch (metadataError) {
            // If metadata approach fails, try name-based cleanup for some tables
            if (table === 'cocktail_reviews') {
              const { error: reviewError, count: reviewCount } = await supabaseAdmin
                .from(table)
                .delete()
                .ilike('text', `%${testId}%`);

              if (!reviewError) {
                cleanupResults[table] = reviewCount || 0;
              }
            }
          }
        }
      } catch (error) {
        console.log(`Skipping cleanup for ${table}:`, error.message);
      }
    }

    const totalCleaned = Object.values(cleanupResults)
      .filter(val => typeof val === 'number')
      .reduce((sum, count) => sum + count, 0);

    console.log(`Cleanup completed for testId ${testId}:`, cleanupResults);

    return new Response(JSON.stringify({
      success: true,
      testId,
      cleanupResults,
      totalRecordsCleaned: totalCleaned,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Cleanup test data error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});