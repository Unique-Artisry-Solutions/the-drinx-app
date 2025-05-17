import { CartItem } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { logPromotionAction } from '@/lib/promotions/auditApi';

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
  description: string;
}

export interface ValidationError {
  message: string;
  details?: string;
  code?: string;
}

// Cache validation results in memory for even faster access during a session
const validationMemoryCache: {
  [key: string]: {
    result: any;
    expires: number;
  };
} = {};

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
  
  try {
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
      throw new Error(establishmentError.message);
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
      throw new Error(eventError.message);
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
  } catch (error) {
    console.error('Error fetching applicable discount codes:', error);
    return [];
  }
}

/**
 * Determine the best discount code for the cart with improved error handling
 */
export function findBestDiscountCode(codes: DiscountCode[], cartItems: CartItem[]): DiscountCode | null {
  if (!codes || codes.length === 0 || !cartItems || cartItems.length === 0) {
    return null;
  }
  
  try {
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
  } catch (error) {
    console.error('Error finding best discount code:', error);
    return null;
  }
}

/**
 * Calculate discount amount for a specific code and cart with improved error handling
 */
export function calculateDiscountAmount(code: DiscountCode, cartItems: CartItem[]): number {
  if (!code || !cartItems || cartItems.length === 0) {
    return 0;
  }
  
  try {
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
  } catch (error) {
    console.error('Error calculating discount amount:', error);
    return 0;
  }
}

/**
 * Apply the best discount code automatically to the cart with improved performance and auditing
 */
export async function autoApplyBestDiscount(
  cartItems: CartItem[],
  userId?: string | null
): Promise<AppliedDiscount | null> {
  try {
    const applicableCodes = await fetchApplicableDiscountCodes(cartItems, userId);
    const bestCode = findBestDiscountCode(applicableCodes, cartItems);
    
    if (!bestCode) return null;
    
    const discountAmount = calculateDiscountAmount(bestCode, cartItems);
    
    // Log the automatic application for analytics
    await logPromotionAction(
      bestCode.id,
      'automatic_apply',
      {
        userId,
        metadata: {
          cart_total: cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
          discount_amount: discountAmount,
          cart_item_count: cartItems.length,
          item_types: Array.from(new Set(cartItems.map(item => item.type))),
        }
      }
    );
    
    return {
      code: bestCode.code,
      codeId: bestCode.id,
      discountAmount,
      discountType: bestCode.discount_type,
      description: bestCode.description
    };
  } catch (error) {
    console.error('Error auto-applying best discount:', error);
    return null;
  }
}

/**
 * Validate a promotion code with optimized performance and error handling
 */
