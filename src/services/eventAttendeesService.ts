
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

export const addEventAttendee = async (attendeeData: Partial<EventAttendee>): Promise<EventAttendee> => {
  // Ensure purchase_date is set if not provided
  if (!attendeeData.purchase_date) {
    attendeeData.purchase_date = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('event_attendees')
    .insert(attendeeData)
    .select()
    .single();

  if (error) {
    console.error('Error adding attendee:', error);
    throw error;
  }

  return data as EventAttendee;
};

export const updateEventAttendee = async (attendeeId: string, updates: Partial<EventAttendee>): Promise<EventAttendee> => {
  const { data, error } = await supabase
    .from('event_attendees')
    .update(updates)
    .eq('id', attendeeId)
    .select()
    .single();

  if (error) {
    console.error('Error updating attendee:', error);
    throw error;
  }

  return data as EventAttendee;
};

export const deleteEventAttendee = async (attendeeId: string): Promise<void> => {
  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .eq('id', attendeeId);

  if (error) {
    console.error('Error deleting attendee:', error);
    throw error;
  }
};

export const checkInAttendee = async (
  eventId: string,
  attendeeId: string,
  location?: string,
  notes?: string
): Promise<EventAttendee> => {
  // Update the attendee status
  const { data: attendeeData, error: attendeeError } = await supabase
    .from('event_attendees')
    .update({
      status: 'checked_in',
      checked_in_at: new Date().toISOString(),
      notes: notes
    })
    .eq('id', attendeeId)
    .eq('event_id', eventId)
    .select()
    .single();

  if (attendeeError) {
    console.error('Error checking in attendee:', attendeeError);
    throw attendeeError;
  }

  // Create a check-in record
  const { error: checkInError } = await supabase
    .from('event_check_ins')
    .insert({
      event_id: eventId,
      attendee_id: attendeeId,
      checked_in_by: null, // This could be the user's ID if known
      location: location
    });

  if (checkInError) {
    console.error('Error creating check-in record:', checkInError);
    // Don't throw, we still want to return the updated attendee
  }

  return attendeeData as EventAttendee;
};

export const validateTicketCode = async (ticketCode: string): Promise<{
  valid: boolean;
  message: string;
  attendee?: EventAttendee;
}> => {
  try {
    // Find the attendee with this ticket code
    const { data, error } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('ticket_code', ticketCode)
      .single();

    if (error) {
      return {
        valid: false,
        message: 'Invalid ticket code'
      };
    }

    const attendee = data as EventAttendee;

    // Check if ticket has already been used
    if (attendee.status === 'checked_in') {
      return {
        valid: false,
        message: 'Ticket has already been used',
        attendee
      };
    }

    // Check if ticket is cancelled
    if (attendee.status === 'cancelled') {
      return {
        valid: false,
        message: 'Ticket has been cancelled',
        attendee
      };
    }

    return {
      valid: true,
      message: 'Ticket is valid',
      attendee
    };
  } catch (error) {
    console.error('Error validating ticket code:', error);
    return {
      valid: false,
      message: 'Error validating ticket'
    };
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

export const importAttendeesFromCSV = async (eventId: string, csvContent: string): Promise<{
  success: boolean;
  imported: number;
  errors: string[];
}> => {
  try {
    // Parse CSV content
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const nameIndex = headers.indexOf('name');
    const emailIndex = headers.indexOf('email');
    const ticketTypeIndex = headers.findIndex(h => h.includes('ticket') || h.includes('type'));
    
    if (nameIndex === -1 || emailIndex === -1) {
      return {
        success: false,
        imported: 0,
        errors: ['CSV must contain name and email columns']
      };
    }
    
    const attendees: Partial<EventAttendee>[] = [];
    const errors: string[] = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());
      
      if (values.length < Math.max(nameIndex, emailIndex) + 1) {
        errors.push(`Line ${i+1}: Invalid format`);
        continue;
      }
      
      const name = values[nameIndex];
      const email = values[emailIndex];
      const ticketTypeId = ticketTypeIndex !== -1 ? values[ticketTypeIndex] : undefined;
      
      if (!name || !email) {
        errors.push(`Line ${i+1}: Missing name or email`);
        continue;
      }
      
      attendees.push({
        event_id: eventId,
        name,
        email,
        ticket_type_id: ticketTypeId,
        status: 'registered',
        purchase_date: new Date().toISOString()
      });
    }
    
    if (attendees.length === 0) {
      return {
        success: false,
        imported: 0,
        errors: errors.length > 0 ? errors : ['No valid attendees found in CSV']
      };
    }
    
    // Insert attendees in batches (to avoid potential size limits)
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < attendees.length; i += batchSize) {
      const batch = attendees.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('event_attendees')
        .insert(batch);
      
      if (error) {
        errors.push(`Batch ${i/batchSize + 1}: ${error.message}`);
      } else {
        imported += batch.length;
      }
    }
    
    return {
      success: imported > 0,
      imported,
      errors
    };
  } catch (err: any) {
    console.error('Error importing attendees from CSV:', err);
    return {
      success: false,
      imported: 0,
      errors: [err.message || 'Unknown error during import']
    };
  }
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
