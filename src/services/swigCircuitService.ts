
import { supabase } from '@/integrations/supabase/client';
import { incrementCodeUsage } from '@/utils/discountCodeUtils';

export interface SwigCircuitTicketPurchase {
  swigCircuitId: string;
  ticketTierId: string;
  quantity: number;
  userId?: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  }
  discountCodeId?: string;
}

/**
 * Purchase tickets for a swig circuit
 */
export async function purchaseSwigCircuitTickets(params: SwigCircuitTicketPurchase) {
  const { swigCircuitId, ticketTierId, quantity, userId, contactInfo, discountCodeId } = params;
  
  const ticketRecords = [];
  
  // Purchase the requested number of tickets
  for (let i = 0; i < quantity; i++) {
    // Generate a ticket code
    const ticketCode = generateTicketCode();
    
    // Create the attendee record
    const { data, error } = await supabase
      .from('swig_circuit_attendees')
      .insert({
        swig_circuit_id: swigCircuitId,
        user_id: userId,
        ticket_type_id: ticketTierId,
        status: 'registered',
        ticket_code: ticketCode,
        purchase_date: new Date().toISOString(),
        purchaser_info: {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone || ''
        }
      })
      .select('*')
      .single();
      
    if (error) {
      console.error('Error purchasing swig circuit ticket:', error);
      throw new Error(`Failed to purchase ticket: ${error.message}`);
    }
    
    ticketRecords.push(data);
  }
  
  // If a discount code was applied, increment its usage
  if (discountCodeId) {
    try {
      await incrementCodeUsage(discountCodeId, 'event_discount_codes');
    } catch (error) {
      console.error('Error incrementing discount code usage:', error);
      // Continue with the purchase even if incrementing fails
    }
  }
  
  return {
    success: true,
    message: `Successfully purchased ${quantity} ticket(s)`,
    tickets: ticketRecords
  };
}

/**
 * Generate a unique ticket code
 */
function generateTicketCode(): string {
  // Generate a random alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `SWIG-${code}`;
}

/**
 * Check in a swig circuit attendee
 */
export async function checkInSwigCircuitAttendee(ticketId: string, venueId: string, checkedInBy?: string) {
  // First validate the ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('swig_circuit_attendees')
    .select('*')
    .eq('id', ticketId)
    .single();
    
  if (ticketError || !ticket) {
    throw new Error('Invalid ticket');
  }
  
  // Check if venue is part of the circuit
  const { data: venueCheck, error: venueError } = await supabase
    .from('swig_circuit_venues')
    .select('id')
    .eq('swig_circuit_id', ticket.swig_circuit_id)
    .eq('establishment_id', venueId)
    .single();
    
  if (venueError || !venueCheck) {
    throw new Error('This venue is not part of the swig circuit');
  }
  
  // Record the check in
  const { data: checkIn, error: checkInError } = await supabase
    .from('swig_circuit_check_ins')
    .insert({
      swig_circuit_id: ticket.swig_circuit_id,
      attendee_id: ticket.id,
      establishment_id: venueId,
      checked_in_by: checkedInBy
    })
    .select()
    .single();
    
  if (checkInError) {
    throw new Error(`Failed to check in: ${checkInError.message}`);
  }
  
  // Update the ticket status if first check-in
  await supabase
    .from('swig_circuit_attendees')
    .update({
      status: 'attended',
      first_check_in: ticket.first_check_in || new Date().toISOString()
    })
    .eq('id', ticketId);
    
  return {
    success: true,
    message: 'Check-in successful',
    checkIn
  };
}
