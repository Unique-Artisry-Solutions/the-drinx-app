
import { supabase } from '@/integrations/supabase/client';
import { EventAttendee } from '@/types/EventTypes';

export const fetchEventAttendees = async (eventId: string): Promise<EventAttendee[]> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching event attendees:', error);
    throw error;
  }

  return data as EventAttendee[];
};

export const fetchAttendeeDetails = async (attendeeId: string): Promise<EventAttendee> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .select('*')
    .eq('id', attendeeId)
    .single();

  if (error) {
    console.error('Error fetching attendee details:', error);
    throw error;
  }

  return data as EventAttendee;
};

export const checkInAttendee = async (attendeeId: string, checkedInBy: string): Promise<void> => {
  const { error } = await supabase
    .from('event_attendees')
    .update({
      status: 'checked_in',
      checked_in_at: new Date().toISOString(),
    })
    .eq('id', attendeeId);

  if (error) {
    console.error('Error checking in attendee:', error);
    throw error;
  }

  // Create a check-in record
  const { error: checkInError } = await supabase
    .from('event_check_ins')
    .insert({
      attendee_id: attendeeId,
      checked_in_by: checkedInBy,
      checked_in_at: new Date().toISOString(),
    });

  if (checkInError) {
    console.error('Error creating check-in record:', checkInError);
    throw checkInError;
  }
};

export const cancelAttendeeRegistration = async (attendeeId: string): Promise<void> => {
  const { error } = await supabase
    .from('event_attendees')
    .update({ status: 'cancelled' })
    .eq('id', attendeeId);

  if (error) {
    console.error('Error cancelling attendee registration:', error);
    throw error;
  }
};

export const markAttendeeAsNoShow = async (attendeeId: string): Promise<void> => {
  const { error } = await supabase
    .from('event_attendees')
    .update({ status: 'no_show' })
    .eq('id', attendeeId);

  if (error) {
    console.error('Error marking attendee as no-show:', error);
    throw error;
  }
};

export const updateAttendeeNotes = async (attendeeId: string, notes: string): Promise<void> => {
  const { error } = await supabase
    .from('event_attendees')
    .update({ notes })
    .eq('id', attendeeId);

  if (error) {
    console.error('Error updating attendee notes:', error);
    throw error;
  }
};

export const updateAttendeeDetails = async (
  attendeeId: string,
  updates: Partial<EventAttendee>
): Promise<void> => {
  const { error } = await supabase
    .from('event_attendees')
    .update(updates)
    .eq('id', attendeeId);

  if (error) {
    console.error('Error updating attendee details:', error);
    throw error;
  }
};

export const addAttendeeToEvent = async (
  eventId: string,
  ticketTypeId: string,
  attendeeData: {
    name: string;
    email: string;
    customFields?: Record<string, any>;
  }
): Promise<EventAttendee> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .insert({
      event_id: eventId,
      name: attendeeData.name,
      email: attendeeData.email,
      status: 'registered',
      ticket_type_id: ticketTypeId,
      custom_fields: attendeeData.customFields || {},
      purchase_date: new Date().toISOString(), // Add the required purchase_date field
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding attendee to event:', error);
    throw error;
  }

  return data as EventAttendee;
};

export const generateAttendeeSummary = (attendees: EventAttendee[]): {
  total: number;
  checkedIn: number;
  cancelled: number;
  noShow: number;
  statusBreakdown: Record<string, number>;
} => {
  const statusBreakdown: Record<string, number> = {
    registered: 0,
    checked_in: 0,
    cancelled: 0,
    no_show: 0,
  };

  // Count attendees by status
  attendees.forEach((attendee) => {
    statusBreakdown[attendee.status] = (statusBreakdown[attendee.status] || 0) + 1;
  });

  return {
    total: attendees.length,
    checkedIn: statusBreakdown.checked_in || 0,
    cancelled: statusBreakdown.cancelled || 0,
    noShow: statusBreakdown.no_show || 0,
    statusBreakdown,
  };
};

export const getAttendeeCheckInStats = (
  attendees: EventAttendee[]
): { total: number; checkedIn: number; checkInRate: number } => {
  const total = attendees.length;
  const checkedIn = attendees.filter((a) => a.status === 'checked_in').length;
  const checkInRate = total > 0 ? (checkedIn / total) * 100 : 0;

  return {
    total,
    checkedIn,
    checkInRate,
  };
};
