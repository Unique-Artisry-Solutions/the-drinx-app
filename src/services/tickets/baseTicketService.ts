
import { supabase } from '@/integrations/supabase/client';
import { EventAttendee } from '@/types/EventTypes';
import { toAttendeeStatus } from '@/utils/typeGuards';

export const processTicketScan = async (
  ticketCode: string
): Promise<{ success: boolean; message: string; attendee?: EventAttendee }> => {
  try {
    // Look up the ticket code
    const { data, error } = await supabase
      .from('event_attendees')
      .select('*, event:event_id(name, status)')
      .eq('ticket_code', ticketCode)
      .single();

    if (error) {
      return {
        success: false,
        message: 'Invalid ticket code'
      };
    }

    if (!data) {
      return {
        success: false,
        message: 'Ticket not found'
      };
    }

    // Check if the ticket is already used
    if (data.status === 'checked_in') {
      return {
        success: false,
        message: 'Ticket has already been used',
        attendee: {
          id: data.id,
          event_id: data.event_id,
          user_id: data.user_id || undefined,
          email: data.email || undefined,
          name: data.name || undefined,
          ticket_type_id: data.ticket_type_id || undefined,
          purchase_date: data.purchase_date,
          checked_in_at: data.checked_in_at,
          status: toAttendeeStatus(data.status),
          ticket_code: data.ticket_code,
          notes: data.notes,
          custom_fields: data.custom_fields || {}
        }
      };
    }

    // Check if the ticket is cancelled
    if (data.status === 'cancelled') {
      return {
        success: false,
        message: 'This ticket has been cancelled',
        attendee: {
          id: data.id,
          event_id: data.event_id,
          user_id: data.user_id || undefined,
          email: data.email || undefined,
          name: data.name || undefined,
          ticket_type_id: data.ticket_type_id || undefined,
          purchase_date: data.purchase_date,
          checked_in_at: data.checked_in_at || undefined,
          status: toAttendeeStatus(data.status),
          ticket_code: data.ticket_code,
          notes: data.notes,
          custom_fields: data.custom_fields || {}
        }
      };
    }

    // Check if the event is valid
    if (data.event?.status === 'cancelled') {
      return {
        success: false,
        message: 'This event has been cancelled',
        attendee: {
          id: data.id,
          event_id: data.event_id,
          user_id: data.user_id || undefined,
          email: data.email || undefined,
          name: data.name || undefined,
          ticket_type_id: data.ticket_type_id || undefined,
          purchase_date: data.purchase_date,
          checked_in_at: data.checked_in_at || undefined,
          status: toAttendeeStatus(data.status),
          ticket_code: data.ticket_code,
          notes: data.notes,
          custom_fields: data.custom_fields || {}
        }
      };
    }

    // All validations passed - the ticket is valid
    return {
      success: true,
      message: `Valid ticket for ${data.name || 'attendee'} - ${data.event?.name || 'event'}`,
      attendee: {
        id: data.id,
        event_id: data.event_id,
        user_id: data.user_id || undefined,
        email: data.email || undefined,
        name: data.name || undefined,
        ticket_type_id: data.ticket_type_id || undefined,
        purchase_date: data.purchase_date,
        checked_in_at: data.checked_in_at || undefined,
        status: toAttendeeStatus(data.status),
        ticket_code: data.ticket_code,
        notes: data.notes,
        custom_fields: data.custom_fields || {}
      }
    };
  } catch (error) {
    console.error("Error processing ticket scan:", error);
    return {
      success: false,
      message: 'An error occurred while processing the ticket'
    };
  }
};
