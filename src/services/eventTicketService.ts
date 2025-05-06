
import { supabase } from '@/integrations/supabase/client';
import { EventDiscountCode, EventTicketType } from '@/types/EventTypes';

/**
 * Fetch all ticket types for an event
 */
export const fetchEventTicketTypes = async (eventId: string): Promise<EventTicketType[]> => {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
      
    if (error) {
      throw error;
    }
    
    // Calculate availability for each ticket type
    return data.map(ticket => ({
      ...ticket,
      // Calculate sold tickets if not provided
      sold: ticket.sold !== undefined ? ticket.sold : 0,
      // Calculate available tickets
      available: ticket.quantity - (ticket.sold || 0)
    }));
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    throw error;
  }
};

/**
 * Check ticket availability for a specific ticket type
 */
export const checkTicketAvailability = async (eventId: string, ticketTypeId: string): Promise<{
  available: boolean;
  availableQuantity: number;
  price: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('id', ticketTypeId)
      .eq('event_id', eventId)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return {
        available: false,
        availableQuantity: 0,
        price: 0
      };
    }
    
    // Calculate sold tickets if not provided
    const soldTickets = data.sold !== undefined ? data.sold : 0;
    
    // Calculate available tickets
    const availableQuantity = data.quantity - soldTickets;
    
    return {
      available: availableQuantity > 0,
      availableQuantity,
      price: data.price
    };
  } catch (error) {
    console.error('Error checking ticket availability:', error);
    throw error;
  }
};

/**
 * Apply a discount code to a ticket purchase
 */
export const applyDiscountCode = async (
  code: string,
  eventId: string,
  ticketTypeId: string
): Promise<{
  valid: boolean;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  message?: string;
}> => {
  try {
    // First, look up the discount code
    const { data: discountData, error: discountError } = await supabase
      .from('event_discount_codes')
      .select('*')
      .eq('code', code)
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
    
    // Check if the code is expired
    if (discountData.expires_at && new Date(discountData.expires_at) < new Date()) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'Discount code has expired'
      };
    }
    
    // Check if the code has reached its usage limit
    if (discountData.usage_limit !== null) {
      const { count, error: countError } = await supabase
        .from('event_discount_redemptions')
        .select('*', { count: "exact" })
        .eq('discount_code_id', discountData.id);
        
      if (!countError && count !== null && count >= discountData.usage_limit) {
        return {
          valid: false,
          discountAmount: 0,
          discountType: 'fixed',
          message: 'Discount code has reached its usage limit'
        };
      }
    }
    
    // Check if the code is applicable to this ticket type
    if (discountData.applicable_ticket_types && 
        discountData.applicable_ticket_types.length > 0 && 
        !discountData.applicable_ticket_types.includes(ticketTypeId)) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'Discount code is not applicable to this ticket type'
      };
    }
    
    // Valid discount code - ensure we cast the discount_type to the correct type
    const discountType = discountData.discount_type as 'percentage' | 'fixed';
    
    return {
      valid: true,
      discountAmount: discountData.discount_amount,
      discountType,
      message: `Discount applied: ${discountType === 'percentage' ? 
                 discountData.discount_amount + '%' : 
                 '$' + discountData.discount_amount}`
    };
  } catch (error) {
    console.error('Error applying discount code:', error);
    return {
      valid: false,
      discountAmount: 0,
      discountType: 'fixed',
      message: 'Error applying discount code'
    };
  }
};

/**
 * Process a ticket scan for event check-in
 */
export const processTicketScan = async (ticketCode: string): Promise<{
  success: boolean;
  message?: string;
  attendee?: any;
}> => {
  try {
    // Retrieve the ticket by its code
    const { data: attendee, error: attendeeError } = await supabase
      .from('event_attendees')
      .select(`
        *,
        event:event_id (
          id,
          name,
          date,
          time,
          venue:venue_id (
            id,
            name
          )
        ),
        ticket_type:ticket_type_id (
          id,
          name,
          price
        )
      `)
      .eq('ticket_code', ticketCode)
      .single();
      
    if (attendeeError || !attendee) {
      return {
        success: false,
        message: 'Invalid ticket code'
      };
    }
    
    if (attendee.status === 'checked_in') {
      return {
        success: false,
        message: 'Ticket already checked in'
      };
    }
    
    // Update the ticket status to checked_in
    const { error: updateError } = await supabase
      .from('event_attendees')
      .update({
        status: 'checked_in',
        checked_in_at: new Date().toISOString()
      })
      .eq('id', attendee.id);
      
    if (updateError) {
      console.error('Error updating ticket status:', updateError);
      return {
        success: false,
        message: 'Error updating ticket status'
      };
    }
    
    return {
      success: true,
      message: 'Ticket checked in successfully',
      attendee
    };
  } catch (error) {
    console.error('Error processing ticket scan:', error);
    return {
      success: false,
      message: 'Error processing ticket scan'
    };
  }
};

