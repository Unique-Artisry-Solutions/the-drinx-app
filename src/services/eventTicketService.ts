
import { supabase } from '@/integrations/supabase/client';
import { EventTicketType, EventAttendee, EventDiscountCode } from '@/types/EventTypes';

export interface CreateDiscountCodeRequest {
  event_id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  expiresAt?: Date;
  usageLimit?: number;
  applicableTicketTypes?: string[];
  description?: string;
}

export interface TicketPurchaseRequest {
  event_id: string;
  ticketTypeId: string;
  quantity: number;
  userId?: string;
  customerName: string;
  customerEmail: string;
  discountCode?: string;
  paymentMethodId?: string;
}

export interface TicketPurchaseResult {
  success: boolean;
  error?: string;
  attendeeIds?: string[];
  totalAmount?: number;
  discountApplied?: number;
}

export interface DiscountValidationResult {
  valid: boolean;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  message?: string;
}

export interface TicketAvailabilityResult {
  available: boolean;
  remaining: number;
  message?: string;
}

export interface EventSalesSummary {
  totalRevenue: number;
  totalTicketsSold: number;
  ticketTypeBreakdown: {
    name: string;
    sold: number;
    revenue: number;
  }[];
  discountUsage: {
    code: string;
    usage: number;
    discount: number;
  }[];
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
    console.error('Error fetching event ticket types:', error);
    throw new Error(`Failed to fetch ticket types: ${error.message}`);
  }

  return data || [];
}

/**
 * Apply a discount code to a ticket purchase
 */
export async function applyDiscountCode(
  code: string,
  eventId: string,
  ticketTypeId: string
): Promise<DiscountValidationResult> {
  const { data, error } = await supabase
    .from('event_discount_codes')
    .select('*')
    .eq('code', code)
    .eq('event_id', eventId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return {
      valid: false,
      discountAmount: 0,
      discountType: 'fixed',
      message: 'Invalid discount code'
    };
  }

  // Check if code has expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return {
      valid: false,
      discountAmount: 0,
      discountType: 'fixed',
      message: 'Discount code has expired'
    };
  }

  // Check usage limit
  if (data.usage_limit && data.usage_count >= data.usage_limit) {
    return {
      valid: false,
      discountAmount: 0,
      discountType: 'fixed',
      message: 'Discount code usage limit reached'
    };
  }

  // Check if applicable to this ticket type
  if (data.applicable_ticket_types && !data.applicable_ticket_types.includes(ticketTypeId)) {
    return {
      valid: false,
      discountAmount: 0,
      discountType: 'fixed',
      message: 'Discount code not applicable to this ticket type'
    };
  }

  return {
    valid: true,
    discountAmount: data.discount_amount,
    discountType: data.discount_type as 'percentage' | 'fixed',
    message: 'Discount code applied successfully'
  };
}

/**
 * Check ticket availability for a specific ticket type
 */
export async function checkTicketAvailability(
  eventId: string,
  ticketTypeId: string
): Promise<TicketAvailabilityResult> {
  const { data: ticketType, error } = await supabase
    .from('event_ticket_types')
    .select('*')
    .eq('id', ticketTypeId)
    .eq('event_id', eventId)
    .single();

  if (error || !ticketType) {
    return {
      available: false,
      remaining: 0,
      message: 'Ticket type not found'
    };
  }

  // Count sold tickets
  const { data: soldTickets, error: soldError } = await supabase
    .from('event_attendees')
    .select('id')
    .eq('event_id', eventId)
    .eq('ticket_type_id', ticketTypeId)
    .neq('status', 'cancelled');

  if (soldError) {
    console.error('Error checking sold tickets:', soldError);
    return {
      available: false,
      remaining: 0,
      message: 'Error checking availability'
    };
  }

  const soldCount = soldTickets?.length || 0;
  const remaining = ticketType.quantity - soldCount;

  return {
    available: remaining > 0,
    remaining: Math.max(0, remaining),
    message: remaining > 0 ? `${remaining} tickets remaining` : 'Sold out'
  };
}