export async function validatePromotionCode(
  code: string,
  options: {
    userId?: string;
    purchaseAmount?: number;
    establishmentId?: string;
  } = {}
): Promise<{ valid: boolean; message?: string; discount?: AppliedDiscount; errors?: ValidationError[] }> {
  try {
    // Generate a cache key for in-memory caching
    const cacheKey = `${code}:${options.userId || 'anonymous'}:${options.purchaseAmount || 0}`;
    const now = Date.now();
    
    // Check memory cache first (valid for 30 seconds)
    if (validationMemoryCache[cacheKey] && validationMemoryCache[cacheKey].expires > now) {
      return validationMemoryCache[cacheKey].result;
    }
    
    // First, find the promotion
    const { data: promotion, error: fetchError } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .maybeSingle();
      
    if (fetchError || !promotion) {
      const errorResult = {
        valid: false,
        message: 'Invalid discount code',
        errors: [{ 
          message: 'Invalid discount code', 
          details: fetchError?.message || 'Code not found or inactive'
        }]
      };
      
      // Log the failed validation attempt
      if (promotion?.id) {
        await logPromotionAction(
          promotion.id, 
          'validate',
          {
            userId: options.userId,
            status: 'failure',
            metadata: { 
              code, 
              purchase_amount: options.purchaseAmount,
              error: 'Invalid or inactive code'
            }
          }
        );
      }
      
      return errorResult;
    }
    
    // Ensure the code is from the establishment if establishmentId is provided
    if (options.establishmentId && promotion.establishment_id !== options.establishmentId) {
      const errorResult = {
        valid: false,
        message: 'This code cannot be used at this establishment',
        errors: [{ message: 'Establishment mismatch', code: 'ESTABLISHMENT_MISMATCH' }]
      };
      
      await logPromotionAction(
        promotion.id,
        'validate',
        {
          userId: options.userId,
          status: 'failure',
          metadata: {
            code,
            establishment_id: options.establishmentId,
            expected_establishment_id: promotion.establishment_id,
            error: 'Establishment mismatch'
          }
        }
      );
      
      return errorResult;
    }
    
    // Check expiration
    const now_date = new Date();
    if (promotion.end_date && new Date(promotion.end_date) < now_date) {
      const errorResult = {
        valid: false,
        message: 'This discount code has expired',
        errors: [{ 
          message: 'Code expired', 
          code: 'CODE_EXPIRED'
        }]
      };
      
      await logPromotionAction(
        promotion.id,
        'validate',
        {
          userId: options.userId,
          status: 'failure',
          metadata: {
            code,
            end_date: promotion.end_date
          }
        }
      );
      
      return errorResult;
    }
    
    // Check minimum purchase amount
    if (promotion.min_purchase_amount && (!options.purchaseAmount || options.purchaseAmount < promotion.min_purchase_amount)) {
      const errorResult = {
        valid: false,
        message: `Minimum purchase of $${promotion.min_purchase_amount.toFixed(2)} required`,
        errors: [{ 
          message: 'Minimum purchase amount not met', 
          code: 'MIN_PURCHASE_NOT_MET',
          details: `Required: $${promotion.min_purchase_amount.toFixed(2)}`
        }]
      };
      
      await logPromotionAction(
        promotion.id,
        'validate',
        {
          userId: options.userId,
          status: 'failure',
          metadata: {
            code,
            purchase_amount: options.purchaseAmount,
            min_purchase_required: promotion.min_purchase_amount,
            error: 'Minimum purchase not met'
          }
        }
      );
      
      return errorResult;
    }
    
    // Check days and time restrictions
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now_date.getDay()];
    const currentTime = now_date.toTimeString().substring(0, 5); // Format as HH:MM
    
    if (promotion.valid_days && promotion.valid_days.length > 0 && !promotion.valid_days.includes(currentDay)) {
      const errorResult = {
        valid: false,
        message: `This code is not valid on ${currentDay}s`,
        errors: [{ 
          message: 'Invalid day', 
          code: 'INVALID_DAY',
          details: `Valid days: ${promotion.valid_days.join(', ')}`
        }]
      };
      
      await logPromotionAction(
        promotion.id,
        'validate',
        {
          userId: options.userId,
          status: 'failure',
          metadata: {
            code,
            current_day: currentDay,
            valid_days: promotion.valid_days,
            error: 'Invalid day'
          }
        }
      );
      
      return errorResult;
    }
    
    if (promotion.valid_hours) {
      if (currentTime < promotion.valid_hours.start || currentTime > promotion.valid_hours.end) {
        const errorResult = {
          valid: false,
          message: `This code is only valid between ${promotion.valid_hours.start} and ${promotion.valid_hours.end}`,
          errors: [{ 
            message: 'Invalid time', 
            code: 'INVALID_TIME',
            details: `Valid between: ${promotion.valid_hours.start} - ${promotion.valid_hours.end}`
          }]
        };
        
        await logPromotionAction(
          promotion.id,
          'validate',
          {
            userId: options.userId,
            status: 'failure',
            metadata: {
              code,
              current_time: currentTime,
              valid_hours: promotion.valid_hours,
              error: 'Invalid time'
            }
          }
        );
        
        return errorResult;
      }
    }
    
    // Check usage limit
    if (promotion.usage_limit !== null && typeof promotion.usage_count === 'number') {
      if (promotion.usage_count >= promotion.usage_limit) {
        const errorResult = {
          valid: false,
          message: 'This promotion has reached its usage limit',
          errors: [{ message: 'Usage limit reached', code: 'USAGE_LIMIT_REACHED' }]
        };
        
        await logPromotionAction(
          promotion.id,
          'validate',
          {
            userId: options.userId,
            status: 'failure',
            metadata: {
              code,
              usage_count: promotion.usage_count,
              usage_limit: promotion.usage_limit,
              error: 'Usage limit reached'
            }
          }
        );
        
        return errorResult;
      }
    }
    
    // All checks passed - create the discount object
    const result = {
      valid: true,
      discount: {
        code: promotion.code,
        codeId: promotion.id,
        discountType: promotion.discount_type as any,
        discountAmount: promotion.discount_value,
        description: promotion.description
      }
    };
    
    // Cache the result in memory for 30 seconds
    validationMemoryCache[cacheKey] = {
      result,
      expires: now + 30000 // 30 seconds
    };
    
    // Log the successful validation
    await logPromotionAction(
      promotion.id,
      'validate',
      {
        userId: options.userId,
        status: 'success',
        metadata: {
          code,
          purchase_amount: options.purchaseAmount
        }
      }
    );
    
    return result;
  } catch (error) {
    console.error('Error validating promotion code:', error);
    return {
      valid: false,
      message: 'Error validating code',
      errors: [{ 
        message: 'Internal validation error',
        details: error instanceof Error ? error.message : String(error) 
      }]
    };
  }
}

