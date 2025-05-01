
import { supabase } from '@/integrations/supabase/client';
import { EventAttendee, EventTicketType } from '@/types/EventTypes';
import { checkInAttendee, validateTicketCode } from './eventAttendeesService';

/**
 * Fetch ticket types for an event
 */
export async function fetchEventTicketTypes(eventId: string): Promise<EventTicketType[]> {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    if (error) throw error;

    // Get ticket sales data for available counts
    const { data: attendeeData, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, status')
      .eq('event_id', eventId);

    if (attendeeError) throw attendeeError;

    // Calculate sales counts manually since we can't use .group()
    const salesByTicketType: Record<string, number> = {};
    
    // Count tickets that haven't been cancelled
    attendeeData.forEach(attendee => {
      if (attendee.status !== 'cancelled' && attendee.ticket_type_id) {
        salesByTicketType[attendee.ticket_type_id] = (salesByTicketType[attendee.ticket_type_id] || 0) + 1;
      }
    });

    // Calculate available tickets and add to response
    return data.map(ticket => {
      const sold = salesByTicketType[ticket.id] || 0;
      const available = ticket.quantity - sold;
      
      return {
        id: ticket.id,
        name: ticket.name,
        description: ticket.description,
        price: ticket.price,
        quantity: ticket.quantity,
        sold,
        available
      };
    });
  } catch (error) {
    console.error('Error fetching event ticket types:', error);
    throw error;
  }
}

/**
 * Create a new ticket type
 */
export async function createTicketType(ticketType: Omit<EventTicketType, 'id'> & { event_id: string }): Promise<EventTicketType> {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .insert(ticketType)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      sold: 0,
      available: data.quantity
    };
  } catch (error) {
    console.error('Error creating ticket type:', error);
    throw error;
  }
}

/**
 * Update a ticket type
 */
export async function updateTicketType(id: string, updates: Partial<EventTicketType>): Promise<EventTicketType> {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Get sales count manually since we can't use .count() with filters directly
    const { data: attendeeData, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('id')
      .eq('ticket_type_id', id)
      .neq('status', 'cancelled');
      
    if (attendeeError) throw attendeeError;
    
    const sold = attendeeData.length;
    
    return {
      ...data,
      sold,
      available: data.quantity - sold
    };
  } catch (error) {
    console.error('Error updating ticket type:', error);
    throw error;
  }
}

/**
 * Delete a ticket type (if no tickets have been sold)
 */
export async function deleteTicketType(id: string): Promise<void> {
  try {
    // Check if tickets have been sold
    const { data: attendeeData, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('id')
      .eq('ticket_type_id', id);
      
    if (attendeeError) throw attendeeError;
    
    if (attendeeData.length > 0) {
      throw new Error(`Cannot delete ticket type with ${attendeeData.length} tickets sold`);
    }
    
    const { error } = await supabase
      .from('event_ticket_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting ticket type:', error);
    throw error;
  }
}

/**
 * Process a ticket scan
 */
export async function processTicketScan(
  ticketCode: string,
  location?: string,
  notes?: string
): Promise<{
  success: boolean;
  message: string;
  attendee?: EventAttendee;
}> {
  try {
    // First validate the ticket
    const validation = await validateTicketCode(ticketCode);
    
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
        attendee: validation.attendee
      };
    }
    
    if (!validation.attendee) {
      return {
        success: false,
        message: 'Ticket information not found'
      };
    }
    
    // Process the check-in
    await checkInAttendee(validation.attendee.event_id, validation.attendee.id, location, notes);
    
    return {
      success: true,
      message: 'Check-in successful',
      attendee: {
        ...validation.attendee,
        status: 'checked_in',
        checked_in_at: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error processing ticket scan:', error);
    return {
      success: false,
      message: `Error processing ticket: ${error.message}`
    };
  }
}

/**
 * Generate a QR code for a ticket 
 * (In a real app, we would encode more data and add security)
 */
export function generateTicketCode(eventId: string, attendeeId: string): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${eventId.substring(0, 4)}-${attendeeId.substring(0, 4)}-${random}`;
}
