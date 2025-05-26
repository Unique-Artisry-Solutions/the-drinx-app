
import { supabase } from '@/integrations/supabase/client';
import { EventTicketType, EventDiscountCode, EventAttendee } from '@/types/EventTypes';
import { TicketScanResult } from '@/types/TicketScanTypes';

export interface DiscountValidationResult {
  valid: boolean;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  message?: string;
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
  ticketCodes?: string[];
  totalAmount?: number;
  error?: string;
}

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

export interface TicketAvailabilityResult {
  available: boolean;
  remaining: number;
  message?: string;
}

/**
 * Fetch all ticket types for an event
 */
export async function fetchEventTicketTypes(eventId: string): Promise<EventTicketType[]> {
  try {
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
  } catch (error) {
    console.error('Error in fetchEventTicketTypes:', error);
    throw error;
  }
}

/**
 * Apply a discount code to a ticket type
 */
export async function applyDiscountCode(
  code: string,
  eventId: string,
  ticketTypeId: string
): Promise<DiscountValidationResult> {
  try {
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
        message: 'Invalid or expired discount code'
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
    if (data.applicable_ticket_types && 
        !data.applicable_ticket_types.includes(ticketTypeId)) {
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
      message: `Discount applied: ${data.description || 'Discount code valid'}`
    };
  } catch (error) {
    console.error('Error applying discount code:', error);
    return {
      valid: false,
      discountAmount: 0,
      discountType: 'fixed',
      message: 'Error validating discount code'
    };
  }
}

/**
 * Create a new discount code
 */
export async function createDiscountCode(
  discountData: CreateDiscountCodeRequest
): Promise<EventDiscountCode> {
  try {
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
        is_active: true,
        usage_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating discount code:', error);
      throw new Error(`Failed to create discount code: ${error.message}`);
    }

    return data as EventDiscountCode;
  } catch (error) {
    console.error('Error in createDiscountCode:', error);
    throw error;
  }
}

/**
 * Check ticket availability for a specific ticket type
 */
export async function checkTicketAvailability(
  eventId: string,
  ticketTypeId: string
): Promise<TicketAvailabilityResult> {
  try {
    // Get ticket type info
    const { data: ticketType, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('quantity')
      .eq('id', ticketTypeId)
      .eq('event_id', eventId)
      .single();

    if (ticketError || !ticketType) {
      return {
        available: false,
        remaining: 0,
        message: 'Ticket type not found'
      };
    }

    // Count sold tickets
    const { count: soldCount, error: countError } = await supabase
      .from('event_attendees')
      .select('id', { count: 'exact' })
      .eq('event_id', eventId)
      .eq('ticket_type_id', ticketTypeId)
      .not('status', 'eq', 'cancelled');

    if (countError) {
      console.error('Error counting sold tickets:', countError);
      return {
        available: false,
        remaining: 0,
        message: 'Error checking availability'
      };
    }

    const remaining = ticketType.quantity - (soldCount || 0);
    
    return {
      available: remaining > 0,
      remaining: Math.max(0, remaining),
      message: remaining > 0 ? `${remaining} tickets available` : 'Sold out'
    };
  } catch (error) {
    console.error('Error checking ticket availability:', error);
    return {
      available: false,
      remaining: 0,
      message: 'Error checking availability'
    };
  }
}

/**
 * Process a ticket purchase
 */
export async function processTicketPurchase(
  purchaseData: TicketPurchaseRequest
): Promise<TicketPurchaseResult> {
  try {
    // Check availability first
    const availability = await checkTicketAvailability(
      purchaseData.event_id,
      purchaseData.ticketTypeId
    );

    if (!availability.available || availability.remaining < purchaseData.quantity) {
      return {
        success: false,
        error: 'Insufficient tickets available'
      };
    }

    // Get ticket type for pricing
    const { data: ticketType, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('price')
      .eq('id', purchaseData.ticketTypeId)
      .single();

    if (ticketError || !ticketType) {
      return {
        success: false,
        error: 'Ticket type not found'
      };
    }

    let totalAmount = ticketType.price * purchaseData.quantity;
    
    // Apply discount if provided
    if (purchaseData.discountCode) {
      const discountResult = await applyDiscountCode(
        purchaseData.discountCode,
        purchaseData.event_id,
        purchaseData.ticketTypeId
      );

      if (discountResult.valid) {
        if (discountResult.discountType === 'percentage') {
          totalAmount = totalAmount * (1 - discountResult.discountAmount / 100);
        } else {
          totalAmount = Math.max(0, totalAmount - discountResult.discountAmount);
        }
      }
    }

    // Create attendee records
    const attendeeRecords = Array.from({ length: purchaseData.quantity }, (_, i) => ({
      event_id: purchaseData.event_id,
      ticket_type_id: purchaseData.ticketTypeId,
      user_id: purchaseData.userId,
      name: purchaseData.customerName,
      email: purchaseData.customerEmail,
      status: 'registered' as const,
      ticket_code: `${purchaseData.event_id}-${Date.now()}-${i + 1}`,
      purchase_date: new Date().toISOString()
    }));

    const { data: attendees, error: attendeeError } = await supabase
      .from('event_attendees')
      .insert(attendeeRecords)
      .select('ticket_code');

    if (attendeeError) {
      console.error('Error creating attendee records:', attendeeError);
      return {
        success: false,
        error: 'Failed to process ticket purchase'
      };
    }

    return {
      success: true,
      ticketCodes: attendees?.map(a => a.ticket_code).filter(Boolean) || [],
      totalAmount
    };
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    return {
      success: false,
      error: 'Failed to process ticket purchase'
    };
  }
}

/**
 * Process ticket scan for check-in
 */
export async function processTicketScan(
  ticketCode: string,
  eventId?: string
): Promise<TicketScanResult> {
  try {
    // Find the attendee by ticket code
    let query = supabase
      .from('event_attendees')
      .select('*')
      .eq('ticket_code', ticketCode);

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data: attendee, error } = await query.single();

    if (error || !attendee) {
      return {
        success: false,
        message: 'Invalid ticket code or ticket not found'
      };
    }

    // Check if already checked in
    if (attendee.checked_in_at) {
      return {
        success: false,
        message: 'Ticket already checked in',
        attendee: attendee as EventAttendee
      };
    }

    // Check if ticket is cancelled
    if (attendee.status === 'cancelled') {
      return {
        success: false,
        message: 'Ticket has been cancelled',
        attendee: attendee as EventAttendee
      };
    }

    // Update check-in status
    const { data: updatedAttendee, error: updateError } = await supabase
      .from('event_attendees')
      .update({
        checked_in_at: new Date().toISOString(),
        status: 'checked_in'
      })
      .eq('id', attendee.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating check-in status:', updateError);
      return {
        success: false,
        message: 'Failed to check in ticket'
      };
    }

    return {
      success: true,
      message: 'Successfully checked in',
      attendee: updatedAttendee as EventAttendee
    };
  } catch (error) {
    console.error('Error processing ticket scan:', error);
    return {
      success: false,
      message: 'Error processing ticket scan'
    };
  }
}
