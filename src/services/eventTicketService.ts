
import { supabase } from '@/lib/supabase';
import { EventTicketType, EventDiscountCode } from '@/types/EventTypes';
import { v4 as uuidv4 } from 'uuid';
import { fromTable } from '@/lib/typedSupabase';

/**
 * Fetches ticket types for a specific event
 */
export const fetchEventTicketTypes = async (eventId: string): Promise<EventTicketType[]> => {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .select('*')
    .eq('event_id', eventId);
    
  if (error) {
    console.error('Error fetching ticket types:', error);
    throw new Error('Failed to fetch ticket types');
  }

  // Calculate available tickets
  return data.map(ticket => ({
    ...ticket,
    sold: ticket.quantity - (ticket.available || 0),
    available: ticket.available !== undefined ? ticket.available : ticket.quantity
  }));
};

/**
 * Checks ticket availability for a specific ticket type
 */
export const checkTicketAvailability = async (
  eventId: string,
  ticketTypeId: string
): Promise<{
  available: boolean;
  remainingQuantity: number;
  message?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .select('quantity, id')
      .eq('id', ticketTypeId)
      .eq('event_id', eventId)
      .single();

    if (error || !data) {
      throw new Error('Ticket type not found');
    }
    
    // Count sold tickets
    const { count: soldCount, error: countError } = await supabase
      .from('event_attendees')
      .select('*', { count: "exact" })
      .eq('ticket_type_id', ticketTypeId);
      
    if (countError) {
      throw new Error('Error checking ticket availability');
    }
    
    const soldTickets = soldCount || 0;
    const remainingQuantity = data.quantity - soldTickets;
    
    return {
      available: remainingQuantity > 0,
      remainingQuantity,
      message: remainingQuantity > 0 
        ? `${remainingQuantity} tickets available` 
        : 'Sold out'
    };
  } catch (error) {
    console.error("Error checking ticket availability:", error);
    throw error;
  }
};

/**
 * Process ticket purchase
 */
