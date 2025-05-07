
import { supabase } from '@/integrations/supabase/client';
import { EventAttendee } from '@/types/EventTypes';
import { toAttendeeStatus } from '@/utils/typeGuards';

export const fetchEventAttendees = async (eventId: string): Promise<EventAttendee[]> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching attendees:', error);
    throw error;
  }

  return data.map(attendee => ({
    id: attendee.id,
    event_id: attendee.event_id,
    user_id: attendee.user_id || undefined,
    email: attendee.email || undefined,
    name: attendee.name || undefined,
    ticket_type_id: attendee.ticket_type_id || undefined,
    purchase_date: attendee.purchase_date || new Date().toISOString(),
    checked_in_at: attendee.checked_in_at || undefined,
    status: toAttendeeStatus(attendee.status),
    ticket_code: attendee.ticket_code || undefined,
    notes: attendee.notes || undefined,
    custom_fields: attendee.custom_fields || {}
  }));
};

export const checkInAttendee = async (eventId: string, attendeeId: string): Promise<EventAttendee> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .update({
      status: 'checked_in',
      checked_in_at: new Date().toISOString()
    })
    .eq('id', attendeeId)
    .eq('event_id', eventId)
    .select()
    .single();

  if (error) {
    console.error('Error checking in attendee:', error);
    throw error;
  }

  // Also log the check-in to the event_check_ins table
  try {
    const { error: checkInError } = await supabase
      .from('event_check_ins')
      .insert({
        event_id: eventId,
        attendee_id: attendeeId
      });

    if (checkInError) {
      console.warn('Failed to record check-in event:', checkInError);
      // Continue even if this fails
    }
  } catch (err) {
    console.warn('Error recording check-in:', err);
  }

  return {
    id: data.id,
    event_id: data.event_id,
    user_id: data.user_id || undefined,
    email: data.email || undefined,
    name: data.name || undefined,
    ticket_type_id: data.ticket_type_id || undefined,
    purchase_date: data.purchase_date,
    checked_in_at: data.checked_in_at,
    status: toAttendeeStatus(data.status),
    ticket_code: data.ticket_code || undefined,
    notes: data.notes || undefined,
    custom_fields: data.custom_fields || {}
  };
};

export const cancelAttendeeRegistration = async (attendeeId: string): Promise<EventAttendee> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .update({
      status: 'cancelled'
    })
    .eq('id', attendeeId)
    .select()
    .single();

  if (error) {
    console.error('Error cancelling registration:', error);
    throw error;
  }

  return {
    id: data.id,
    event_id: data.event_id,
    user_id: data.user_id || undefined,
    email: data.email || undefined,
    name: data.name || undefined,
    ticket_type_id: data.ticket_type_id || undefined,
    purchase_date: data.purchase_date,
    checked_in_at: data.checked_in_at || undefined,
    status: toAttendeeStatus(data.status),
    ticket_code: data.ticket_code || undefined,
    notes: data.notes || undefined,
    custom_fields: data.custom_fields || {}
  };
};

export const markAttendeeAsNoShow = async (attendeeId: string): Promise<EventAttendee> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .update({
      status: 'no_show'
    })
    .eq('id', attendeeId)
    .select()
    .single();

  if (error) {
    console.error('Error marking as no-show:', error);
    throw error;
  }

  return {
    id: data.id,
    event_id: data.event_id,
    user_id: data.user_id || undefined,
    email: data.email || undefined,
    name: data.name || undefined,
    ticket_type_id: data.ticket_type_id || undefined,
    purchase_date: data.purchase_date,
    checked_in_at: data.checked_in_at || undefined,
    status: toAttendeeStatus(data.status),
    ticket_code: data.ticket_code || undefined,
    notes: data.notes || undefined,
    custom_fields: data.custom_fields || {}
  };
};

export const updateEventAttendee = async (
  attendeeId: string,
  updates: Partial<EventAttendee>
): Promise<EventAttendee> => {
  // Map the updates to database column format
  const dbUpdates: Record<string, any> = {};
  
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.custom_fields !== undefined) dbUpdates.custom_fields = updates.custom_fields;

  const { data, error } = await supabase
    .from('event_attendees')
    .update(dbUpdates)
    .eq('id', attendeeId)
    .select()
    .single();

  if (error) {
    console.error('Error updating attendee:', error);
    throw error;
  }

  return {
    id: data.id,
    event_id: data.event_id,
    user_id: data.user_id || undefined,
    email: data.email || undefined,
    name: data.name || undefined,
    ticket_type_id: data.ticket_type_id || undefined,
    purchase_date: data.purchase_date,
    checked_in_at: data.checked_in_at || undefined,
    status: toAttendeeStatus(data.status),
    ticket_code: data.ticket_code || undefined,
    notes: data.notes || undefined,
    custom_fields: data.custom_fields || {}
  };
};

export const getAttendeeCheckInStats = (attendees: EventAttendee[]) => {
  const total = attendees.length;
  const checkedIn = attendees.filter(a => a.status === 'checked_in').length;
  const checkInRate = total > 0 ? (checkedIn / total) * 100 : 0;
  
  return {
    total,
    checkedIn,
    checkInRate
  };
};
