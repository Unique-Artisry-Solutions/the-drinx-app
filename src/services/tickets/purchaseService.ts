
import { supabase } from '@/lib/supabase';
import { applyDiscount } from './discountService';

interface PurchaseResult {
  success: boolean;
  error?: string;
  orderId?: string;
  ticketCode?: string;
}

/**
 * Processes a ticket purchase
 */
export const purchaseTicket = async ({
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
}): Promise<PurchaseResult> => {
  try {
    // Get ticket type details
    const { data: ticketType, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('price, name')
      .eq('id', ticketTypeId)
      .single();
      
    if (ticketError || !ticketType) {
      return { 
        success: false, 
        error: 'Invalid ticket type' 
      };
    }
    
    // Apply discount if provided
    let finalPrice = ticketType.price;
    if (discountCode) {
      const discountResult = await applyDiscount(discountCode, eventId, ticketTypeId);
      
      if (discountResult.valid && discountResult.discountAmount) {
        if (discountResult.discountType === 'percentage') {
          finalPrice = finalPrice * (1 - (discountResult.discountAmount / 100));
        } else {
          finalPrice = Math.max(0, finalPrice - discountResult.discountAmount);
        }
      }
    }
    
    // Generate a unique ticket code
    const ticketCode = `EVT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Create attendee record
    const { data: attendee, error: attendeeError } = await supabase
      .from('event_attendees')
      .insert({
        event_id: eventId,
        ticket_type_id: ticketTypeId,
        user_id: userId || null,
        name: customerName,
        email: customerEmail,
        ticket_code: ticketCode,
        status: 'registered',
        custom_fields: {
          payment_method_id: paymentMethodId,
          purchase_price: finalPrice * quantity
        }
      })
      .select()
      .single();
      
    if (attendeeError) {
      return { 
        success: false, 
        error: `Error creating attendee record: ${attendeeError.message}` 
      };
    }
    
    // If we have a discount code, increment its usage count
    if (discountCode) {
      // First, get the current count
      const { data: discountData } = await supabase
        .from('event_discount_codes')
        .select('usage_count')
        .eq('code', discountCode)
        .eq('event_id', eventId)
        .single();
      
      // Then update with incremented count
      if (discountData) {
        const newCount = (discountData.usage_count || 0) + 1;
        await supabase
          .from('event_discount_codes')
          .update({ usage_count: newCount })
          .eq('code', discountCode)
          .eq('event_id', eventId);
      }
    }
    
    return {
      success: true,
      orderId: attendee.id,
      ticketCode
    };
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    return { 
      success: false, 
      error: 'Error processing ticket purchase' 
    };
  }
};

// Alias for compatibility
export const processTicketPurchase = purchaseTicket;
