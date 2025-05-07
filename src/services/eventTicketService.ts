
import { supabase } from '@/lib/supabaseClient';
import { EventAttendee } from '@/types/EventTypes';
import { validateTicketCode } from '@/services/eventAttendeesService';

export const processTicketScan = async (ticketCode: string): Promise<{
  success: boolean;
  message: string;
  attendee?: EventAttendee;
}> => {
  try {
    // Validate the ticket code
    const validationResult = await validateTicketCode(ticketCode);
    
    if (!validationResult.valid) {
      return validationResult;
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
      
      return {
        success: true,
        message: 'Attendee checked in successfully',
        attendee: attendeeData
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
