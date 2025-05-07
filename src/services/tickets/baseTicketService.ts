
import { supabase } from '@/lib/supabase';
import { EventAttendee } from '@/types/EventTypes';

/**
 * Processes a ticket scan for event check-in
 */
export const processTicketScan = async (ticketCode: string): Promise<{
  success: boolean;
  message: string;
  attendee?: EventAttendee;
}> => {
  try {
    // Validate the ticket code
    const validationResult = await validateTicketCode(ticketCode);
    
    if (!validationResult.valid) {
      return {
        success: false,
        message: validationResult.message,
        attendee: validationResult.attendee
      };
    }
    
    // If validation passed, update the attendee status
    if (validationResult.attendee) {
      const { id: attendeeId, event_id: eventId } = validationResult.attendee;
      
      // Update the attendee status to checked_in
      const { data: attendeeData, error: attendeeError } = await supabase
        .from('event_attendees')
        .update({
          status: 'checked_in',
          checked_in_at: new Date().toISOString()
        })
        .eq('id', attendeeId)
        .select()
        .single();
        
      if (attendeeError) {
        throw attendeeError;
      }
      
      // Create a check-in record
      const { error: checkInError } = await supabase
        .from('event_check_ins')
        .insert({
          event_id: eventId,
          attendee_id: attendeeId,
        });
        
      if (checkInError) {
        console.error('Error creating check-in record:', checkInError);
      }
      
      // Convert status to the correct enum type and properly handle custom_fields
      const typedAttendeeData: EventAttendee = {
        ...attendeeData,
        status: attendeeData.status as "registered" | "checked_in" | "cancelled" | "no_show",
        custom_fields: attendeeData.custom_fields as Record<string, any> || {}
      };
      
      return {
        success: true,
        message: 'Attendee checked in successfully',
        attendee: typedAttendeeData
      };
    }
    
    return {
      success: false,
      message: 'Failed to process ticket'
    };
  } catch (error) {
    console.error('Error processing ticket scan:', error);
    throw new Error('Failed to process ticket scan');
  }
};

/**
 * Validates a ticket code
 */
export const validateTicketCode = async (
  ticketCode: string
): Promise<{
  valid: boolean;
  message: string;
  attendee?: EventAttendee;
}> => {
  try {
    // Find the attendee with this ticket code
    const { data: attendee, error } = await supabase
      .from('event_attendees')
      .select(`
        *,
        event:event_id (
          id,
          name,
          date,
          time,
          venue_id
        )
      `)
      .eq('ticket_code', ticketCode)
      .single();

    if (error) {
      return {
        valid: false,
        message: 'Invalid ticket code'
      };
    }

    if (!attendee) {
      return {
        valid: false,
        message: 'Ticket not found'
      };
    }

    // Check if already checked in
    if (attendee.status === 'checked_in') {
      return {
        valid: false,
        message: 'Ticket already used',
        attendee: attendee as EventAttendee
      };
    }

    // Check if cancelled
    if (attendee.status === 'cancelled') {
      return {
        valid: false,
        message: 'Ticket has been cancelled',
        attendee: attendee as EventAttendee
      };
    }

    // Valid ticket
    return {
      valid: true,
      message: 'Valid ticket',
      attendee: attendee as EventAttendee
    };
  } catch (error) {
    console.error('Error validating ticket:', error);
    return {
      valid: false,
      message: 'Error validating ticket'
    };
  }
};

// Basic ticket service functionality
export const createTicket = async () => {
  // Implementation details to be added as needed
};
