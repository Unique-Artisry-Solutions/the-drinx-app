
import { supabase } from '@/integrations/supabase/client';
import { EventTicketType, EventDiscountCode } from '@/types/EventTypes';

export interface CreateTicketTypeRequest {
  event_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface UpdateTicketTypeRequest {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
}

export interface CreateDiscountCodeRequest {
  eventId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  expiresAt?: Date;
  usageLimit?: number;
  applicableTicketTypes?: string[];
  description?: string;
}

export interface TicketPurchaseRequest {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  userId?: string;
  discountCode?: string;
  paymentMethodId?: string;
}

export interface TicketPurchaseResponse {
  success: boolean;
  attendeeIds?: string[];
  totalAmount?: number;
  discountApplied?: number;
  error?: string;
}

export interface DiscountValidationResult {
  valid: boolean;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  message?: string;
}

/**
 * Fetch all ticket types for an event
 */
export async function fetchEventTicketTypes(eventId: string): Promise<EventTicketType[]> {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching ticket types:', error);
    throw new Error(`Failed to fetch ticket types: ${error.message}`);
  }

  // Add sold and available counts
  const ticketTypesWithCounts = await Promise.all(
    (data || []).map(async (ticketType) => {
      const { data: attendees, error: attendeeError } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('ticket_type_id', ticketType.id)
        .neq('status', 'cancelled');

      if (attendeeError) {
        console.error('Error fetching attendee count:', attendeeError);
      }

      const sold = attendees?.length || 0;
      const available = Math.max(0, ticketType.quantity - sold);

      return {
        ...ticketType,
        sold,
        available
      };
    })
  );

  return ticketTypesWithCounts;
}

/**
 * Create a new ticket type
 */
export async function createTicketType(ticketType: CreateTicketTypeRequest): Promise<EventTicketType> {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .insert({
      event_id: ticketType.event_id,
      name: ticketType.name,
      description: ticketType.description,
      price: ticketType.price,
      quantity: ticketType.quantity
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating ticket type:', error);
    throw new Error(`Failed to create ticket type: ${error.message}`);
  }

  return {
    ...data,
    sold: 0,
    available: data.quantity
  };
}

/**
 * Update an existing ticket type
 */
export async function updateTicketType(
  ticketTypeId: string,
  updates: UpdateTicketTypeRequest
): Promise<EventTicketType> {
  const { data, error } = await supabase
    .from('event_ticket_types')
    .update(updates)
    .eq('id', ticketTypeId)
    .select()
    .single();

  if (error) {
    console.error('Error updating ticket type:', error);
    throw new Error(`Failed to update ticket type: ${error.message}`);
  }

  // Get sold count
  const { data: attendees, error: attendeeError } = await supabase
    .from('event_attendees')
    .select('id')
    .eq('ticket_type_id', ticketTypeId)
    .neq('status', 'cancelled');

  if (attendeeError) {
    console.error('Error fetching attendee count:', attendeeError);
  }

  const sold = attendees?.length || 0;
  const available = Math.max(0, data.quantity - sold);

  return {
    ...data,
    sold,
    available
  };
}

/**
 * Delete a ticket type
 */
export async function deleteTicketType(ticketTypeId: string): Promise<void> {
  // Check if there are any sold tickets for this type
  const { data: attendees, error: checkError } = await supabase
    .from('event_attendees')
    .select('id')
    .eq('ticket_type_id', ticketTypeId)
    .neq('status', 'cancelled');

  if (checkError) {
    console.error('Error checking ticket sales:', checkError);
    throw new Error('Failed to verify ticket sales');
  }

  if (attendees && attendees.length > 0) {
    throw new Error('Cannot delete ticket type with existing sales');
  }

  const { error } = await supabase
    .from('event_ticket_types')
    .delete()
    .eq('id', ticketTypeId);

  if (error) {
    console.error('Error deleting ticket type:', error);
    throw new Error(`Failed to delete ticket type: ${error.message}`);
  }
}

/**
 * Check ticket availability
 */
export async function checkTicketAvailability(
  eventId: string,
  ticketTypeId: string
): Promise<{ available: number; total: number }> {
  const { data: ticketType, error: ticketError } = await supabase
    .from('event_ticket_types')
    .select('quantity')
    .eq('id', ticketTypeId)
    .eq('event_id', eventId)
    .single();

  if (ticketError) {
    console.error('Error fetching ticket type:', ticketError);
    throw new Error('Ticket type not found');
  }

  const { data: attendees, error: attendeeError } = await supabase
    .from('event_attendees')
    .select('id')
    .eq('ticket_type_id', ticketTypeId)
    .neq('status', 'cancelled');

  if (attendeeError) {
    console.error('Error fetching attendee count:', attendeeError);
    throw new Error('Failed to check availability');
  }

  const sold = attendees?.length || 0;
  const available = Math.max(0, ticketType.quantity - sold);

  return {
    available,
    total: ticketType.quantity
  };
}

/**
 * Apply discount code validation
 */
export async function applyDiscountCode(
  code: string,
  eventId: string,
  ticketTypeId: string
): Promise<DiscountValidationResult> {
  const { data: discount, error } = await supabase
    .from('event_discount_codes')
    .select('*')
    .eq('code', code)
    .eq('event_id', eventId)
    .eq('is_active', true)
    .single();

  if (error || !discount) {
    return {
      valid: false,
      discountAmount: 0,
      discountType: 'fixed',
      message: 'Invalid discount code'
    };
  }

  // Check if expired
  if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
    return {
      valid: false,
      discountAmount: 0,
      discountType: discount.discount_type,
      message: 'Discount code has expired'
    };
  }

  // Check usage limit
  if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
    return {
      valid: false,
      discountAmount: 0,
      discountType: discount.discount_type,
      message: 'Discount code usage limit reached'
    };
  }

  // Check if applicable to this ticket type
  if (discount.applicable_ticket_types && discount.applicable_ticket_types.length > 0) {
    if (!discount.applicable_ticket_types.includes(ticketTypeId)) {
      return {
        valid: false,
        discountAmount: 0,
        discountType: discount.discount_type,
        message: 'Discount code not applicable to this ticket type'
      };
    }
  }

  return {
    valid: true,
    discountAmount: discount.discount_amount,
    discountType: discount.discount_type,
    message: 'Discount code applied successfully'
  };
}

