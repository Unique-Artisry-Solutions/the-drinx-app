
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items, userId, contactInfo, serviceFee, serviceFeePercentage } = await req.json()
    
    // Create Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    
    // Start processing purchases
    console.log(`Processing ticket purchase for user: ${userId}`)
    console.log(`Items in cart: ${items.length}`)
    
    const results = []
    
    // Process each ticket
    for (const item of items) {
      if (item.type === 'event_ticket') {
        // Handle event ticket purchase
        const eventTicketResult = await processEventTicket(supabase, userId, item, contactInfo)
        results.push(eventTicketResult)
      } else if (item.type === 'swig_circuit_ticket') {
        // Handle swig circuit ticket purchase
        const swigCircuitResult = await processSwigCircuitTicket(supabase, userId, item, contactInfo, serviceFee, serviceFeePercentage)
        results.push(swigCircuitResult)
      }
    }
    
    // Return response with results
    return new Response(
      JSON.stringify({
        success: true,
        results
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing purchase:', error.message)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    )
  }
})

async function processEventTicket(supabase, userId, item, contactInfo) {
  try {
    console.log(`Processing event ticket: ${item.id} for event: ${item.eventId}`)
    
    // Create attendee record
    const quantity = item.quantity || 1
    const attendeeRecords = []
    
    for (let i = 0; i < quantity; i++) {
      // Create unique ticket code
      const ticketCode = generateTicketCode()
      
      // Insert attendee record
      const { data, error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: item.eventId,
          user_id: userId,
          ticket_type_id: item.ticketTypeId,
          name: contactInfo.name,
          email: contactInfo.email,
          ticket_code: ticketCode,
          status: 'registered',
        })
        .select()
      
      if (error) throw error
      
      attendeeRecords.push(data[0])
    }
    
    return {
      type: 'event_ticket',
      success: true,
      attendees: attendeeRecords,
      message: `Successfully registered ${quantity} attendee(s) for event`,
    }
  } catch (error) {
    console.error('Error processing event ticket:', error)
    return {
      type: 'event_ticket',
      success: false,
      error: error.message,
    }
  }
}

async function processSwigCircuitTicket(supabase, userId, item, contactInfo, serviceFee, serviceFeePercentage) {
  try {
    console.log(`Processing swig circuit ticket: ${item.id} for circuit: ${item.swigCircuitId}`)
    
    // Add user to the swig circuit participants
    const { data, error } = await supabase
      .from('user_bar_crawl_participation')
      .insert({
        user_id: userId,
        bar_crawl_id: item.swigCircuitId,
      })
      .select()
    
    if (error) throw error
    
    // Record the purchase with service fee information
    const purchaseData = {
      user_id: userId,
      swig_circuit_id: item.swigCircuitId,
      ticket_type_id: item.ticketTypeId,
      amount: item.price,
      service_fee: serviceFee,
      service_fee_percentage: serviceFeePercentage,
      purchase_date: new Date().toISOString(),
      quantity: item.quantity || 1,
      purchaser_name: contactInfo.name,
      purchaser_email: contactInfo.email,
    }
    
    // In a real implementation, you would store this purchase data in a 'purchases' table
    // For now, we're just logging it
    console.log('Purchase recorded:', purchaseData)
    
    return {
      type: 'swig_circuit_ticket',
      success: true,
      message: `Successfully registered for swig circuit`,
      participation: data[0],
    }
  } catch (error) {
    console.error('Error processing swig circuit ticket:', error)
    return {
      type: 'swig_circuit_ticket',
      success: false,
      error: error.message,
    }
  }
}

function generateTicketCode() {
  // Generate a random alphanumeric code for tickets
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
