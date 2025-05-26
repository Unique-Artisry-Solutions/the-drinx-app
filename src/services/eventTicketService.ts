
import { supabase } from '@/integrations/supabase/client';
import { EventAttendee, EventTicketType, EventDiscountCode } from '@/types/EventTypes';

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
  event_id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_amount: number;
  description?: string;
  expires_at?: string;
  usage_limit?: number;
  applicable_ticket_types?: string[];
}

export interface TicketPurchaseRequest {
  event_id: string;
  ticket_type_id: string;
  user_id?: string;
  name?: string;
  email?: string;
  quantity?: number;
  custom_fields?: Record<string, any>;
}

export interface TicketScanResult {
  success: boolean;
  attendee?: EventAttendee;
  message: string;
  alreadyCheckedIn?: boolean;
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

  return data || [];
}

/**
 * Create a new ticket type
 */
export async function createTicketType(
  ticketType: CreateTicketTypeRequest
): Promise<EventTicketType> {
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

  return data;
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

  return data;
}

/**
 * Delete a ticket type
 */
export async function deleteTicketType(ticketTypeId: string): Promise<void> {
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
 * Fetch all attendees for an event
 */
export async function fetchEventAttendees(eventId: string): Promise<EventAttendee[]> {
  const { data, error } = await supabase
    .from('event_attendees')
    .select(`
      *,
      event_ticket_types(name, price)
    `)
    .eq('event_id', eventId)
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error('Error fetching attendees:', error);
    throw new Error(`Failed to fetch attendees: ${error.message}`);
  }

  return data || [];
}

/**
 * Purchase tickets for an event
 */
export async function purchaseTickets(
  purchase: TicketPurchaseRequest
): Promise<EventAttendee> {
  const ticketCode = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const { data, error } = await supabase
    .from('event_attendees')
    .insert({
      event_id: purchase.event_id,
      ticket_type_id: purchase.ticket_type_id,
      user_id: purchase.user_id,
      name: purchase.name,
      email: purchase.email,
      ticket_code: ticketCode,
      custom_fields: purchase.custom_fields || {},
      status: 'registered'
    })
    .select(`
      *,
      event_ticket_types(name, price)
    `)
    .single();

  if (error) {
    console.error('Error purchasing tickets:', error);
    throw new Error(`Failed to purchase tickets: ${error.message}`);
  }

  return data;
}

/**
 * Check in an attendee
 */
export async function checkInAttendee(
  attendeeId: string,
  checkedInBy?: string,
  location?: string,
  notes?: string
): Promise<EventAttendee> {
  // First update the attendee record
  const { data: attendee, error: attendeeError } = await supabase
    .from('event_attendees')
    .update({ 
      checked_in_at: new Date().toISOString(),
      status: 'checked_in'
    })
    .eq('id', attendeeId)
    .select(`
      *,
      event_ticket_types(name, price)
    `)
    .single();

  if (attendeeError) {
    console.error('Error checking in attendee:', attendeeError);
    throw new Error(`Failed to check in attendee: ${attendeeError.message}`);
  }

  // Create a check-in record
  const { error: checkInError } = await supabase
    .from('event_check_ins')
    .insert({
      event_id: attendee.event_id,
      attendee_id: attendeeId,
      checked_in_by: checkedInBy,
      location,
      notes
    });

  if (checkInError) {
    console.error('Error creating check-in record:', checkInError);
    // Don't throw here as the main check-in was successful
  }

  return attendee;
}

/**
 * Fetch all discount codes for an event
 */
export async function fetchEventDiscountCodes(eventId: string): Promise<EventDiscountCode[]> {
  const { data, error } = await supabase
    .from('event_discount_codes')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching discount codes:', error);
    throw new Error(`Failed to fetch discount codes: ${error.message}`);
  }

  return (data || []).map(code => ({
    ...code,
    discount_type: code.discount_type as 'percentage' | 'fixed'
  }));
}

/**
 * Create a new discount code
 */
