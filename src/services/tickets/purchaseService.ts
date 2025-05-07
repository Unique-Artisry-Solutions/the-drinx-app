import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const createTicketPurchase = async (
  eventId: string,
  ticketTypeId: string,
  quantity: number,
  attendeeDetails: {
    name?: string;
    email?: string;
    customFields?: Record<string, any>;
  },
  discountCodeId?: string
) => {
  try {
    // Get the ticket type details
    const { data: ticketType, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('id', ticketTypeId)
      .single();

    if (ticketError) throw ticketError;

    // Generate unique ticket codes
    const attendees = [];
    for (let i = 0; i < quantity; i++) {
      const ticketCode = `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      attendees.push({
        event_id: eventId,
        ticket_type_id: ticketTypeId,
        name: attendeeDetails.name,
        email: attendeeDetails.email,
        status: 'registered',
        purchase_date: new Date().toISOString(),
        ticket_code: ticketCode,
        custom_fields: attendeeDetails.customFields || {}
      });
    }

    // Insert the attendees
    const { data, error } = await supabase
      .from('event_attendees')
      .insert(attendees)
      .select();

    if (error) throw error;

    // If a discount code was used, increment its usage count
    if (discountCodeId) {
      await supabase
        .from('event_discount_codes')
        .update({ usage_count: supabase.rpc('increment', { inc: 1 }) })
        .eq('id', discountCodeId);
    }

    return {
      success: true,
      ticketsPurchased: data,
      message: 'Tickets purchased successfully'
    };
  } catch (error: any) {
    console.error('Error creating ticket purchase:', error);
    return {
      success: false,
      message: error.message || 'Failed to purchase tickets'
    };
  }
};
