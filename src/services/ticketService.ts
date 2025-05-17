
import { supabase } from '@/integrations/supabase/client';
import { incrementCodeUsage } from '@/utils/discountCodeUtils';

export interface TicketPurchaseItem {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  price: number;
  discountCodeId?: string;
}

export interface TicketPurchaseParams {
  items: TicketPurchaseItem[];
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  userId?: string; 
}

/**
 * Processes a ticket purchase transaction
 */
export async function purchaseTickets(params: TicketPurchaseParams) {
  const { items, contactInfo, userId } = params;

  // Validate items
  if (!items || items.length === 0) {
    throw new Error('No tickets selected for purchase');
  }

  // Process each ticket item
  const purchaseRecords = [];

  for (const item of items) {
    // Get a ticket code
    const ticketCode = generateTicketCode();
    
    // Create the attendee record
    const { data: attendeeRecord, error } = await supabase
      .from('event_attendees')
      .insert({
        event_id: item.eventId,
        user_id: userId,
        ticket_type_id: item.ticketTypeId,
        name: contactInfo.name,
        email: contactInfo.email,
        status: 'registered',
        ticket_code: ticketCode,
        custom_fields: {
          phone: contactInfo.phone || ''
        }
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating attendee record:', error);
      throw new Error(`Failed to create ticket: ${error.message}`);
    }
    
    purchaseRecords.push(attendeeRecord);
    
    // If a discount code was applied, increment its usage
    if (item.discountCodeId) {
      try {
        await incrementCodeUsage(item.discountCodeId, 'event_discount_codes');
      } catch (error) {
        console.error('Error incrementing discount code usage:', error);
        // Continue with the purchase even if incrementing fails
      }
    }
  }

  return {
    success: true,
    message: 'Tickets purchased successfully',
    tickets: purchaseRecords
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
  
  return `TKT-${code}`;
}

/**
 * Validate a ticket code
 */
export async function validateTicket(ticketCode: string, eventId: string) {
  // Get the ticket
  const { data, error } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('ticket_code', ticketCode)
    .eq('event_id', eventId)
    .single();
    
  if (error || !data) {
    return {
      valid: false,
      message: 'Invalid ticket code'
    };
  }
  
  // Check if already checked in
  if (data.checked_in_at) {
    return {
      valid: false,
      message: 'Ticket already used',
      checkedInAt: data.checked_in_at
    };
  }
  
  return {
    valid: true,
    ticketData: data
  };
}

/**
 * Check in an attendee
 */
export async function checkInAttendee(ticketId: string, checkedInBy?: string) {
  const { data, error } = await supabase
    .from('event_attendees')
    .update({
      checked_in_at: new Date().toISOString(),
      status: 'attended'
    })
    .eq('id', ticketId)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to check in attendee: ${error.message}`);
  }
  
  // Create check-in record
  await supabase
    .from('event_check_ins')
    .insert({
      event_id: data.event_id,
      attendee_id: data.id,
      checked_in_by: checkedInBy
    });
    
  return data;
}