export async function createDiscountCode(
  discountCode: CreateDiscountCodeRequest
): Promise<EventDiscountCode> {
  const { data, error } = await supabase
    .from('event_discount_codes')
    .insert({
      event_id: discountCode.event_id,
      code: discountCode.code,
      discount_type: discountCode.discount_type,
      discount_amount: discountCode.discount_amount,
      description: discountCode.description,
      expires_at: discountCode.expires_at,
      usage_limit: discountCode.usage_limit,
      applicable_ticket_types: discountCode.applicable_ticket_types || []
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating discount code:', error);
    throw new Error(`Failed to create discount code: ${error.message}`);
  }

  return {
    ...data,
    discount_type: data.discount_type as 'percentage' | 'fixed'
  };
}

/**
 * Validate and apply a discount code
 */
export async function validateDiscountCode(
  eventId: string,
  code: string,
  ticketTypeId?: string
): Promise<{ valid: boolean; discount?: EventDiscountCode; message: string }> {
  const { data, error } = await supabase
    .from('event_discount_codes')
    .select('*')
    .eq('event_id', eventId)
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return {
      valid: false,
      message: 'Invalid discount code'
    };
  }

  const discountCode = {
    ...data,
    discount_type: data.discount_type as 'percentage' | 'fixed'
  };

  // Check expiration
  if (discountCode.expires_at && new Date(discountCode.expires_at) < new Date()) {
    return {
      valid: false,
      message: 'Discount code has expired'
    };
  }

  // Check usage limit
  if (discountCode.usage_limit && discountCode.usage_count >= discountCode.usage_limit) {
    return {
      valid: false,
      message: 'Discount code usage limit reached'
    };
  }

  // Check applicable ticket types
  if (ticketTypeId && discountCode.applicable_ticket_types && 
      discountCode.applicable_ticket_types.length > 0 && 
      !discountCode.applicable_ticket_types.includes(ticketTypeId)) {
    return {
      valid: false,
      message: 'Discount code not applicable to this ticket type'
    };
  }

  return {
    valid: true,
    discount: discountCode,
    message: 'Discount code is valid'
  };
}

/**
 * Generate event sales report
 */
export async function generateSalesReport(eventId: string): Promise<{
  totalRevenue: number;
  totalTicketsSold: number;
  ticketTypeBreakdown: Array<{
    name: string;
    sold: number;
    revenue: number;
  }>;
  discountUsage: Array<{
    code: string;
    usage: number;
    discount: number;
  }>;
}> {
  // Get ticket sales data
  const { data: salesData, error: salesError } = await supabase
    .rpc('get_event_sales_summary', { p_event_id: eventId });

  if (salesError) {
    console.error('Error generating sales report:', salesError);
    throw new Error(`Failed to generate sales report: ${salesError.message}`);
  }

  return salesData || {
    totalRevenue: 0,
    totalTicketsSold: 0,
    ticketTypeBreakdown: [],
    discountUsage: []
  };
}

/**
 * Process ticket scan for check-in
 */
export async function processTicketScan(ticketCode: string): Promise<TicketScanResult> {
  try {
    // Find the attendee by ticket code
    const { data: attendee, error } = await supabase
      .from('event_attendees')
      .select(`
        *,
        event_ticket_types(name, price),
        events(name)
      `)
      .eq('ticket_code', ticketCode)
      .single();

    if (error || !attendee) {
      return {
        success: false,
        message: 'Invalid ticket code'
      };
    }

    // Check if already checked in
    if (attendee.checked_in_at) {
      return {
        success: false,
        attendee,
        message: 'Attendee already checked in',
        alreadyCheckedIn: true
      };
    }

    // Check in the attendee
    const checkedInAttendee = await checkInAttendee(attendee.id);

    return {
      success: true,
      attendee: checkedInAttendee,
      message: 'Check-in successful'
    };
  } catch (error: any) {
    console.error('Error processing ticket scan:', error);
    return {
      success: false,
      message: error.message || 'Failed to process ticket scan'
    };
  }
}
