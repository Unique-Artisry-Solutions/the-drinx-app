
// Basic ticket type service implementation - will be expanded later
import { supabase } from '@/integrations/supabase/client';

export const getEventTicketTypes = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .select('*')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching ticket types:', error);
    throw error;
  }

  // Add sold and available properties
  const ticketTypes = await Promise.all(data.map(async (ticketType) => {
    // Get sales count
    const { count: soldCount, error: countError } = await supabase
      .from('event_attendees')
      .select('*', { count: 'exact', head: true })
      .eq('ticket_type_id', ticketType.id)
      .neq('status', 'cancelled');
    
    if (countError) {
      console.error('Error counting ticket sales:', countError);
      return {
        ...ticketType,
        sold: 0,
        available: ticketType.quantity
      };
    }
    
    return {
      ...ticketType,
      sold: soldCount || 0,
      available: ticketType.quantity - (soldCount || 0)
    };
  }));

  return ticketTypes;
};

export const createTicketType = async (eventId: string, ticketTypeData: {
  name: string;
  description: string;
  price: number;
  quantity: number;
}) => {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .insert({
      event_id: eventId,
      name: ticketTypeData.name,
      description: ticketTypeData.description,
      price: ticketTypeData.price,
      quantity: ticketTypeData.quantity
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating ticket type:', error);
    throw error;
  }

  return {
    ...data,
    sold: 0,
    available: data.quantity
  };
};

export const updateTicketType = async (ticketTypeId: string, updates: {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
}) => {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .update(updates)
    .eq('id', ticketTypeId)
    .select()
    .single();

  if (error) {
    console.error('Error updating ticket type:', error);
    throw error;
  }

  // Get sales count
  const { count: soldCount, error: countError } = await supabase
    .from('event_attendees')
    .select('*', { count: 'exact', head: true })
    .eq('ticket_type_id', ticketTypeId)
    .neq('status', 'cancelled');
  
  if (countError) {
    console.error('Error counting ticket sales:', countError);
    return {
      ...data,
      sold: 0,
      available: data.quantity
    };
  }
    
  return {
    ...data,
    sold: soldCount || 0,
    available: data.quantity - (soldCount || 0)
  };
};

export const deleteTicketType = async (ticketTypeId: string) => {
  const { error } = await supabase
    .from('event_ticket_types')
    .delete()
    .eq('id', ticketTypeId);

  if (error) {
    console.error('Error deleting ticket type:', error);
    throw error;
  }

  return { success: true };
};
