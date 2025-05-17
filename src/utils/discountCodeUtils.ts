
import { supabase } from '@/integrations/supabase/client';
import { PromotionCode } from '@/types/PromotionTypes';

/**
 * Gets usage count for a promotion code, handling different field names
 * @param promotion The promotion code object
 * @returns The current usage count
 */
export const getUsageCount = (promotion: any): number => {
  // Handle possible field name variations in the database
  if (promotion === null || promotion === undefined) {
    return 0;
  }

  // Check for the existence of used_count or usage_count fields
  const hasUsedCount = 'used_count' in promotion;
  const hasUsageCount = 'usage_count' in promotion;

  if (hasUsedCount) {
    return promotion.used_count || 0;
  }
  
  if (hasUsageCount) {
    return promotion.usage_count || 0;
  }

  return 0;
};

/**
 * Gets the usage percentage of a promotion code
 * @param promotion The promotion code object
 * @returns The usage percentage as a number between 0 and 100
 */
export const getUsagePercentage = (promotion: any): number => {
  if (!promotion || !promotion.usage_limit || promotion.usage_limit <= 0) {
    return 0;
  }

  const usageCount = getUsageCount(promotion);
  return Math.min(100, Math.round((usageCount / promotion.usage_limit) * 100));
};

/**
 * Determines if a promotion code has expired
 * @param promotion The promotion code object
 * @returns Boolean indicating if the promotion has expired
 */
export const isExpired = (promotion: PromotionCode): boolean => {
  if (!promotion.end_date) return false;
  return new Date(promotion.end_date) < new Date();
};

/**
 * Formats a discount value with its type for display
 * @param promotion The promotion code object
 * @returns Formatted string representation of the discount
 */
export const formatDiscount = (promotion: PromotionCode): string => {
  if (!promotion) return '';

  switch (promotion.discount_type) {
    case 'percentage':
      return `${promotion.discount_value}% off`;
    case 'fixed':
      return `$${promotion.discount_value.toFixed(2)} off`;
    case 'free_item':
      return 'Free item';
    default:
      return `${promotion.discount_value}`;
  }
};

/**
 * Validates whether a promotion code can be used
 * @param code The promotion code to validate
 * @returns An object with validation result and message
 */
export const validatePromotionCode = async (code: string): Promise<{ 
  valid: boolean; 
  message?: string; 
  promotion?: PromotionCode;
}> => {
  try {
    // Get the promotion code
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !data) {
      return { 
        valid: false, 
        message: 'Invalid promotion code' 
      };
    }

    const promotion = data as PromotionCode;

    // Check if it's active
    if (!promotion.is_active) {
      return { 
        valid: false, 
        message: 'This promotion code is not active' 
      };
    }

    // Check if it's expired
    if (isExpired(promotion)) {
      return { 
        valid: false, 
        message: 'This promotion code has expired' 
      };
    }

    // Check if it reached the usage limit
    const usageCount = getUsageCount(promotion);
    
    if (promotion.usage_limit && usageCount >= promotion.usage_limit) {
      return { 
        valid: false, 
        message: 'This promotion code has reached its usage limit' 
      };
    }

    // Promotion is valid
    return { 
      valid: true, 
      promotion 
    };
  } catch (error) {
    console.error('Error validating promotion code:', error);
    return { 
      valid: false, 
      message: 'An error occurred while validating the promotion code' 
    };
  }
};

/**
 * Applies a promotion code to an order
 * @param code The promotion code to apply
 * @param orderId The order ID to apply the promotion to
 * @returns Promise<boolean> indicating success or failure
 */
export const applyPromotionCode = async (
  code: string, 
  orderId: string
): Promise<boolean> => {
  try {
    // Validate the code first
    const validation = await validatePromotionCode(code);
    
    if (!validation.valid || !validation.promotion) {
      console.error('Invalid promotion code:', validation.message);
      return false;
    }

    // Record the usage
    await incrementCodeUsage(validation.promotion.id);
    
    // Record the redemption
    await supabase
      .from('promotion_redemptions')
      .insert({
        promotion_id: validation.promotion.id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        order_id: orderId,
        order_amount: 0, // This would typically be filled with actual amount
        discount_amount: calculateDiscountAmount(validation.promotion, 0) // This would be calculated with actual amount
      });
      
    return true;
  } catch (error) {
    console.error('Error applying promotion code:', error);
    return false;
  }
};

/**
 * Calculate the discount amount for a promotion
 * @param promotion The promotion object
 * @param orderAmount The order amount
 * @returns The calculated discount amount
 */
const calculateDiscountAmount = (promotion: PromotionCode, orderAmount: number): number => {
  if (!promotion) return 0;

  switch (promotion.discount_type) {
    case 'percentage':
      return (orderAmount * (promotion.discount_value / 100));
    case 'fixed':
      return promotion.discount_value;
    default:
      return 0;
  }
};

/**
 * Increments the usage count for a promotion code - uses serviceUtils implementation
 * @param codeId The ID of the promotion code
 * @returns Promise<boolean> indicating success or failure
 */
const incrementCodeUsage = async (codeId: string): Promise<boolean> => {
  // Import and use the shared utility function
  const { incrementCodeUsage } = await import('./serviceUtils');
  return incrementCodeUsage(codeId);
};
