
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
  swigCircuitId?: string;
  ticketTypeId?: string;
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
    
    // Generate ticket codes for event/circuit tickets
    const generateTicketCode = () => {
      return 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };
    
    // Process the tickets
    const purchaseRecords = [];
    const ticketCodes = [];
    
    for (const item of items) {
      const quantity = item.quantity || 1;
      
      // Generate ticket codes for each ticket
      for (let i = 0; i < quantity; i++) {
        let ticketCode = null;
        
        // Only generate ticket codes for event and circuit tickets
        if (item.type === 'event_ticket' || item.type === 'swig_circuit_ticket') {
          ticketCode = generateTicketCode();
          ticketCodes.push(ticketCode);
        }
        
        // Create ticket purchase record
        const { data, error } = await supabase
          .from('ticket_purchases')
          .insert({
            user_id: userId,
            event_id: item.eventId || null,
            swig_circuit_id: item.swigCircuitId || null,
            ticket_type_id: item.ticketTypeId || null,
            ticket_type: item.type,
            quantity: 1, // Each record represents one ticket
            price_per_ticket: item.price,
            total_amount: item.price,
            service_fee: serviceFee / (items.reduce((sum, i) => sum + (i.quantity || 1), 0)), // Distribute service fee
            service_fee_percentage: serviceFeePercentage,
            contact_name: contactInfo.name,
            contact_email: contactInfo.email,
            payment_status: 'completed',
            ticket_code: ticketCode,
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
    }
    
    // Track service fee for analytics
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'ticket_purchase_completed',
        user_id: userId,
        event_data: {
          service_fee: serviceFee,
          service_fee_percentage: serviceFeePercentage,
          subtotal: subtotal,
          total_with_fees: totalWithFees,
          item_count: items.length,
          total_tickets: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
          customer_email: contactInfo.email,
          customer_name: contactInfo.name,
          is_guest_purchase: !userId
        }
      });
    
    // Send purchase confirmation email
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-purchase-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          customerEmail: contactInfo.email,
          customerName: contactInfo.name,
          purchaseDetails: {
            items: items.map(item => ({
              name: item.name,
              quantity: item.quantity || 1,
              price: item.price,
              eventDate: item.date,
              eventTime: item.time,
              venue: item.venue
            })),
            subtotal,
            serviceFee,
            total: totalWithFees,
            purchaseDate: new Date().toISOString()
          },
          ticketCodes: ticketCodes
        })
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the purchase if email fails
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Tickets processed successfully",
        data: { 
          purchaseRecords,
          ticketCodes,
          totalAmount: totalWithFees
        }
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
