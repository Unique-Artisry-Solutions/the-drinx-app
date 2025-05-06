import { supabase } from '@/integrations/supabase/client';
import { EventAttendee, EventTicketType } from '@/types/EventTypes';
import { checkInAttendee } from './eventAttendeesService';

/**
 * Fetch ticket types for an event
 */
export async function fetchEventTicketTypes(eventId: string): Promise<EventTicketType[]> {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    if (error) throw error;

    // Get ticket sales data for available counts
    const { data: attendeeData, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, status')
      .eq('event_id', eventId);

    if (attendeeError) throw attendeeError;

    // Calculate sales counts manually since we can't use .group()
    const salesByTicketType: Record<string, number> = {};
    
    // Count tickets that haven't been cancelled
    attendeeData.forEach(attendee => {
      if (attendee.status !== 'cancelled' && attendee.ticket_type_id) {
        salesByTicketType[attendee.ticket_type_id] = (salesByTicketType[attendee.ticket_type_id] || 0) + 1;
      }
    });

    // Calculate available tickets and add to response
    return data.map(ticket => {
      const sold = salesByTicketType[ticket.id] || 0;
      const available = ticket.quantity - sold;
      
      return {
        id: ticket.id,
        name: ticket.name,
        description: ticket.description,
        price: ticket.price,
        quantity: ticket.quantity,
        sold,
        available
      };
    });
  } catch (error) {
    console.error('Error fetching event ticket types:', error);
    throw error;
  }
}

/**
 * Create a new ticket type
 */
export async function createTicketType(ticketType: Omit<EventTicketType, 'id'> & { event_id: string }): Promise<EventTicketType> {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .insert(ticketType)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      sold: 0,
      available: data.quantity
    };
  } catch (error) {
    console.error('Error creating ticket type:', error);
    throw error;
  }
}

/**
 * Update a ticket type
 */
export async function updateTicketType(id: string, updates: Partial<EventTicketType>): Promise<EventTicketType> {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Get sales count manually since we can't use .count() with filters directly
    const { data: attendeeData, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('id')
      .eq('ticket_type_id', id)
      .neq('status', 'cancelled');
      
    if (attendeeError) throw attendeeError;
    
    const sold = attendeeData.length;
    
    return {
      ...data,
      sold,
      available: data.quantity - sold
    };
  } catch (error) {
    console.error('Error updating ticket type:', error);
    throw error;
  }
}

/**
 * Delete a ticket type (if no tickets have been sold)
 */