/**
 * Create a new discount code
 */
export async function createDiscountCode(request: CreateDiscountCodeRequest): Promise<EventDiscountCode> {
  const { data, error } = await supabase
    .from('event_discount_codes')
    .insert({
      event_id: request.eventId,
      code: request.code.toUpperCase(),
      discount_type: request.discountType,
      discount_amount: request.discountAmount,
      expires_at: request.expiresAt?.toISOString(),
      usage_limit: request.usageLimit,
      applicable_ticket_types: request.applicableTicketTypes,
      description: request.description,
      usage_count: 0,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating discount code:', error);
    throw new Error(`Failed to create discount code: ${error.message}`);
  }

  return data;
}

/**
 * Process ticket purchase
 */
export async function processTicketPurchase(request: TicketPurchaseRequest): Promise<TicketPurchaseResponse> {
  try {
    // Check availability
    const availability = await checkTicketAvailability(request.eventId, request.ticketTypeId);
    if (availability.available < request.quantity) {
      return {
        success: false,
        error: 'Not enough tickets available'
      };
    }

    // Get ticket type for pricing
    const { data: ticketType, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('price')
      .eq('id', request.ticketTypeId)
      .single();

    if (ticketError) {
      return {
        success: false,
        error: 'Ticket type not found'
      };
    }

    let discountAmount = 0;
    let discountCodeId: string | undefined;

    // Apply discount if provided
    if (request.discountCode) {
      const discountResult = await applyDiscountCode(
        request.discountCode,
        request.eventId,
        request.ticketTypeId
      );

      if (discountResult.valid) {
        if (discountResult.discountType === 'percentage') {
          discountAmount = (ticketType.price * discountResult.discountAmount) / 100;
        } else {
          discountAmount = discountResult.discountAmount;
        }

        // Get discount code ID for redemption tracking
        const { data: discountCode } = await supabase
          .from('event_discount_codes')
          .select('id')
          .eq('code', request.discountCode.toUpperCase())
          .eq('event_id', request.eventId)
          .single();

        discountCodeId = discountCode?.id;
      }
    }

    const finalPrice = Math.max(0, ticketType.price - discountAmount);
    const totalAmount = finalPrice * request.quantity;

    // Create attendee records
    const attendeeRecords = Array.from({ length: request.quantity }, (_, index) => ({
      event_id: request.eventId,
      user_id: request.userId || null,
      ticket_type_id: request.ticketTypeId,
      email: request.customerEmail,
      name: request.customerName,
      status: 'registered',
      purchase_date: new Date().toISOString(),
      ticket_code: `${request.eventId.slice(0, 8)}-${Date.now()}-${index + 1}`
    }));

    const { data: attendees, error: attendeeError } = await supabase
      .from('event_attendees')
      .insert(attendeeRecords)
      .select('id');

    if (attendeeError) {
      console.error('Error creating attendees:', attendeeError);
      return {
        success: false,
        error: 'Failed to create ticket records'
      };
    }

    // Track discount code usage if applied
    if (discountCodeId) {
      await supabase
        .from('event_discount_codes')
        .update({ usage_count: supabase.sql`usage_count + 1` })
        .eq('id', discountCodeId);

      // Record discount redemption
      await supabase
        .from('event_discount_redemptions')
        .insert({
          discount_code_id: discountCodeId,
          user_id: request.userId || null,
          ticket_type_id: request.ticketTypeId,
          order_value: totalAmount + (discountAmount * request.quantity),
          discount_value: discountAmount * request.quantity
        });
    }

    return {
      success: true,
      attendeeIds: attendees?.map(a => a.id) || [],
      totalAmount,
      discountApplied: discountAmount * request.quantity
    };
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    return {
      success: false,
      error: 'Failed to process purchase'
    };
  }
}

/**
 * Get ticket sales summary for an event
 */
export async function getTicketSalesSummary(eventId: string): Promise<{
  totalSold: number;
  totalRevenue: number;
  ticketTypeBreakdown: Array<{
    ticketTypeId: string;
    name: string;
    sold: number;
    revenue: number;
  }>;
}> {
  const { data: ticketTypes, error: ticketError } = await supabase
    .from('event_ticket_types')
    .select('id, name, price')
    .eq('event_id', eventId);

  if (ticketError) {
    console.error('Error fetching ticket types:', ticketError);
    throw new Error('Failed to fetch ticket types');
  }

  const breakdown = await Promise.all(
    (ticketTypes || []).map(async (ticketType) => {
      const { data: attendees, error: attendeeError } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('ticket_type_id', ticketType.id)
        .neq('status', 'cancelled');

      if (attendeeError) {
        console.error('Error fetching attendee count:', attendeeError);
      }

      const sold = attendees?.length || 0;
      const revenue = sold * ticketType.price;

      return {
        ticketTypeId: ticketType.id,
        name: ticketType.name,
        sold,
        revenue
      };
    })
  );

  const totalSold = breakdown.reduce((sum, item) => sum + item.sold, 0);
  const totalRevenue = breakdown.reduce((sum, item) => sum + item.revenue, 0);

  return {
    totalSold,
    totalRevenue,
    ticketTypeBreakdown: breakdown
  };
}
