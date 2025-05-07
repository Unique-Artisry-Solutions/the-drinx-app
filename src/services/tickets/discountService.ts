
import { supabase } from '@/lib/supabase';
import { EventDiscountCode } from '@/types/EventTypes';

export interface DiscountCodeResult {
  valid: boolean;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  message?: string;
}

/**
 * Applies a discount code to a ticket purchase
 */
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
    
    // Ensure the discount_type is correctly typed
    const discountType = discountCode.discount_type as 'percentage' | 'fixed';
    
    return {
      valid: true,
      discountAmount: discountCode.discount_amount,
      discountType,
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

/**
 * Creates a new discount code
 */
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
    // Convert expiresAt to ISO string if it exists
    const expiresAtString = discountData.expiresAt ? discountData.expiresAt.toISOString() : undefined;
    
    const { data, error } = await supabase
      .from('event_discount_codes')
      .insert({
        event_id: discountData.eventId,
        code: discountData.code,
        discount_type: discountData.discountType,
        discount_amount: discountData.discountAmount,
        expires_at: expiresAtString,
        usage_limit: discountData.usageLimit,
        applicable_ticket_types: discountData.applicableTicketTypes,
        description: discountData.description,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    
    // Ensure the returned data matches the EventDiscountCode type
    const typedData: EventDiscountCode = {
      ...data,
      discount_type: data.discount_type as 'percentage' | 'fixed'
    };
    
    return typedData;
  } catch (error) {
    console.error('Error creating discount code:', error);
    throw new Error('Failed to create discount code');
  }
};

/**
 * Updates the usage count for a discount code
 */
export const incrementDiscountCodeUsage = async (
  code: string,
  eventId: string
): Promise<void> => {
  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('event_discount_codes')
      .select('usage_count')
      .eq('code', code)
      .eq('event_id', eventId)
      .single();
    
    if (!fetchError && currentData) {
      const newCount = (currentData.usage_count || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('event_discount_codes')
        .update({ usage_count: newCount })
        .eq('code', code)
        .eq('event_id', eventId);
      
      if (updateError) {
        console.error('Error updating discount code usage count:', updateError);
      }
    }
  } catch (error) {
    console.error('Error incrementing discount code usage:', error);
  }
};