/**
 * Record a promotion redemption with audit logging
 */
export async function recordPromotionRedemption(
  codeId: string,
  options: {
    userId?: string;
    orderAmount: number;
    discountAmount: number;
    orderId?: string;
  }
): Promise<boolean> {
  try {
    // Insert the redemption record
    const { data, error } = await supabase
      .from('promotion_redemptions')
      .insert({
        promotion_id: codeId,
        user_id: options.userId,
        order_amount: options.orderAmount,
        discount_amount: options.discountAmount,
        order_id: options.orderId
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error recording promotion redemption:', error);
      return false;
    }
    
    // Log the redemption in the audit log
    await logPromotionAction(
      codeId,
      'redeem',
      {
        userId: options.userId,
        metadata: {
          order_id: options.orderId,
          order_amount: options.orderAmount,
          discount_amount: options.discountAmount,
          redemption_id: data.id
        }
      }
    );
    
    return true;
  } catch (error) {
    console.error('Exception recording promotion redemption:', error);
    return false;
  }
}

/**
 * Share a promotion code via social media or email with improved error handling
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

/**
 * Increments the usage count for a discount code
 * @param codeId UUID of the discount code
 * @param tableName Table where the code is stored ('event_discount_codes' or 'establishment_promotions')
 * @returns {Promise<number>} The new count after incrementing
 */
export async function incrementCodeUsage(
  codeId: string, 
  tableName: 'event_discount_codes' | 'establishment_promotions' | 'promotion_redemptions'
): Promise<number> {
  try {
    const column = tableName === 'promotion_redemptions' ? 'redemption_count' : 'usage_count';
    
    // Call the increment_count RPC function
    const { data, error } = await supabase.rpc('increment_count', {
      row_id: codeId,
      table_name: tableName,
      column_name: column
    });

    if (error) {
      console.error('Error incrementing count:', error);
      throw new Error(`Failed to increment usage count: ${error.message}`);
    }

    return data as number;
  } catch (error) {
    console.error('Exception in incrementCodeUsage:', error);
    // Fallback to direct update if RPC call fails
    const { data, error: updateError } = await supabase
      .from(tableName)
      .update({ usage_count: supabase.sql`usage_count + 1` })
      .eq('id', codeId)
      .select('usage_count')
      .single();
    
    if (updateError) {
      console.error('Fallback update failed:', updateError);
      throw new Error(`Failed to update usage count: ${updateError.message}`);
    }
    
    return data?.usage_count || 1;
  }
}