export async function deleteTicketType(id: string): Promise<void> {
  try {
    // Check if tickets have been sold
    const { data: attendeeData, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('id')
      .eq('ticket_type_id', id);
      
    if (attendeeError) throw attendeeError;
    
    if (attendeeData.length > 0) {
      throw new Error(`Cannot delete ticket type with ${attendeeData.length} tickets sold`);
    }
    
    const { error } = await supabase
      .from('event_ticket_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting ticket type:', error);
    throw error;
  }
}

/**
 * Process a ticket scan
 */
export async function processTicketScan(
  ticketCode: string,
  location?: string,
  notes?: string
): Promise<{
  success: boolean;
  message: string;
  attendee?: EventAttendee;
}> {
  try {
    // First validate the ticket
    const { data: attendeeData, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('ticket_code', ticketCode)
      .single();
      
    if (attendeeError) {
      return {
        success: false,
        message: 'Invalid ticket code'
      };
    }
    
    const attendee = attendeeData as EventAttendee;
    
    // Check if ticket has already been used
    if (attendee.status === 'checked_in') {
      return {
        success: false,
        message: 'Ticket has already been used',
        attendee
      };
    }
    
    // Check if ticket is cancelled
    if (attendee.status === 'cancelled') {
      return {
        success: false,
        message: 'Ticket has been cancelled',
        attendee
      };
    }
    
    // Process the check-in
    const updatedAttendee = await checkInAttendee(
      attendee.event_id, 
      attendee.id as string, 
      location, 
      notes
    );
    
    return {
      success: true,
      message: 'Check-in successful',
      attendee: updatedAttendee
    };
  } catch (error) {
    console.error('Error processing ticket scan:', error);
    return {
      success: false,
      message: `Error processing ticket: ${(error as Error).message}`
    };
  }
}

/**
 * Generate a QR code for a ticket 
 * (In a real app, we would encode more data and add security)
 */
export function generateTicketCode(eventId: string, attendeeId: string): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${eventId.substring(0, 4)}-${attendeeId.substring(0, 4)}-${random}`;
}

/**
 * Apply a discount code to a ticket purchase
 */
export async function applyDiscountCode(
  code: string, 
  eventId: string, 
  ticketTypeId: string
): Promise<{
  valid: boolean;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  message?: string;
}> {
  try {
    // Check if the discount code exists and is valid for this event
    const { data: discountData, error: discountError } = await supabase
      .from('event_discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('event_id', eventId)
      .eq('is_active', true)
      .single();
      
    if (discountError || !discountData) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'Invalid discount code'
      };
    }
    
    // Check if the code has expired
    if (discountData.expires_at && new Date(discountData.expires_at) < new Date()) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'Discount code has expired'
      };
    }
    
    // Check if usage limit has been reached
    if (discountData.usage_limit) {
      const { count, error: usageError } = await supabase
        .from('event_discount_redemptions')
        .select('*', { count: 'exact', head: true })
        .eq('discount_code_id', discountData.id);
        
      if (usageError) throw usageError;
      
      if (count && count >= discountData.usage_limit) {
        return {
          valid: false,
          discountAmount: 0,
          discountType: 'fixed',
          message: 'Discount code usage limit reached'
        };
      }
    }
    
    // Check if the discount is applicable for this ticket type
    if (discountData.applicable_ticket_types && 
        Array.isArray(discountData.applicable_ticket_types) && 
        !discountData.applicable_ticket_types.includes(ticketTypeId)) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'Discount code not applicable for this ticket type'
      };
    }
    
    return {
      valid: true,
      discountAmount: discountData.discount_amount,
      discountType: discountData.discount_type as 'percentage' | 'fixed',
      message: 'Discount applied successfully'
    };
  } catch (error) {
    console.error('Error applying discount code:', error);
    return {
      valid: false,
      discountAmount: 0,
      discountType: 'fixed',
      message: `Error: ${(error as Error).message}`
    };
  }
}

/**
 * Create a new discount code
 */
export async function createDiscountCode(discountData: {
  eventId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  expiresAt?: Date;
  usageLimit?: number;
  applicableTicketTypes?: string[];
  description?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('event_discount_codes')
      .insert({
        event_id: discountData.eventId,
        code: discountData.code.toUpperCase(),
        discount_type: discountData.discountType,
        discount_amount: discountData.discountAmount,
        expires_at: discountData.expiresAt,
        usage_limit: discountData.usageLimit,
        applicable_ticket_types: discountData.applicableTicketTypes,
        description: discountData.description,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating discount code:', error);
    throw error;
  }
}

/**
 * Check ticket availability for an event
 */
export async function checkTicketAvailability(
  eventId: string,
  ticketTypeId: string
): Promise<{
  available: boolean;
  remainingTickets: number;
  totalCapacity: number;
}> {
  try {
    // Get the ticket type details
    const { data: ticketType, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('id', ticketTypeId)
      .single();
      
    if (ticketError) throw ticketError;
    
    // Count tickets sold (excluding cancelled)
    const { count, error: soldError } = await supabase
      .from('event_attendees')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('ticket_type_id', ticketTypeId)
      .neq('status', 'cancelled');
      
    if (soldError) throw soldError;
    
    const soldCount = count || 0;
    const remainingTickets = ticketType.quantity - soldCount;
    
    return {
      available: remainingTickets > 0,
      remainingTickets,
      totalCapacity: ticketType.quantity
    };
  } catch (error) {
    console.error('Error checking ticket availability:', error);
    throw error;
  }
}

/**
 * Process ticket purchase with payment gateway
 */
export async function processTicketPurchase(purchaseData: {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  userId?: string;
  customerName: string;
  customerEmail: string;
  discountCode?: string;
  paymentMethodId?: string;
}): Promise<{
  success: boolean;
  ticketIds?: string[];
  error?: string;
  transactionId?: string;
}> {
  try {
    // Get ticket type details
    const { data: ticketType, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('id', purchaseData.ticketTypeId)
      .single();
      
    if (ticketError) throw ticketError;
    
    // Check availability
    const availability = await checkTicketAvailability(
      purchaseData.eventId,
      purchaseData.ticketTypeId
    );
    
    if (!availability.available || availability.remainingTickets < purchaseData.quantity) {
      return {
        success: false,
        error: `Only ${availability.remainingTickets} tickets available`
      };
    }
    
    // Apply discount if provided
    let finalPrice = ticketType.price;
    let discountId = null;
    
    if (purchaseData.discountCode) {
      const discount = await applyDiscountCode(
        purchaseData.discountCode,
        purchaseData.eventId,
        purchaseData.ticketTypeId
      );
      
      if (discount.valid) {
        if (discount.discountType === 'percentage') {
          finalPrice = ticketType.price * (1 - (discount.discountAmount / 100));
        } else {
          finalPrice = Math.max(0, ticketType.price - discount.discountAmount);
        }
        
        // Get discount ID for recording
        const { data: discountData } = await supabase
          .from('event_discount_codes')
          .select('id')
          .eq('code', purchaseData.discountCode.toUpperCase())
          .single();
          
        if (discountData) {
          discountId = discountData.id;
        }
      }
    }
    
    // Create a transaction record - in a production app, this would integrate with a payment gateway
    const { data: transaction, error: transactionError } = await supabase
      .from('ticket_purchases')
      .insert({
        event_id: purchaseData.eventId,
        user_id: purchaseData.userId,
        ticket_type_id: purchaseData.ticketTypeId,
        quantity: purchaseData.quantity,
        price_per_ticket: finalPrice,
        total_amount: finalPrice * purchaseData.quantity,
        discount_code_id: discountId,
        payment_status: 'completed', // In production, this would be pending until confirmed
        contact_name: purchaseData.customerName,
        contact_email: purchaseData.customerEmail,
        payment_method_id: purchaseData.paymentMethodId,
        purchase_date: new Date().toISOString()
      })
      .select()
      .single();
      
    if (transactionError) throw transactionError;
    
    // Create attendee records
    const attendees = [];
    for (let i = 0; i < purchaseData.quantity; i++) {
      const ticketCode = generateTicketCode(purchaseData.eventId, i.toString());
      
      const { data: attendee, error: attendeeError } = await supabase
        .from('event_attendees')
        .insert({
          event_id: purchaseData.eventId,
          user_id: purchaseData.userId,
          ticket_type_id: purchaseData.ticketTypeId,
          status: 'registered',
          email: purchaseData.customerEmail,
          name: purchaseData.customerName,
          ticket_code: ticketCode,
          purchase_date: new Date().toISOString()
        })
        .select()
        .single();
        
      if (attendeeError) throw attendeeError;
      attendees.push(attendee);
    }
    
    // If discount was used, record redemption
    if (discountId) {
      await supabase
        .from('event_discount_redemptions')
        .insert({
          discount_code_id: discountId,
          transaction_id: transaction.id,
          user_id: purchaseData.userId,
          redeemed_at: new Date().toISOString()
        });
    }
    
    return {
      success: true,
      ticketIds: attendees.map(a => a.id),
      transactionId: transaction.id
    };
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}
