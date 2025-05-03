
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Simple function that returns a success response to verify the connection is working
serve(async (req) => {
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Connection successful', 
      timestamp: new Date().toISOString() 
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    },
  )
})
