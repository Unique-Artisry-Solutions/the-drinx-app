
// Basic discount service implementation - will be expanded later
import { supabase } from '@/integrations/supabase/client';

export const getEventDiscountCodes = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_discount_codes')
    .select('*')
    .eq('event_id', eventId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching discount codes:', error);
    throw error;
  }

  return data;
};

export const validateDiscountCode = async (code: string, eventId: string) => {
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

  return {
    valid: true,
    message: 'Valid discount code',
    code: data
  };
};

export const applyDiscountCode = async (code: string, eventId: string, ticketTypeId: string) => {
  const validation = await validateDiscountCode(code, eventId);
  
  if (!validation.valid) {
    return validation;
  }
  
  // Check if ticket type is eligible for this discount
  if (validation.code?.applicable_ticket_types && 
      validation.code.applicable_ticket_types.length > 0 && 
      !validation.code.applicable_ticket_types.includes(ticketTypeId)) {
    return {
      valid: false,
      message: 'Discount code not applicable for this ticket type',
      code: null
    };
  }
  
  return validation;
};