export const processTicketPurchase = async ({
  eventId,
  ticketTypeId,
  quantity,
  userId,
  customerName,
  customerEmail,
  discountCode,
  paymentMethodId,
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
  purchaseId?: string;
  error?: string;
}> => {
  const purchaseId = uuidv4();
  
  try {
    // Check availability
    const availability = await checkTicketAvailability(eventId, ticketTypeId);
    if (!availability.available || availability.remainingQuantity < quantity) {
      return {
        success: false,
        error: 'Insufficient ticket quantity available'
      };
    }
    
    // Get ticket price
    const { data: ticketData, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('price')
      .eq('id', ticketTypeId)
      .single();
      
    if (ticketError || !ticketData) {
      throw new Error('Could not retrieve ticket information');
    }
    
    // Handle discount if provided
    let finalPrice = ticketData.price;
    let discountAmount = 0;
    
    if (discountCode) {
      const discountResult = await applyDiscountCode(discountCode, eventId, ticketTypeId);
      
      if (discountResult.valid) {
        if (discountResult.discountType === 'percentage') {
          discountAmount = (ticketData.price * quantity) * (discountResult.discountAmount / 100);
        } else {
          discountAmount = Math.min(ticketData.price * quantity, discountResult.discountAmount * quantity);
        }
        
        finalPrice = ticketData.price - (discountAmount / quantity);
      }
    }
    
    // Process payment (placeholder for a real payment processing)
    if (paymentMethodId) {
      // We would process the payment through a payment gateway here
      console.log(`Processing payment of ${finalPrice * quantity}$ with payment method ${paymentMethodId}`);
    }
    
    // Create attendee records
    const attendees = [];
    
    for (let i = 0; i < quantity; i++) {
      const ticketCode = `E${eventId.substring(0, 4)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      attendees.push({
        event_id: eventId,
        user_id: userId,
        ticket_type_id: ticketTypeId,
        email: customerEmail,
        name: customerName,
        ticket_code: ticketCode,
        status: 'registered',
        purchase_date: new Date().toISOString()
      });
    }
    
    const { error: attendeesError } = await supabase
      .from('event_attendees')
      .insert(attendees);
      
    if (attendeesError) {
      throw new Error(`Failed to create attendee records: ${attendeesError.message}`);
    }
    
    // Record discount code usage if applicable
    if (discountCode && discountAmount > 0) {
      try {
        // Get the discount code ID
        const { data: discountData } = await supabase
          .from('event_discount_codes')
          .select('id, usage_count')
          .eq('code', discountCode)
          .eq('event_id', eventId)
          .single();
          
        if (discountData) {
          // Increment usage count
          await supabase
            .from('event_discount_codes')
            .update({ usage_count: (discountData.usage_count || 0) + 1 })
            .eq('id', discountData.id);
            
          // Record the redemption
          await supabase
            .from('event_discount_redemptions')
            .insert({
              discount_code_id: discountData.id,
              user_id: userId,
              ticket_type_id: ticketTypeId,
              order_value: ticketData.price * quantity,
              discount_value: discountAmount
            });
        }
      } catch (discountError) {
        // Just log the error but don't fail the purchase
        console.error('Error recording discount usage:', discountError);
      }
    }
    
    // Return success
    return {
      success: true,
      purchaseId
    };
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during purchase'
    };
  }
};

/**
 * Apply discount code to a ticket purchase
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
    // Check if the event_discount_codes table exists in the database
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
    
    // Check for expiration
    if (discountData.expires_at && new Date(discountData.expires_at) < new Date()) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'This discount code has expired'
      };
    }
    
    // Check for usage limit
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
          message: 'This discount code has reached its usage limit'
        };
      }
    }
    
    // Check for ticket type restrictions
    if (discountData.applicable_ticket_types && 
        discountData.applicable_ticket_types.length > 0 && 
        !discountData.applicable_ticket_types.includes(ticketTypeId)) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'This discount code is not valid for the selected ticket type'
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
    console.error("Error applying discount code:", error);
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
  attendee?: any;
  message: string;
}> => {
  try {
    // Find the attendee by ticket code
    const { data: attendee, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('*, event:event_id(*), ticket_type:ticket_type_id(*)')
      .eq('ticket_code', ticketCode)
      .single();

    if (attendeeError || !attendee) {
      return {
        success: false,
        message: 'Invalid ticket code'
      };
    }

    // Check if the ticket has already been used
    if (attendee.status === 'checked_in') {
      return {
        success: false,
        attendee,
        message: `This ticket has already been used at ${new Date(attendee.checked_in_at).toLocaleString()}`
      };
    }

    // Check if the ticket has been cancelled
    if (attendee.status === 'cancelled') {
      return {
        success: false,
        attendee,
        message: 'This ticket has been cancelled'
      };
    }

    // Update attendee status to checked in
    const { error: updateError } = await supabase
      .from('event_attendees')
      .update({
        status: 'checked_in',
        checked_in_at: new Date().toISOString()
      })
      .eq('id', attendee.id);

    if (updateError) {
      throw new Error('Failed to check in attendee');
    }

    // Record check-in
    const { error: checkInError } = await supabase
      .from('event_check_ins')
      .insert({
        event_id: attendee.event_id,
        attendee_id: attendee.id,
      });

    if (checkInError) {
      console.error('Error recording check-in:', checkInError);
      // Don't fail the overall operation if just the check-in log fails
    }

    return {
      success: true,
      attendee,
      message: 'Check-in successful'
    };
  } catch (error) {
    console.error('Error processing ticket scan:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error processing ticket'
    };
  }
};

/**
 * Create a new discount code for an event
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
    // Format the code
    const formattedCode = code.toUpperCase().trim().replace(/\s+/g, '');
    
    // Validate discount amount
    if (discountType === 'percentage' && (discountAmount < 0 || discountAmount > 100)) {
      throw new Error('Percentage discount must be between 0 and 100');
    }
    
    if (discountType === 'fixed' && discountAmount < 0) {
      throw new Error('Fixed discount amount cannot be negative');
    }
    
    // Check for duplicate codes
    const { data: existingCode } = await supabase
      .from('event_discount_codes')
      .select('id')
      .eq('code', formattedCode)
      .eq('event_id', eventId)
      .maybeSingle();
      
    if (existingCode) {
      throw new Error('A discount code with this name already exists for this event');
    }
    
    // Create the new discount code
    const { data: newCode, error: insertError } = await supabase
      .from('event_discount_codes')
      .insert({
        event_id: eventId,
        code: formattedCode,
        discount_type: discountType,
        discount_amount: discountAmount,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
        usage_limit: usageLimit || null,
        usage_count: 0,
        is_active: true,
        applicable_ticket_types: applicableTicketTypes || null,
        description: description || null
      })
      .select()
      .single();
      
    if (insertError || !newCode) {
      throw new Error(`Failed to create discount code: ${insertError?.message || 'Unknown error'}`);
    }
    
    return {
      id: newCode.id,
      event_id: newCode.event_id,
      code: newCode.code,
      discount_type: newCode.discount_type as 'percentage' | 'fixed',
      discount_amount: newCode.discount_amount,
      expires_at: newCode.expires_at,
      usage_limit: newCode.usage_limit,
      usage_count: newCode.usage_count || 0,
      is_active: newCode.is_active,
      applicable_ticket_types: newCode.applicable_ticket_types,
      description: newCode.description,
      created_at: newCode.created_at
    };
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
