
import { supabase } from '@/lib/supabase';
import { EventTicketType } from '@/types/EventTypes';

/**
 * Fetches ticket types for an event
 */
export const fetchEventTicketTypes = async (eventId: string): Promise<EventTicketType[]> => {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching event ticket types:', error);
    throw new Error('Failed to fetch ticket types');
  }
};

/**
 * Checks the availability of tickets for a specific ticket type
 */
export const checkTicketAvailability = async (eventId: string, ticketTypeId: string): Promise<{
  available: boolean;
  remaining: number;
  total: number;
}> => {
  try {
    // Get ticket type information
    const { data: ticketType, error: ticketTypeError } = await supabase
      .from('event_ticket_types')
      .select('quantity')
      .eq('id', ticketTypeId)
      .eq('event_id', eventId)
      .single();
      
    if (ticketTypeError) throw ticketTypeError;
    
    // Count sold tickets
    const { count: soldCount, error: countError } = await supabase
      .from('event_attendees')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('ticket_type_id', ticketTypeId)
      .not('status', 'eq', 'cancelled');
      
    if (countError) throw countError;
    
    const total = ticketType.quantity;
    const sold = soldCount || 0;
    const remaining = total - sold;
    
    return {
      available: remaining > 0,
      remaining,
      total
    };
  } catch (error) {
    console.error('Error checking ticket availability:', error);
    throw new Error('Failed to check ticket availability');
  }
};
