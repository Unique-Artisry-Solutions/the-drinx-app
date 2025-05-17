
import { supabase } from '@/integrations/supabase/client';
import { incrementCodeUsage } from '@/utils/discountCodeUtils';

export interface PromotionRedemptionParams {
  promotionId: string;
  userId: string;
  orderId?: string;
  orderAmount: number;
  discountAmount: number;
}

/**
 * Record a promotion redemption
 */
export async function redeemPromotion(params: PromotionRedemptionParams) {
  const { promotionId, userId, orderId, orderAmount, discountAmount } = params;
  
  try {
    // First create the redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from('promotion_redemptions')
      .insert({
        promotion_id: promotionId,
        user_id: userId,
        order_id: orderId,
        order_amount: orderAmount,
        discount_amount: discountAmount
      })
      .select()
      .single();
      
    if (redemptionError) {
      console.error('Error creating promotion redemption:', redemptionError);
      throw new Error(`Failed to redeem promotion: ${redemptionError.message}`);
    }
    
    // Increment the usage count
    await incrementCodeUsage(promotionId, 'establishment_promotions');
    
    return {
      success: true,
      message: 'Promotion redeemed successfully',
      redemption
    };
  } catch (error) {
    console.error('Error in redeemPromotion:', error);
    throw error;
  }
}

/**
 * Validate a promotion for a specific user and purchase amount
 */
export async function validatePromotion(
  code: string, 
  userId?: string, 
  purchaseAmount?: number
) {
  try {
    // Call the built-in validation function
    const { data: validationResult, error: validationError } = await supabase.rpc(
      'validate_promotion',
      {
        p_promotion_id: code,
        p_user_id: userId || null,
        p_purchase_amount: purchaseAmount || null
      }
    );

    if (validationError) {
      console.error('Error validating promotion:', validationError);
      return { valid: false, message: validationError.message };
    }

    return validationResult;
  } catch (error) {
    console.error('Exception in validatePromotion:', error);
    return { 
      valid: false, 
      message: error instanceof Error ? error.message : 'Unknown error validating promotion'
    };
  }
}
