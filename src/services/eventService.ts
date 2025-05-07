
import { supabase } from '@/integrations/supabase/client';
import { EventStatus } from '@/types/EventTypes';

export const updateEventStatus = async (
  eventId: string,
  status: EventStatus
): Promise<void> => {
  const { error } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId);

  if (error) {
    console.error('Error updating event status:', error);
    throw new Error('Failed to update event status');
  }
};

export const getEventById = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venue:venue_id (id, name, address),
      event_ticket_types (*)
    `)
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    throw error;
  }

  return data;
};

export const getEventsByPromoter = async (promoterId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venue:venue_id (id, name, address),
      event_ticket_types (*)
    `)
    .eq('created_by', promoterId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return data;
};

export const getPublicEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venue:venue_id (id, name, address),
      event_ticket_types (*)
    `)
    .eq('is_public', true)
    .eq('status', 'published')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching public events:', error);
    throw error;
  }

  return data;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};

export const duplicateEvent = async (eventId: string): Promise<string> => {
  // First get the event data
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select(`
      *,
      event_ticket_types (*)
    `)
    .eq('id', eventId)
    .single();

  if (eventError) {
    console.error('Error fetching event to duplicate:', eventError);
    throw new Error('Failed to duplicate event');
  }

  // Create a copy of the event
  const { data: newEvent, error: createError } = await supabase
    .from('events')
    .insert({
      name: `${eventData.name} (Copy)`,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      venue_id: eventData.venue_id,
      image_url: eventData.image_url,
      promotional_materials: eventData.promotional_materials,
      status: 'draft',
      created_by: eventData.created_by,
      capacity: eventData.capacity,
      event_type: eventData.event_type,
      location_details: eventData.location_details,
      contact_info: eventData.contact_info,
      custom_settings: eventData.custom_settings,
      is_public: eventData.is_public
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating duplicate event:', createError);
    throw new Error('Failed to duplicate event');
  }

  // Duplicate ticket types
  if (eventData.event_ticket_types && eventData.event_ticket_types.length > 0) {
    const newTicketTypes = eventData.event_ticket_types.map((ticket: any) => ({
      event_id: newEvent.id,
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      quantity: ticket.quantity
    }));

    const { error: ticketError } = await supabase
      .from('event_ticket_types')
      .insert(newTicketTypes);

    if (ticketError) {
      console.error('Error duplicating ticket types:', ticketError);
      // Continue even if ticket duplication fails
    }
  }

  return newEvent.id;
};
