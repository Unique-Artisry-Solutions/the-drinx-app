
import { supabase } from '@/lib/supabase';

/**
 * Fetches ticket types for an event
 */
export const getTicketTypes = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .select('*')
    .eq('event_id', eventId);
    
  if (error) {
    throw new Error(`Error fetching ticket types: ${error.message}`);
  }
  
  return data || [];
};

/**
 * Checks availability for a ticket type
 */
export const checkTicketAvailability = async (eventId: string, ticketTypeId: string) => {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .select('quantity, id')
    .eq('id', ticketTypeId)
    .eq('event_id', eventId)
    .single();
    
  if (error) {
    throw new Error(`Error checking ticket availability: ${error.message}`);
  }
  
  // Count sold tickets
  const { count: soldCount, error: countError } = await supabase
    .from('event_attendees')
    .select('id', { count: 'exact', head: true })
    .eq('ticket_type_id', ticketTypeId);
    
  if (countError) {
    throw new Error(`Error checking sold tickets: ${countError.message}`);
  }
  
  const available = (data.quantity - (soldCount || 0));
  return {
    available: available > 0,
    remainingCount: available,
    ticketTypeId
  };
};

export const fetchEventTicketTypes = getTicketTypes;
