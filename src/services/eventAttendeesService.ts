
import { supabase } from '@/integrations/supabase/client';
import { 
  EventAttendee, 
  EventCheckIn,
  EventStatistics
} from '@/types/EventTypes';
import { safeJsonToRecord, toAttendeeStatus } from '@/utils/typeGuards';

/**
 * Fetch attendees for a specific event
 */
export async function fetchEventAttendees(eventId: string): Promise<EventAttendee[]> {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .select(`
        *,
        event_ticket_types (
          id,
          name,
          price
        )
      `)
      .eq('event_id', eventId);

    if (error) throw error;
    
    // Transform data to ensure type safety
    return (data || []).map(item => ({
      ...item,
      id: item.id,
      event_id: item.event_id,
      user_id: item.user_id,
      ticket_type_id: item.ticket_type_id,
      status: toAttendeeStatus(item.status),
      email: item.email || '',
      name: item.name || '',
      purchase_date: item.purchase_date,
      ticket_code: item.ticket_code || '',
      checked_in_at: item.checked_in_at,
      notes: item.notes || '',
      custom_fields: safeJsonToRecord(item.custom_fields)
    }));
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    throw error;
  }
}

/**
 * Add a new attendee to an event
 */
export async function addEventAttendee(attendee: EventAttendee): Promise<EventAttendee> {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .insert(attendee)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: toAttendeeStatus(data.status),
      email: data.email || '',
      name: data.name || '',
      ticket_code: data.ticket_code || '',
      notes: data.notes || '',
      custom_fields: safeJsonToRecord(data.custom_fields)
    };
  } catch (error) {
    console.error('Error adding event attendee:', error);
    throw error;
  }
}

/**
 * Update an existing attendee
 */
export async function updateEventAttendee(id: string, updates: Partial<EventAttendee>): Promise<EventAttendee> {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: toAttendeeStatus(data.status),
      email: data.email || '',
      name: data.name || '',
      ticket_code: data.ticket_code || '',
      notes: data.notes || '',
      custom_fields: safeJsonToRecord(data.custom_fields)
    };
  } catch (error) {
    console.error('Error updating event attendee:', error);
    throw error;
  }
}

/**
 * Delete an attendee
 */
export async function deleteEventAttendee(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('event_attendees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting event attendee:', error);
    throw error;
  }
}

/**
 * Check in an attendee
 */
export async function checkInAttendee(eventId: string, attendeeId: string, location?: string, notes?: string): Promise<EventCheckIn> {
  try {
    // First update the attendee status
    await updateEventAttendee(attendeeId, { 
      status: 'checked_in',
      checked_in_at: new Date().toISOString()
    });

    // Then create a check-in record
    const { data, error } = await supabase
      .from('event_check_ins')
      .insert({
        event_id: eventId,
        attendee_id: attendeeId,
        checked_in_by: (await supabase.auth.getUser()).data.user?.id,
        location,
        notes
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking in attendee:', error);
    throw error;
  }
}

/**
 * Get event statistics
 */
export async function getEventStatistics(eventId: string): Promise<EventStatistics | null> {
  try {
    const { data, error } = await supabase
      .from('event_statistics')
      .select('*')
      .eq('event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
    return data;
  } catch (error) {
    console.error('Error fetching event statistics:', error);
    throw error;
  }
}

/**
 * Import attendees from CSV
 */
export async function importAttendeesFromCSV(eventId: string, csv: string): Promise<{ success: boolean; imported: number; errors: string[] }> {
  try {
    // In a real implementation, parse CSV and validate data
    // This is a simplified example
    const rows = csv.split('\n').slice(1); // Skip header
    const attendees: EventAttendee[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const columns = rows[i].split(',');
        if (columns.length < 2) continue;
        
        attendees.push({
          event_id: eventId,
          name: columns[0].trim(),
          email: columns[1].trim(),
          status: 'registered',
          ticket_type_id: columns[2]?.trim() || undefined,
          custom_fields: {}
        });
      } catch (e) {
        errors.push(`Row ${i + 2}: ${e.message}`);
      }
    }
    
    if (attendees.length > 0) {
      const { data, error } = await supabase
        .from('event_attendees')
        .insert(attendees);
        
      if (error) throw error;
    }
    
    return { 
      success: true, 
      imported: attendees.length,
      errors
    };
  } catch (error) {
    console.error('Error importing attendees from CSV:', error);
    return { 
      success: false, 
      imported: 0,
      errors: [error.message] 
    };
  }
}
