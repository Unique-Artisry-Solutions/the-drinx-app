import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'

interface RequestBody {
  action: 'seed' | 'clear';
  table_types?: string[];
  record_count?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  const origin = req.headers.get('origin')
  const securityConfig = getSecurityConfig('production')
  const secureHeaders = getCorsHeaders(origin, securityConfig)
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: secureHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, table_types = [], record_count = 10 }: RequestBody = await req.json()
    
    console.log(`Dev data seeding request: ${action}`)

    if (action === 'clear') {
      // Clear dev seed data
      const { data, error } = await supabaseClient.rpc('clear_dev_seed')
      
      if (error) {
        console.error('Clear dev seed error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to clear dev data' }),
          { status: 500, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, cleared: data }),
        { status: 200, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'seed') {
      // This is a placeholder for seeding functionality
      // In a real implementation, this would call various seed functions
      console.log(`Seeding data types: ${table_types.join(', ')} with ${record_count} records each`)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Seeding functionality not yet implemented',
          requested_types: table_types,
          record_count 
        }),
        { status: 200, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "seed" or "clear"' }),
      { status: 400, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Seed dev data error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
