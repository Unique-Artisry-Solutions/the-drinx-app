
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with anon key (for auth) and service role key (for database operations)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Get the client for checking auth
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get request body
    const { items, userId, contactInfo } = await req.json();
    
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !userData.user) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Use service role client for database operations (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Process items and create attendees for events and swig circuits
    const results = [];
    
    for (const item of items) {
      if (item.type === 'event_ticket') {
        // Generate unique ticket code
        const ticketCode = generateTicketCode(item.eventId);
        
        // Create attendee record
        const { data, error } = await adminClient
          .from('event_attendees')
          .insert({
            event_id: item.eventId,
            user_id: userData.user.id,
            ticket_type_id: item.ticketTypeId,
            status: 'registered',
            email: contactInfo.email || userData.user.email,
            name: contactInfo.name || null,
            ticket_code: ticketCode,
            quantity: item.quantity || 1
          })
          .select()
          .single();
          
        if (error) {
          results.push({ 
            item_id: item.id, 
            success: false, 
            error: error.message 
          });
        } else {
          results.push({ 
            item_id: item.id, 
            success: true, 
            ticket_code: ticketCode,
            attendee_id: data.id
          });
        }
      } 
      else if (item.type === 'swig_circuit_ticket') {
        // Similar process for swig circuit tickets
        const { data, error } = await adminClient
          .from('swig_circuit_attendees') // Assuming this table exists
          .insert({
            swig_circuit_id: item.swigCircuitId,
            user_id: userData.user.id,
            ticket_type_id: item.ticketTypeId,
            status: 'registered',
            quantity: item.quantity || 1
          })
          .select()
          .single();
          
        if (error) {
          results.push({ 
            item_id: item.id, 
            success: false, 
            error: error.message 
          });
        } else {
          results.push({ 
            item_id: item.id, 
            success: true,
            attendee_id: data.id
          });
        }
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Tickets processed successfully",
      results 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Helper function to generate a ticket code
function generateTicketCode(eventId: string): string {
  const prefix = eventId.slice(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${random}-${timestamp}`;
}
