
import { supabase } from '@/integrations/supabase/client';

export interface DiscountCodeResult {
  valid: boolean;
  message: string;
  code: any; // The discount code object if valid, null otherwise
  discountType?: 'percentage' | 'fixed';
  discountAmount?: number;
}

export const fetchEventTicketTypes = async (eventId: string) => {
  return await getEventTicketTypes(eventId);
};

export const getEventTicketTypes = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .select('*')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching ticket types:', error);
    throw error;
  }

  // Add sold and available properties
  const ticketTypes = await Promise.all(data.map(async (ticketType) => {
    // Get sales count
    const { count: soldCount, error: countError } = await supabase
      .from('event_attendees')
      .select('*', { count: 'exact', head: true })
      .eq('ticket_type_id', ticketType.id)
      .neq('status', 'cancelled');
    
    if (countError) {
      console.error('Error counting ticket sales:', countError);
      return {
        ...ticketType,
        sold: 0,
        available: ticketType.quantity
      };
    }
    
    return {
      ...ticketType,
      sold: soldCount || 0,
      available: ticketType.quantity - (soldCount || 0)
    };
  }));

  return ticketTypes;
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
}) => {
  try {
    const { data, error } = await supabase
      .from('event_discount_codes')
      .insert({
        event_id: discountData.eventId,
        code: discountData.code,
        discount_type: discountData.discountType,
        discount_amount: discountData.discountAmount,
        expires_at: discountData.expiresAt?.toISOString(),
        usage_limit: discountData.usageLimit,
        applicable_ticket_types: discountData.applicableTicketTypes,
        description: discountData.description,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating discount code:', error);
    throw new Error(error.message || 'Failed to create discount code');
  }
};

export const checkTicketAvailability = async (eventId: string, ticketTypeId: string) => {
  try {
    // Get ticket type details
    const { data: ticketType, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('id', ticketTypeId)
      .single();

    if (ticketError) throw ticketError;

    // Count sold tickets
    const { count, error: countError } = await supabase
      .from('event_attendees')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('ticket_type_id', ticketTypeId)
      .neq('status', 'cancelled');

    if (countError) throw countError;

    const available = ticketType.quantity - (count || 0);
    
    return {
      available,
      hasInventory: available > 0,
      soldOut: available <= 0,
      percentRemaining: ticketType.quantity > 0 ? (available / ticketType.quantity) * 100 : 0
    };
  } catch (error) {
    console.error('Error checking ticket availability:', error);
    throw error;
  }
};

export const processTicketPurchase = async (purchaseData: {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  userId?: string;
  discountCode?: string;
  paymentMethodId?: string;
}) => {
  try {
    // Verify ticket availability
    const availability = await checkTicketAvailability(
      purchaseData.eventId, 
      purchaseData.ticketTypeId
    );

    if (availability.available < purchaseData.quantity) {
      return {
        success: false,
        error: 'Not enough tickets available'
      };
    }

    // Process discount if provided
    let discountValue = 0;
    if (purchaseData.discountCode) {
      const discountResult = await applyDiscountCode(
        purchaseData.discountCode,
        purchaseData.eventId,
        purchaseData.ticketTypeId
      );

      if (discountResult.valid && discountResult.code) {
        // Calculate discount
        // Logic would go here
      }
    }

    // Create attendee records
    const attendees = [];
    for (let i = 0; i < purchaseData.quantity; i++) {
      const ticketCode = `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      attendees.push({
        event_id: purchaseData.eventId,
        ticket_type_id: purchaseData.ticketTypeId,
        name: purchaseData.customerName,
        email: purchaseData.customerEmail,
        user_id: purchaseData.userId || null,
        status: 'registered',
        purchase_date: new Date().toISOString(),
        ticket_code: ticketCode
      });
    }

    // Insert the attendees
    const { data, error } = await supabase
      .from('event_attendees')
      .insert(attendees)
      .select();

    if (error) throw error;

    return {
      success: true,
      tickets: data,
      ticketCount: data.length
    };
  } catch (error: any) {
    console.error('Error processing ticket purchase:', error);
    return {
      success: false,
      error: error.message || 'Failed to process ticket purchase'
    };
  }
};

export const processTicketScan = async (eventId: string, ticketCode: string) => {
  try {
    // Find the ticket
    const { data: ticket, error: findError } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId)
      .eq('ticket_code', ticketCode)
      .single();

    if (findError) {
      return {
        success: false,
        error: 'Ticket not found'
      };
    }

    // Check if already checked in
    if (ticket.status === 'checked_in') {
      return {
        success: false,
        error: 'Ticket already checked in',
        ticket
      };
    }

    // Update status to checked in
    const { error: updateError } = await supabase
      .from('event_attendees')
      .update({
        status: 'checked_in',
        checked_in_at: new Date().toISOString()
      })
      .eq('id', ticket.id);

    if (updateError) {
      return {
        success: false,
        error: 'Failed to update ticket status'
      };
    }

    // Create check-in record
    const { error: checkInError } = await supabase
      .from('event_check_ins')
      .insert({
        event_id: eventId,
        attendee_id: ticket.id,
        checked_in_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (checkInError) {
      console.error('Failed to create check-in record:', checkInError);
    }

    return {
      success: true,
      ticket: {
        ...ticket,
        status: 'checked_in',
        checked_in_at: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error('Error processing ticket scan:', error);
    return {
      success: false,
      error: error.message || 'Failed to process ticket scan'
    };
  }
};

export const applyDiscountCode = async (
  code: string, 
  eventId: string, 
  ticketTypeId: string
): Promise<DiscountCodeResult> => {
  try {
    // Find the discount code
    const { data, error } = await supabase
      .from('event_discount_codes')
      .select('*')
      .eq('event_id', eventId)
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error) {
      return {
        valid: false,
        message: 'Invalid discount code',
        code: null
      };
    }

    // Check if code is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return {
        valid: false,
        message: 'Discount code has expired',
        code: null
      };
    }

    // Check usage limit
    if (data.usage_limit && data.usage_count >= data.usage_limit) {
      return {
        valid: false,
        message: 'Discount code has reached its usage limit',
        code: null
      };
    }

    // Check if ticket type is eligible
    if (data.applicable_ticket_types && 
        data.applicable_ticket_types.length > 0 && 
        !data.applicable_ticket_types.includes(ticketTypeId)) {
      return {
        valid: false,
        message: 'Discount code not applicable for this ticket type',
        code: null
      };
    }

    return {
      valid: true,
      message: 'Valid discount code',
      code: data,
      discountType: data.discount_type,
      discountAmount: data.discount_amount
    };
  } catch (error) {
    console.error('Error applying discount code:', error);
    return {
      valid: false,
      message: 'Error validating discount code',
      code: null
    };
  }
};
