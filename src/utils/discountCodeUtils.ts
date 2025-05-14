
import { CartItem } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  establishment_id: string;
  usage_limit?: number | null;
  usage_count?: number;
  valid_days?: string[] | null;
  valid_hours?: { start: string; end: string } | null;
  user_segment?: string | null;
  combinable: boolean;
  min_purchase_amount?: number | null;
}

export interface AppliedDiscount {
  code: string;
  codeId: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed' | 'free_item';
  description?: string;
}

/**
 * Fetch all applicable discount codes for cart items
 */
export async function fetchApplicableDiscountCodes(
  cartItems: CartItem[],
  userId?: string
): Promise<DiscountCode[]> {
  // Get unique establishment IDs from cart items
  const establishmentIds = Array.from(
    new Set(cartItems.filter(item => item.type === 'establishment').map(item => item.id))
  );
  
  // Get event and swig circuit IDs
  const eventIds = Array.from(
    new Set(cartItems.filter(item => item.type === 'event_ticket' && item.eventId).map(item => item.eventId))
  );
  
  const swigCircuitIds = Array.from(
    new Set(cartItems.filter(item => item.type === 'swig_circuit_ticket' && item.swigCircuitId).map(item => item.swigCircuitId))
  );
  
  // No items that could have discounts
  if (establishmentIds.length === 0 && eventIds.length === 0 && swigCircuitIds.length === 0) {
    return [];
  }
  
  // Get current date and time
  const now = new Date();
  const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  const currentTime = now.toTimeString().substring(0, 5); // Format as HH:MM
  
  // Query for establishment promotions
  const { data: establishmentPromotions, error: establishmentError } = await supabase
    .from('establishment_promotions')
    .select('*')
    .in('establishment_id', establishmentIds)
    .eq('is_active', true)
    .lte('start_date', now.toISOString())
    .or(`end_date.gt.${now.toISOString()},end_date.is.null`);
  
  if (establishmentError) {
    console.error('Error fetching establishment promotions:', establishmentError);
  }
  
  // Query for event discount codes
  const { data: eventDiscounts, error: eventError } = await supabase
    .from('event_discount_codes')
    .select('*')
    .in('event_id', eventIds)
    .eq('is_active', true)
    .or(`expires_at.gt.${now.toISOString()},expires_at.is.null`);
  
  if (eventError) {
    console.error('Error fetching event discount codes:', eventError);
  }
  
  // Filter establishment promotions based on day, time, and user segment
  const filteredPromotions = (establishmentPromotions || []).filter(promo => {
    // Check valid days
    if (promo.valid_days && promo.valid_days.length > 0 && !promo.valid_days.includes(currentDay)) {
      return false;
    }
    
    // Check valid hours
    if (promo.valid_hours) {
      if (currentTime < promo.valid_hours.start || currentTime > promo.valid_hours.end) {
        return false;
      }
    }
    
    // Check usage limit
    if (promo.usage_limit !== null && typeof promo.usage_count === 'number' && promo.usage_count >= promo.usage_limit) {
      return false;
    }
    
    // If there's a user segment restriction but no user ID, exclude it
    if (promo.user_segment && !userId) {
      return false;
    }
    
    // We'll do more complex user segment validation later if needed
    
    return true;
  });
  
  return [...filteredPromotions, ...(eventDiscounts || [])];
}

/**
 * Determine the best discount code for the cart
 */
export function findBestDiscountCode(codes: DiscountCode[], cartItems: CartItem[]): DiscountCode | null {
  if (codes.length === 0) return null;
  
  // Calculate total cart value
  const cartTotal = cartItems.reduce((total, item) => {
    const quantity = item.quantity || 1;
    return total + (item.price * quantity);
  }, 0);
  
  // Filter codes by min purchase amount
  const eligibleCodes = codes.filter(code => {
    if (code.min_purchase_amount && cartTotal < code.min_purchase_amount) {
      return false;
    }
    return true;
  });
  
  if (eligibleCodes.length === 0) return null;
  
  // Calculate potential savings for each code
  const codesWithSavings = eligibleCodes.map(code => {
    let savings = 0;
    
    if (code.discount_type === 'percentage') {
      savings = cartTotal * (code.discount_value / 100);
    } else if (code.discount_type === 'fixed') {
      savings = Math.min(cartTotal, code.discount_value); // Can't discount more than cart total
    }
    // We'd handle 'free_item' differently, for now we'll set it to 0
    
    return { code, savings };
  });
  
  // Sort by savings (highest first)
  codesWithSavings.sort((a, b) => b.savings - a.savings);
  
  // Return the code with the highest savings
  return codesWithSavings[0]?.code || null;
}

/**
 * Calculate discount amount for a specific code and cart
 */
export function calculateDiscountAmount(code: DiscountCode, cartItems: CartItem[]): number {
  // Calculate total cart value
  const cartTotal = cartItems.reduce((total, item) => {
    const quantity = item.quantity || 1;
    return total + (item.price * quantity);
  }, 0);
  
  if (code.discount_type === 'percentage') {
    return cartTotal * (code.discount_value / 100);
  } else if (code.discount_type === 'fixed') {
    return Math.min(cartTotal, code.discount_value); // Can't discount more than cart total
  }
  
  // For 'free_item' type, we would need to identify which item is free
  // This is more complex and would depend on the implementation
  return 0;
}

/**
 * Apply the best discount code automatically to the cart
 */
export async function autoApplyBestDiscount(
  cartItems: CartItem[],
  userId?: string
): Promise<AppliedDiscount | null> {
  const applicableCodes = await fetchApplicableDiscountCodes(cartItems, userId);
  const bestCode = findBestDiscountCode(applicableCodes, cartItems);
  
  if (!bestCode) return null;
  
  const discountAmount = calculateDiscountAmount(bestCode, cartItems);
  
  return {
    code: bestCode.code,
    codeId: bestCode.id,
    discountAmount,
    discountType: bestCode.discount_type,
    description: bestCode.description
  };
}

/**
 * Share a promotion code via social media or email
 */
export function sharePromotionCode(
  code: string,
  platform: 'facebook' | 'twitter' | 'email',
  description?: string
): boolean {
  const shareText = `Use my discount code "${code}"${description ? ` - ${description}` : ''} on Swig!`;
  const url = window.location.origin;
  
  try {
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=Discount code for Swig&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`, '_blank');
        break;
    }
    return true;
  } catch (error) {
    console.error('Error sharing code:', error);
    return false;
  }
}
