
import { supabase } from '@/integrations/supabase/client';
import { PromotionCode } from '@/types/PromotionTypes';

// Interface for discount codes
interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  establishment_id: string;
  is_active: boolean;
  usage_limit?: number | null;
  used_count?: number | null;
  valid_days?: string[] | null;
  valid_hours?: {
    start: string;
    end: string;
  } | null;
  min_purchase_amount?: number | null;
  combinable: boolean;
  created_at: string;
  updated_at: string;
}

// Function to get discount code by code
export const getDiscountCodeByCode = async (code: string): Promise<DiscountCode | null> => {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching discount code:', error);
      return null;
    }

    return data as DiscountCode;
  } catch (error) {
    console.error('Unexpected error fetching discount code:', error);
    return null;
  }
};

// Function to track discount code usage
export const trackDiscountCodeUsage = async (codeId: string): Promise<boolean> => {
  try {
    const { data: code } = await supabase
      .from('establishment_promotions')
      .select('usage_limit, used_count')
      .eq('id', codeId)
      .single();

    // If the code has a usage limit and has reached it, return false
    if (code && code.usage_limit !== null && code.used_count >= code.usage_limit) {
      return false;
    }

    // Update the used_count
    const { error } = await supabase
      .from('establishment_promotions')
      .update({ used_count: (code?.used_count || 0) + 1 })
      .eq('id', codeId);

    if (error) {
      console.error('Error updating discount code usage:', error);
      return false;
    }

    // Log the usage in audit logs
    await logCodeUsage(codeId, 'redeem');

    return true;
  } catch (error) {
    console.error('Unexpected error tracking discount code usage:', error);
    return false;
  }
};

// Function to validate discount code
export const validateDiscountCode = async (
  code: string,
  subtotal: number = 0
): Promise<{ valid: boolean; code: DiscountCode | null; message?: string }> => {
  const discountCode = await getDiscountCodeByCode(code);

  if (!discountCode) {
    return { valid: false, code: null, message: 'Invalid code' };
  }

  // Check if code is active
  if (!discountCode.is_active) {
    return { valid: false, code: discountCode, message: 'This code is no longer active' };
  }

  // Check usage limit
  if (
    discountCode.usage_limit !== null &&
    discountCode.usage_limit > 0 &&
    (discountCode.used_count || 0) >= discountCode.usage_limit
  ) {
    return { valid: false, code: discountCode, message: 'This code has reached its usage limit' };
  }

  // Check start and end dates
  const now = new Date();
  const startDate = new Date(discountCode.start_date);

  if (now < startDate) {
    return { valid: false, code: discountCode, message: 'This code is not yet active' };
  }

  if (discountCode.end_date) {
    const endDate = new Date(discountCode.end_date);
    if (now > endDate) {
      return { valid: false, code: discountCode, message: 'This code has expired' };
    }
  }

  // Check minimum purchase amount
  if (discountCode.min_purchase_amount && subtotal < discountCode.min_purchase_amount) {
    return {
      valid: false,
      code: discountCode,
      message: `Minimum purchase of $${discountCode.min_purchase_amount.toFixed(2)} required`
    };
  }

  // Check valid days if specified
  if (discountCode.valid_days && discountCode.valid_days.length > 0) {
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    if (!discountCode.valid_days.includes(dayOfWeek)) {
      return { valid: false, code: discountCode, message: `This code is not valid on ${dayOfWeek}` };
    }
  }

  // Check valid hours if specified
  if (discountCode.valid_hours) {
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const startHour = parseTimeString(discountCode.valid_hours.start);
    const endHour = parseTimeString(discountCode.valid_hours.end);

    if (currentHour < startHour || currentHour > endHour) {
      return {
        valid: false,
        code: discountCode,
        message: `This code is only valid between ${formatTime(discountCode.valid_hours.start)} and ${formatTime(
          discountCode.valid_hours.end
        )}`
      };
    }
  }

  // If all checks pass, the code is valid
  return { valid: true, code: discountCode };
};

