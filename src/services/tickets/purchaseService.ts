
import { supabase } from '@/lib/supabase';
import { EventAttendee } from '@/types/EventTypes';
import { checkTicketAvailability } from './ticketTypeService';
import { applyDiscountCode, incrementDiscountCodeUsage } from './discountService';

/**
 * Processes a ticket purchase
 */
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
        await incrementDiscountCodeUsage(
          purchaseData.discountCode,
          purchaseData.eventId
        );
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
      
      // Convert to the correct type with proper handling of custom_fields
      const typedAttendee: EventAttendee = {
        ...attendee,
        status: attendee.status as "registered" | "checked_in" | "cancelled" | "no_show",
        custom_fields: attendee.custom_fields as Record<string, any> || {}
      };
      
      attendees.push(typedAttendee);
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
