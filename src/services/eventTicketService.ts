
import { supabase } from '@/lib/supabase';
import { EventAttendee, EventTicketType, EventDiscountCode } from '@/types/EventTypes';
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

export const fetchEventTicketTypes = async (eventId: string): Promise<EventTicketType[]> => {
  try {
    const { data, error } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching event ticket types:', error);
    throw new Error('Failed to fetch ticket types');
  }
};

export interface DiscountCodeResult {
  valid: boolean;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  message?: string;
}

export const applyDiscountCode = async (
  code: string, 
  eventId: string, 
  ticketTypeId: string
): Promise<DiscountCodeResult> => {
  try {
    // Find the discount code
    const { data: discountCode, error } = await supabase
      .from('event_discount_codes')
      .select('*')
      .eq('code', code)
      .eq('event_id', eventId)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    
    // If no code found or inactive
    if (!discountCode) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'Invalid or expired discount code'
      };
    }

    // Check if the code is applicable to the ticket type
    if (
      discountCode.applicable_ticket_types &&
      discountCode.applicable_ticket_types.length > 0 &&
      !discountCode.applicable_ticket_types.includes(ticketTypeId)
    ) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'This discount code is not valid for this ticket type'
      };
    }
    
    // Check if usage limit is reached
    if (discountCode.usage_limit && discountCode.usage_count >= discountCode.usage_limit) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'This discount code has reached its usage limit'
      };
    }
    
    // Check if expired
    if (discountCode.expires_at && new Date(discountCode.expires_at) < new Date()) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: 'fixed',
        message: 'This discount code has expired'
      };
    }
    
    return {
      valid: true,
      discountAmount: discountCode.discount_amount,
      discountType: discountCode.discount_type as 'percentage' | 'fixed',
      message: 'Discount applied successfully'
    };
  } catch (error) {
    console.error('Error applying discount code:', error);
    return {
      valid: false,
      discountAmount: 0,
      discountType: 'fixed',
      message: 'Error processing discount code'
    };
  }
};

export const createDiscountCode = async (discountData: {
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
        event_id: discountData.eventId,
        code: discountData.code,
        discount_type: discountData.discountType,
        discount_amount: discountData.discountAmount,
        expires_at: discountData.expiresAt,
        usage_limit: discountData.usageLimit,
        applicable_ticket_types: discountData.applicableTicketTypes,
        description: discountData.description,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating discount code:', error);
    throw new Error('Failed to create discount code');
  }
};

export const checkTicketAvailability = async (eventId: string, ticketTypeId: string): Promise<{
  available: boolean;
  remaining: number;
  total: number;
}> => {
  try {
    // Get ticket type information
    const { data: ticketType, error: ticketTypeError } = await supabase
      .from('event_ticket_types')
      .select('quantity')
      .eq('id', ticketTypeId)
      .eq('event_id', eventId)
      .single();
      
    if (ticketTypeError) throw ticketTypeError;
    
    // Count sold tickets
    const { count: soldCount, error: countError } = await supabase
      .from('event_attendees')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('ticket_type_id', ticketTypeId)
      .not('status', 'eq', 'cancelled');
      
    if (countError) throw countError;
    
    const total = ticketType.quantity;
    const sold = soldCount || 0;
    const remaining = total - sold;
    
    return {
      available: remaining > 0,
      remaining,
      total
    };
  } catch (error) {
    console.error('Error checking ticket availability:', error);
    throw new Error('Failed to check ticket availability');
  }
};

export const processTicketPurchase = async (purchaseData: {
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
  attendees?: EventAttendee[];
  error?: string;
}> => {
  try {
    // Check availability
    const availability = await checkTicketAvailability(
      purchaseData.eventId,
      purchaseData.ticketTypeId
    );
    
    if (!availability.available || availability.remaining < purchaseData.quantity) {
      return {
        success: false,
        error: `Not enough tickets available. Only ${availability.remaining} remaining.`
      };
    }
    
    // Get ticket type for price
    const { data: ticketType, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('price')
      .eq('id', purchaseData.ticketTypeId)
      .single();
      
    if (ticketError) throw ticketError;
    
    // Apply discount if provided
    let finalPrice = ticketType.price;
    if (purchaseData.discountCode) {
      const discountResult = await applyDiscountCode(
        purchaseData.discountCode,
        purchaseData.eventId,
        purchaseData.ticketTypeId
      );
      
      if (discountResult.valid) {
        if (discountResult.discountType === 'percentage') {
          finalPrice = ticketType.price * (1 - discountResult.discountAmount / 100);
        } else {
          finalPrice = Math.max(0, ticketType.price - discountResult.discountAmount);
        }
        
        // Update usage count for the discount code
        await supabase
          .from('event_discount_codes')
          .update({ usage_count: supabase.rpc('increment', { inc: 1 }) })
          .eq('code', purchaseData.discountCode)
          .eq('event_id', purchaseData.eventId);
      }
    }
    
    // Create the attendees
    const attendees: EventAttendee[] = [];
    for (let i = 0; i < purchaseData.quantity; i++) {
      // Generate a unique ticket code
      const ticketCode = `${purchaseData.eventId.substring(0, 6)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Create the attendee
      const { data: attendee, error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: purchaseData.eventId,
          user_id: purchaseData.userId || null,
          ticket_type_id: purchaseData.ticketTypeId,
          email: purchaseData.customerEmail,
          name: purchaseData.customerName,
          status: 'registered',
          ticket_code: ticketCode,
        })
        .select()
        .single();
        
      if (error) throw error;
      attendees.push(attendee);
    }
    
    // In a real app, you would integrate with a payment processor here
    // using paymentMethodId
    
    return {
      success: true,
      attendees
    };
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    return {
      success: false,
      error: 'Failed to process payment or create tickets'
    };
  }
};