// Function to format time string (e.g., "14:30" to "2:30 PM")
function formatTime(timeString: string): string {
  const [hourStr, minuteStr] = timeString.split(':');
  let hour = parseInt(hourStr, 10);
  const minutes = minuteStr;
  const amPm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12;
  hour = hour ? hour : 12; // Convert 0 to 12 for display

  return `${hour}:${minutes} ${amPm}`;
}

// Function to parse time string to hour decimal (e.g., "14:30" to 14.5)
function parseTimeString(timeString: string): number {
  const [hourStr, minuteStr] = timeString.split(':');
  const hour = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);
  return hour + minutes / 60;
}

// Function to log code usage in audit logs
async function logCodeUsage(codeId: string, action: 'redeem' | 'validate' | 'expire'): Promise<void> {
  try {
    await supabase.from('promotion_audit_logs').insert({
      promotion_id: codeId,
      action_type: action,
      status: 'success',
      details: `Code ${action === 'redeem' ? 'redeemed' : action === 'validate' ? 'validated' : 'expired'}`
    });
  } catch (error) {
    console.error(`Error logging ${action} action:`, error);
  }
}

// Function to calculate discount amount
export const calculateDiscountAmount = (
  subtotal: number,
  discountCode: DiscountCode | null
): { discountAmount: number; newTotal: number } => {
  if (!discountCode) {
    return { discountAmount: 0, newTotal: subtotal };
  }

  let discountAmount = 0;

  switch (discountCode.discount_type) {
    case 'percentage':
      discountAmount = (discountCode.discount_value / 100) * subtotal;
      break;
    case 'fixed':
      discountAmount = Math.min(discountCode.discount_value, subtotal);
      break;
    case 'free_item':
      // This would require more complex logic based on cart items
      // For now, we'll just use the discount_value as a fixed amount
      discountAmount = Math.min(discountCode.discount_value, subtotal);
      break;
  }

  return {
    discountAmount,
    newTotal: Math.max(0, subtotal - discountAmount)
  };
};

// Function to auto-apply the best discount from a list of codes
export const autoApplyBestDiscount = async (
  subtotal: number,
  codes: string[]
): Promise<{ bestCode: DiscountCode | null; discountAmount: number; newTotal: number }> => {
  const validDiscounts: { code: DiscountCode; discountAmount: number; newTotal: number }[] = [];

  for (const code of codes) {
    const { valid, code: discountCode } = await validateDiscountCode(code, subtotal);
    if (valid && discountCode) {
      const { discountAmount, newTotal } = calculateDiscountAmount(subtotal, discountCode);
      validDiscounts.push({ code: discountCode, discountAmount, newTotal });
    }
  }

  if (validDiscounts.length === 0) {
    return { bestCode: null, discountAmount: 0, newTotal: subtotal };
  }

  // Sort by highest discount amount
  validDiscounts.sort((a, b) => b.discountAmount - a.discountAmount);

  return {
    bestCode: validDiscounts[0].code,
    discountAmount: validDiscounts[0].discountAmount,
    newTotal: validDiscounts[0].newTotal
  };
};

// Function to share promotion code via different methods
export const sharePromotionCode = async (
  code: string, 
  method: 'email' | 'sms' | 'clipboard' | 'social',
  recipient?: string
): Promise<boolean> => {
  try {
    switch(method) {
      case 'clipboard':
        await navigator.clipboard.writeText(code);
        return true;
      case 'email':
        // Implementation would depend on your email service
        console.log(`Share code ${code} via email to ${recipient}`);
        return true;
      case 'sms':
        // Implementation would depend on your SMS service
        console.log(`Share code ${code} via SMS to ${recipient}`);
        return true;
      case 'social':
        // Implementation would depend on social sharing APIs
        console.log(`Share code ${code} via social media`);
        return true;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error sharing promotion code:', error);
    return false;
  }
};
