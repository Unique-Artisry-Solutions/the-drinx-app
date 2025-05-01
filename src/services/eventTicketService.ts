
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
    const { data: salesData, error: salesError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, count')
      .eq('event_id', eventId)
      .not('status', 'eq', 'cancelled')
      .group('ticket_type_id');

    if (salesError) throw salesError;

    // Calculate available tickets and add to response
    return data.map(ticket => {
      const sales = salesData.find(s => s.ticket_type_id === ticket.id);
      const sold = sales ? parseInt(sales.count) : 0;
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
export async function createTicketType(ticketType: Omit<EventTicketType, 'id'>): Promise<EventTicketType> {
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

    // Get sales count
    const { count: sold, error: countError } = await supabase
      .from('event_attendees')
      .select('id', { count: 'exact', head: true })
      .eq('ticket_type_id', id)
      .not('status', 'eq', 'cancelled');
      
    if (countError) throw countError;
    
    return {
      ...data,
      sold: sold || 0,
      available: data.quantity - (sold || 0)
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
    const { count, error: countError } = await supabase
      .from('event_attendees')
      .select('id', { count: 'exact', head: true })
      .eq('ticket_type_id', id);
      
    if (countError) throw countError;
    
    if (count && count > 0) {
      throw new Error(`Cannot delete ticket type with ${count} tickets sold`);
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