/**
 * Process a ticket purchase
 */
export async function processTicketPurchase(
  purchase: TicketPurchaseRequest
): Promise<TicketPurchaseResult> {
  // Check availability first
  const availability = await checkTicketAvailability(purchase.event_id, purchase.ticketTypeId);
  
  if (!availability.available || availability.remaining < purchase.quantity) {
    return {
      success: false,
      error: 'Insufficient tickets available'
    };
  }

  // Get ticket type for pricing
  const { data: ticketType, error: ticketError } = await supabase
    .from('event_ticket_types')
    .select('*')
    .eq('id', purchase.ticketTypeId)
    .single();

  if (ticketError || !ticketType) {
    return {
      success: false,
      error: 'Ticket type not found'
    };
  }

  let totalAmount = ticketType.price * purchase.quantity;
  let discountApplied = 0;

  // Apply discount if provided
  if (purchase.discountCode) {
    const discountResult = await applyDiscountCode(
      purchase.discountCode,
      purchase.event_id,
      purchase.ticketTypeId
    );

    if (discountResult.valid) {
      if (discountResult.discountType === 'percentage') {
        discountApplied = totalAmount * (discountResult.discountAmount / 100);
      } else {
        discountApplied = Math.min(totalAmount, discountResult.discountAmount * purchase.quantity);
      }
      totalAmount -= discountApplied;
    }
  }

  // Create attendee records
  const attendeeRecords = Array.from({ length: purchase.quantity }, (_, index) => ({
    event_id: purchase.event_id,
    user_id: purchase.userId || null,
    ticket_type_id: purchase.ticketTypeId,
    email: purchase.customerEmail,
    name: purchase.customerName,
    status: 'registered' as const,
    ticket_code: `TICKET-${Date.now()}-${index}`,
    purchase_date: new Date().toISOString(),
    custom_fields: {}
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

  // Update discount usage if applied
  if (purchase.discountCode && discountApplied > 0) {
    await supabase
      .from('event_discount_codes')
      .update({ 
        usage_count: supabase.sql`usage_count + 1` 
      })
      .eq('code', purchase.discountCode)
      .eq('event_id', purchase.event_id);
  }

  return {
    success: true,
    attendeeIds: attendees?.map(a => a.id) || [],
    totalAmount,
    discountApplied
  };
}

/**
 * Create a new discount code
 */
export async function createDiscountCode(
  discountData: CreateDiscountCodeRequest
): Promise<EventDiscountCode> {
  const { data, error } = await supabase
    .from('event_discount_codes')
    .insert({
      event_id: discountData.event_id,
      code: discountData.code,
      discount_type: discountData.discountType,
      discount_amount: discountData.discountAmount,
      expires_at: discountData.expiresAt?.toISOString(),
      usage_limit: discountData.usageLimit,
      applicable_ticket_types: discountData.applicableTicketTypes,
      description: discountData.description,
      usage_count: 0,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating discount code:', error);
    throw new Error(`Failed to create discount code: ${error.message}`);
  }

  return data as EventDiscountCode;
}

/**
 * Fetch all attendees for an event
 */
export async function fetchEventAttendees(eventId: string): Promise<EventAttendee[]> {
  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      *,
      event_ticket_types (
        id,
        name,
        price
      )
    `)
    .eq('event_id', eventId)
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error('Error fetching event attendees:', error);
    throw new Error(`Failed to fetch attendees: ${error.message}`);
  }

  return (data || []).map(attendee => ({
    ...attendee,
    status: attendee.status as 'registered' | 'checked_in' | 'cancelled' | 'no_show',
    custom_fields: attendee.custom_fields as Record<string, any> || {}
  }));
}

/**
 * Check in an attendee
 */
export async function checkInAttendee(attendeeId: string): Promise<EventAttendee> {
  const { data, error } = await supabase
    .from('event_attendees')
    .update({ 
      status: 'checked_in',
      checked_in_at: new Date().toISOString()
    })
    .eq('id', attendeeId)
    .select(`
      *,
      event_ticket_types (
        id,
        name,
        price
      )
    `)
    .single();

  if (error) {
    console.error('Error checking in attendee:', error);
    throw new Error(`Failed to check in attendee: ${error.message}`);
  }

  return {
    ...data,
    status: data.status as 'registered' | 'checked_in' | 'cancelled' | 'no_show',
    custom_fields: data.custom_fields as Record<string, any> || {}
  };
}

/**
 * Update attendee information
 */
export async function updateAttendee(
  attendeeId: string,
  updates: Partial<EventAttendee>
): Promise<EventAttendee> {
  const { data, error } = await supabase
    .from('event_attendees')
    .update(updates)
    .eq('id', attendeeId)
    .select(`
      *,
      event_ticket_types (
        id,
        name,
        price
      )
    `)
    .single();

  if (error) {
    console.error('Error updating attendee:', error);
    throw new Error(`Failed to update attendee: ${error.message}`);
  }

  return {
    ...data,
    status: data.status as 'registered' | 'checked_in' | 'cancelled' | 'no_show',
    custom_fields: data.custom_fields as Record<string, any> || {}
  };
}

/**
 * Get event sales summary
 */
export async function getEventSalesSummary(eventId: string): Promise<EventSalesSummary> {
  // For now, we'll calculate this manually since the RPC doesn't exist
  // Get all attendees
  const { data: attendees } = await supabase
    .from('event_attendees')
    .select(`
      *,
      event_ticket_types (
        name,
        price
      )
    `)
    .eq('event_id', eventId)
    .neq('status', 'cancelled');

  // Get discount usage
  const { data: discountRedemptions } = await supabase
    .from('event_discount_redemptions')
    .select(`
      *,
      event_discount_codes (
        code
      )
    `)
    .eq('event_discount_codes.event_id', eventId);

  const ticketTypeBreakdown: { [key: string]: { name: string; sold: number; revenue: number } } = {};
  let totalRevenue = 0;
  let totalTicketsSold = 0;

  // Calculate ticket type breakdown
  attendees?.forEach(attendee => {
    const ticketType = attendee.event_ticket_types;
    if (ticketType) {
      const key = ticketType.name;
      if (!ticketTypeBreakdown[key]) {
        ticketTypeBreakdown[key] = {
          name: ticketType.name,
          sold: 0,
          revenue: 0
        };
      }
      ticketTypeBreakdown[key].sold += 1;
      ticketTypeBreakdown[key].revenue += ticketType.price;
      totalRevenue += ticketType.price;
      totalTicketsSold += 1;
    }
  });

  // Calculate discount usage
  const discountUsage: { [key: string]: { code: string; usage: number; discount: number } } = {};
  discountRedemptions?.forEach(redemption => {
    const code = redemption.event_discount_codes?.code;
    if (code) {
      if (!discountUsage[code]) {
        discountUsage[code] = {
          code,
          usage: 0,
          discount: 0
        };
      }
      discountUsage[code].usage += 1;
      discountUsage[code].discount += redemption.discount_value;
    }
  });

  return {
    totalRevenue,
    totalTicketsSold,
    ticketTypeBreakdown: Object.values(ticketTypeBreakdown),
    discountUsage: Object.values(discountUsage)
  };
}

/**
 * Process ticket scan (QR code scanning)
 */
export async function processTicketScan(ticketCode: string, eventId: string): Promise<EventAttendee> {
  const { data: attendee, error } = await supabase
    .from('event_attendees')
    .select(`
      *,
      events (
        id,
        name,
        date,
        time,
        venue_id
      )
    `)
    .eq('ticket_code', ticketCode)
    .eq('event_id', eventId)
    .single();

  if (error || !attendee) {
    throw new Error('Invalid ticket code or ticket not found');
  }

  // Check if already checked in
  if (attendee.status === 'checked_in') {
    return {
      ...attendee,
      status: attendee.status as 'registered' | 'checked_in' | 'cancelled' | 'no_show',
      custom_fields: attendee.custom_fields as Record<string, any> || {}
    };
  }

  // Check in the attendee
  return await checkInAttendee(attendee.id);
}
