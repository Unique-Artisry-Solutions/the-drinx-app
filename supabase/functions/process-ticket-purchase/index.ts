
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";
import { corsHeaders } from "../_shared/cors.ts";

interface User {
  id: string;
}

interface ContactInfo {
  name: string;
  email: string;
}

interface TicketItem {
  id: string;
  type: string;
  name: string;
  price: number;
  quantity?: number;
  eventId?: string;
  date?: string;
  time?: string;
  venue?: string;
}

interface TicketPurchaseRequest {
  items: TicketItem[];
  userId: string | null;
  serviceFee: number;
  serviceFeePercentage: number;
  contactInfo: ContactInfo;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: TicketPurchaseRequest = await req.json();
    
    const { items, userId, serviceFee, serviceFeePercentage, contactInfo } = body;
    
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No items provided" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Calculate subtotal
    const subtotal = items.reduce((total, item) => {
      if (item.quantity && item.quantity > 1) {
        return total + (item.price * item.quantity);
      }
      return total + item.price;
    }, 0);
    
    const totalWithFees = subtotal + serviceFee;
    
    // Process the tickets (in a real system, you'd integrate with a payment processor here)
    const purchaseRecords = [];
    
    for (const item of items) {
      // Create ticket purchase record
      const { data, error } = await supabase
        .from('ticket_purchases')
        .insert({
          user_id: userId,
          event_id: item.eventId,
          ticket_type: item.type,
          quantity: item.quantity || 1,
          price_per_ticket: item.price,
          total_amount: item.price * (item.quantity || 1),
          service_fee: (serviceFee / items.length), // Distribute service fee across items
          service_fee_percentage: serviceFeePercentage,
          contact_name: contactInfo.name,
          contact_email: contactInfo.email,
          payment_status: 'completed',
          purchase_details: {
            item_name: item.name,
            date: item.date,
            time: item.time,
            venue: item.venue
          }
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error processing ticket:", error);
        return new Response(
          JSON.stringify({ success: false, error: `Failed to process ticket: ${error.message}` }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500 
          }
        );
      }
      
      purchaseRecords.push(data);
    }
    
    // Track service fee for analytics
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'service_fee_collected',
        user_id: userId,
        event_data: {
          service_fee: serviceFee,
          service_fee_percentage: serviceFeePercentage,
          subtotal: subtotal,
          total_with_fees: totalWithFees,
          item_count: items.length
        }
      });
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Tickets processed successfully",
        data: { purchaseRecords }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
