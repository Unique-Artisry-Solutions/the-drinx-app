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
    // Create Supabase client with service role key for full access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const issues: string[] = [];
    const details: Record<string, any> = {};

    // Check 1: Orphaned records in payment_transactions
    try {
      const { data: orphanedTransactions, error } = await supabaseAdmin
        .from('payment_transactions')
        .select('id, user_id')
        .is('user_id', null);

      if (error) throw error;

      if (orphanedTransactions && orphanedTransactions.length > 0) {
        issues.push(`Found ${orphanedTransactions.length} payment transactions with null user_id`);
        details.orphanedTransactions = orphanedTransactions.length;
      }
    } catch (error) {
      issues.push(`Failed to check payment transactions: ${error.message}`);
    }

    // Check 2: Orphaned cocktails (no establishment)
    try {
      const { data: orphanedCocktails, error } = await supabaseAdmin
        .from('cocktails')
        .select(`
          id, 
          establishment_id,
          establishments!inner(id)
        `);

      if (error && !error.message.includes('could not find')) {
        throw error;
      }

      // Count cocktails that don't have corresponding establishments
      const { data: allCocktails } = await supabaseAdmin
        .from('cocktails')
        .select('id, establishment_id');

      const { data: allEstablishments } = await supabaseAdmin
        .from('establishments')
        .select('id');

      if (allCocktails && allEstablishments) {
        const establishmentIds = new Set(allEstablishments.map(e => e.id));
        const orphaned = allCocktails.filter(c => !establishmentIds.has(c.establishment_id));
        
        if (orphaned.length > 0) {
          issues.push(`Found ${orphaned.length} cocktails referencing non-existent establishments`);
          details.orphanedCocktails = orphaned.length;
        }
      }
    } catch (error) {
      issues.push(`Failed to check cocktail-establishment relationships: ${error.message}`);
    }

    // Check 3: Invalid payment transaction statuses
    try {
      const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
      const { data: invalidStatusTransactions, error } = await supabaseAdmin
        .from('payment_transactions')
        .select('id, status')
        .not('status', 'in', `(${validStatuses.map(s => `"${s}"`).join(',')})`);

      if (error) throw error;

      if (invalidStatusTransactions && invalidStatusTransactions.length > 0) {
        issues.push(`Found ${invalidStatusTransactions.length} payment transactions with invalid status values`);
        details.invalidStatusTransactions = invalidStatusTransactions.length;
      }
    } catch (error) {
      issues.push(`Failed to check payment transaction statuses: ${error.message}`);
    }

    // Check 4: Negative amounts in payment transactions
    try {
      const { data: negativeAmountTransactions, error } = await supabaseAdmin
        .from('payment_transactions')
        .select('id, amount')
        .lt('amount', 0);

      if (error) throw error;

      if (negativeAmountTransactions && negativeAmountTransactions.length > 0) {
        issues.push(`Found ${negativeAmountTransactions.length} payment transactions with negative amounts`);
        details.negativeAmountTransactions = negativeAmountTransactions.length;
      }
    } catch (error) {
      issues.push(`Failed to check payment transaction amounts: ${error.message}`);
    }

    // Check 5: Refunds exceeding original transaction amounts
    try {
      const { data: transactions, error: txError } = await supabaseAdmin
        .from('payment_transactions')
        .select(`
          id,
          amount,
          payment_refunds(
            id,
            amount,
            status
          )
        `);

      if (txError) throw txError;

      if (transactions) {
        let excessiveRefunds = 0;
        for (const tx of transactions) {
          if (tx.payment_refunds && tx.payment_refunds.length > 0) {
            const totalRefunded = tx.payment_refunds
              .filter((r: any) => r.status === 'completed')
              .reduce((sum: number, r: any) => sum + r.amount, 0);
            
            if (totalRefunded > tx.amount) {
              excessiveRefunds++;
            }
          }
        }

        if (excessiveRefunds > 0) {
          issues.push(`Found ${excessiveRefunds} transactions with refunds exceeding original amount`);
          details.excessiveRefunds = excessiveRefunds;
        }
      }
    } catch (error) {
      issues.push(`Failed to check refund amounts: ${error.message}`);
    }

    // Check 6: Duplicate establishment names for same owner
    try {
      const { data: duplicateNames, error } = await supabaseAdmin
        .from('establishments')
        .select('name, owner_id')
        .order('name');

      if (error) throw error;

      if (duplicateNames) {
        const nameOwnerCombos = new Map<string, number>();
        duplicateNames.forEach(est => {
          const key = `${est.name}-${est.owner_id}`;
          nameOwnerCombos.set(key, (nameOwnerCombos.get(key) || 0) + 1);
        });

        const duplicates = Array.from(nameOwnerCombos.entries()).filter(([_, count]) => count > 1);
        if (duplicates.length > 0) {
          issues.push(`Found ${duplicates.length} duplicate establishment names for the same owner`);
          details.duplicateEstablishmentNames = duplicates.length;
        }
      }
    } catch (error) {
      issues.push(`Failed to check duplicate establishment names: ${error.message}`);
    }

    // Check 7: Test data cleanup (look for test records that weren't cleaned up)
    try {
      const tables = ['establishments', 'cocktails', 'payment_transactions'];
      let testDataCount = 0;

      for (const table of tables) {
        try {
          const { data, error } = await supabaseAdmin
            .from(table)
            .select('id')
            .or('name.ilike.%test%,description.ilike.%test%,metadata->test_id.neq.null');

          if (!error && data) {
            testDataCount += data.length;
          }
        } catch (tableError) {
          // Some tables might not have the columns we're checking, ignore those errors
          console.log(`Skipping test data check for ${table}:`, tableError.message);
        }
      }

      if (testDataCount > 0) {
        issues.push(`Found ${testDataCount} potential test records that weren't cleaned up`);
        details.unremovedTestData = testDataCount;
      }
    } catch (error) {
      issues.push(`Failed to check for test data cleanup: ${error.message}`);
    }

    const result = {
      isValid: issues.length === 0,
      issues,
      details: {
        ...details,
        checkedAt: new Date().toISOString(),
        checksPerformed: 7
      }
    };

    console.log('Database integrity check completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Database integrity check error:', error);
    
    return new Response(JSON.stringify({
      isValid: false,
      issues: [`Integrity check failed: ${error.message}`],
      details: {
        error: error.message,
        checkedAt: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});