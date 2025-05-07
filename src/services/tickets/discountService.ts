
import { supabase } from '@/lib/supabase';

export interface DiscountCodeResult {
  valid: boolean;
  message: string;
  discountType?: 'percentage' | 'fixed';
  discountAmount?: number;
  code?: string;
}

/**
 * Applies a discount code to a ticket
 */
export const applyDiscount = async (code: string, eventId: string, ticketTypeId?: string): Promise<DiscountCodeResult> => {
  try {
    // Validate the discount code
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
        message: 'Invalid or expired discount code' 
      };
    }
    
    // Check if code expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { 
        valid: false, 
        message: 'This discount code has expired' 
      };
    }
    
    // Check usage limit
    if (data.usage_limit && data.usage_count >= data.usage_limit) {
      return { 
        valid: false, 
        message: 'This discount code has reached its usage limit' 
      };
    }
    
    // Check if applicable to this ticket type
    if (ticketTypeId && 
        data.applicable_ticket_types && 
        data.applicable_ticket_types.length > 0 && 
        !data.applicable_ticket_types.includes(ticketTypeId)) {
      return {
        valid: false,
        message: 'This discount code is not valid for this ticket type'
      };
    }
    
    return {
      valid: true,
      message: 'Discount code applied successfully',
      discountType: data.discount_type as 'percentage' | 'fixed',
      discountAmount: data.discount_amount,
      code: data.code
    };
  } catch (error) {
    console.error('Error applying discount code:', error);
    return { 
      valid: false, 
      message: 'Error processing discount code' 
    };
  }
};

/**
 * Creates a new discount code
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
}) => {
  const { data, error } = await supabase
    .from('event_discount_codes')
    .insert({
      event_id: eventId,
      code,
      discount_type: discountType,
      discount_amount: discountAmount,
      expires_at: expiresAt,
      usage_limit: usageLimit,
      applicable_ticket_types: applicableTicketTypes,
      description: description || `${discountType === 'percentage' ? discountAmount + '%' : '$' + discountAmount} off`
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Error creating discount code: ${error.message}`);
  }
  
  return data;
};

// Alias for compatibility
export const applyDiscountCode = applyDiscount;