/**
 * Process a ticket purchase
 */
export const processTicketPurchase = async ({
  eventId,
  ticketTypeId,
  quantity,
  userId,
  customerName,
  customerEmail,
  discountCode,
  paymentMethodId
}: {
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
}> => {
  try {
    // Check ticket availability first
    const availabilityCheck = await checkTicketAvailability(eventId, ticketTypeId);
    
    if (!availabilityCheck.available || availabilityCheck.availableQuantity < quantity) {
      return {
        success: false,
        error: 'Not enough tickets available'
      };
    }
    
    // Calculate price with discount if applicable
    let finalPrice = availabilityCheck.price;
    let discountAmount = 0;
    
    if (discountCode) {
      const discountResult = await applyDiscountCode(discountCode, eventId, ticketTypeId);
      
      if (discountResult.valid) {
        if (discountResult.discountType === 'percentage') {
          discountAmount = finalPrice * (discountResult.discountAmount / 100);
        } else {
          discountAmount = discountResult.discountAmount;
        }
        
        // Apply the discount
        finalPrice -= discountAmount;
        
        // Ensure minimum price
        finalPrice = Math.max(0, finalPrice);
      }
    }
    
    // Create tickets
    const ticketIds: string[] = [];
    
    for (let i = 0; i < quantity; i++) {
      // Generate a unique ticket code
      const ticketCode = `${eventId.substring(0, 6)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: userId || null,
          ticket_type_id: ticketTypeId,
          name: customerName,
          email: customerEmail,
          status: 'registered',
          ticket_code: ticketCode,
        })
        .select()
        .single();
      
      if (ticketError || !ticket) {
        console.error('Error creating ticket:', ticketError);
        return {
          success: false,
          error: 'Failed to create ticket'
        };
      }
      
      ticketIds.push(ticket.id);
    }
    
    // Record discount redemption if applicable
    if (discountCode && discountAmount > 0) {
      const { data: discountData } = await supabase
        .from('event_discount_codes')
        .select('id')
        .eq('code', discountCode)
        .eq('event_id', eventId)
        .single();
        
      if (discountData) {
        // Record the redemption
        await supabase
          .from('event_discount_redemptions')
          .insert({
            discount_code_id: discountData.id,
            user_id: userId,
            ticket_type_id: ticketTypeId,
            order_value: finalPrice * quantity,
            discount_value: discountAmount * quantity
          });
          
        // Update usage count
        await supabase
          .from('event_discount_codes')
          .update({
            usage_count: supabase.rpc('increment_count', { row_id: discountData.id, table_name: 'event_discount_codes' })
          })
          .eq('id', discountData.id);
      }
    }
    
    return {
      success: true,
      ticketIds
    };
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Create a discount code for an event
 */
export const createDiscountCode = async ({
  eventId,
  code,
  discountType,
  discountAmount,
  expiresAt,
  usageLimit,
  applicableTicketTypes,
  description
}: {
  eventId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  expiresAt?: Date;
  usageLimit?: number;
  applicableTicketTypes?: string[];
  description?: string;
}): Promise<EventDiscountCode> => {
  try {
    const { data, error } = await supabase
      .from('event_discount_codes')
      .insert({
        event_id: eventId,
        code,
        discount_type: discountType,
        discount_amount: discountAmount,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
        usage_limit: usageLimit,
        applicable_ticket_types: applicableTicketTypes,
        description
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return {
      ...data,
      discount_type: data.discount_type as 'percentage' | 'fixed'
    } as EventDiscountCode;
  } catch (error) {
    console.error('Error creating discount code:', error);
    throw error;
  }
};

/**
 * Fetch discount codes for an event
 */
export const fetchEventDiscountCodes = async (eventId: string): Promise<EventDiscountCode[]> => {
  try {
    const { data, error } = await supabase
      .from('event_discount_codes')
      .select('*')
      .eq('event_id', eventId);
      
    if (error) {
      throw error;
    }
    
    return data.map(code => ({
      ...code,
      discount_type: code.discount_type as 'percentage' | 'fixed'
    })) as EventDiscountCode[];
  } catch (error) {
    console.error('Error fetching discount codes:', error);
    throw error;
  }
};
