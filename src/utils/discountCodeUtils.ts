
import { supabase } from '@/integrations/supabase/client';
import { PromotionCode } from '@/types/PromotionTypes';

// Function to get all available promotion codes for an establishment
export const getPromotionCodes = async (establishmentId: string): Promise<PromotionCode[]> => {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('establishment_id', establishmentId);

    if (error) {
      console.error("Error fetching promotion codes:", error);
      throw new Error(`Failed to fetch promotion codes: ${error.message}`);
    }

    // Map the database response to the PromotionCode type and handle used_count field
    // Some responses might have usage_count instead of used_count
    return data.map(item => {
      // Determine which field to use for the count
      const usedCount = item.used_count !== undefined ? item.used_count : 
                        (item.usage_count !== undefined ? item.usage_count : 0);
      
      return {
        ...item,
        // Ensure used_count is available
        used_count: usedCount
      };
    }) as PromotionCode[];
  } catch (err) {
    console.error("Error in getPromotionCodes:", err);
    throw err;
  }
};

// Function to validate a promotion code
export const validatePromotionCode = async (
  code: string,
  establishmentId: string,
  orderAmount?: number
): Promise<PromotionCode | null> => {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('code', code)
      .eq('establishment_id', establishmentId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error("Error validating promotion code:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    const promotion = data as unknown as PromotionCode;
    
    // Check if code is expired
    if (promotion.end_date && new Date(promotion.end_date) < new Date()) {
      return null;
    }
    
    // Determine which field to use for usage count and limit
    const usedCount = promotion.used_count !== undefined ? promotion.used_count : 
                      (promotion.usage_count !== undefined ? promotion.usage_count : 0);
    
    // Check if usage limit is reached
    if (promotion.usage_limit !== null && usedCount >= (promotion.usage_limit ?? 0)) {
      return null;
    }
    
    // Check if minimum purchase amount is satisfied
    if (orderAmount !== undefined && 
        promotion.min_purchase_amount !== null && 
        orderAmount < promotion.min_purchase_amount) {
      return null;
    }
    
    return {
      ...promotion,
      // Ensure used_count is available
      used_count: usedCount
    };
  } catch (err) {
    console.error("Error in validatePromotionCode:", err);
    return null;
  }
};

// Function to record a promotion redemption
export const recordPromotionRedemption = async (
  promotionId: string,
  userId: string,
  orderAmount: number,
  discountAmount: number,
  orderId?: string
): Promise<boolean> => {
  try {
    // Insert redemption record
    const { error: redemptionError } = await supabase
      .from('promotion_redemptions')
      .insert({
        promotion_id: promotionId,
        user_id: userId,
        order_amount: orderAmount,
        discount_amount: discountAmount,
        order_id: orderId
      });
      
    if (redemptionError) {
      console.error("Error recording promotion redemption:", redemptionError);
      return false;
    }
    
    // Update the used_count on the promotion
    const { data: promotion, error: getError } = await supabase
      .from('establishment_promotions')
      .select('used_count, usage_count')
      .eq('id', promotionId)
      .single();
      
    if (getError) {
      console.error("Error fetching promotion for update:", getError);
      return false;
    }
    
    // Determine which field to update based on what's available in the data
    const currentCount = (
      promotion.used_count !== undefined ? promotion.used_count : 
      (promotion.usage_count !== undefined ? promotion.usage_count : 0)
    ) + 1;
    
    // Update either used_count or usage_count depending on what the database expects
    const updateField = promotion.hasOwnProperty('used_count') ? 'used_count' : 'usage_count';
    const updateData = { [updateField]: currentCount };
    
    const { error: updateError } = await supabase
      .from('establishment_promotions')
      .update(updateData)
      .eq('id', promotionId);
      
    if (updateError) {
      console.error("Error updating promotion used count:", updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in recordPromotionRedemption:", err);
    return false;
  }
};

// Function to get redemption analytics for promotions
export const getPromotionAnalytics = async (establishmentId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('promotion_analytics')
      .select('*')
      .eq('establishment_id', establishmentId);
      
    if (error) {
      console.error("Error fetching promotion analytics:", error);
      throw new Error(`Failed to fetch promotion analytics: ${error.message}`);
    }
    
    return data || [];
  } catch (err) {
    console.error("Error in getPromotionAnalytics:", err);
    throw err;
  }
};

// Function to create a batch of promotion codes
export const batchCreatePromotionCodes = async (
  codes: Array<Partial<PromotionCode> & { code: string; description: string; discount_type: string; establishment_id: string }>,
  establishmentId: string
): Promise<PromotionCode[]> => {
  try {
    // Make sure each code has the required fields
    const codesToInsert = codes.map(code => ({
      ...code,
      establishment_id: establishmentId
    }));
    
    const { data, error } = await supabase
      .from('establishment_promotions')
      .insert(codesToInsert)
      .select();
      
    if (error) {
      console.error("Error creating batch promotion codes:", error);
      throw new Error(`Failed to create batch promotion codes: ${error.message}`);
    }
    
    // Map the database response to the PromotionCode type 
    // and ensure used_count is available in the response
    return data.map(item => {
      const usedCount = item.used_count !== undefined ? item.used_count : 
                      (item.usage_count !== undefined ? item.usage_count : 0);
      
      return {
        ...item,
        used_count: usedCount
      };
    }) as PromotionCode[];
  } catch (err) {
    console.error("Error in batchCreatePromotionCodes:", err);
    throw err;
  }
};

// Function to auto-apply the best discount for an order
export const autoApplyBestDiscount = async (
  establishmentId: string,
  orderAmount: number,
  userId: string
): Promise<PromotionCode | null> => {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('establishment_id', establishmentId)
      .eq('is_active', true);
      
    if (error) {
      console.error("Error fetching promotions for auto-apply:", error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Filter valid promotions
    const now = new Date();
    const validPromotions = data.filter((promo: any) => {
      // Check expiration date
      if (promo.end_date && new Date(promo.end_date) < now) {
        return false;
      }
      
      // Determine which field to use for usage count and limit
      const usedCount = promo.used_count !== undefined ? promo.used_count : 
                      (promo.usage_count !== undefined ? promo.usage_count : 0);
      
      // Check usage limit
      if (promo.usage_limit !== null && usedCount >= promo.usage_limit) {
        return false;
      }
      
      // Check minimum purchase amount
      if (promo.min_purchase_amount !== null && orderAmount < promo.min_purchase_amount) {
        return false;
      }
      
      return true;
    });
    
    if (validPromotions.length === 0) {
      return null;
    }
    
    // Calculate discount values for comparison
    const promotionsWithValue = validPromotions.map((promo: any) => {
      let discountValue = 0;
      
      if (promo.discount_type === 'percentage') {
        discountValue = orderAmount * (promo.discount_value / 100);
      } else if (promo.discount_type === 'fixed') {
        discountValue = promo.discount_value;
      }
      // Free item promotions are not compared by value
      
      return { ...promo, calculatedValue: discountValue };
    });
    
    // Sort by calculated value in descending order
    promotionsWithValue.sort((a: any, b: any) => b.calculatedValue - a.calculatedValue);
    
    // Return the best promotion with used_count properly set
    const bestPromotion = promotionsWithValue[0];
    const usedCount = bestPromotion.used_count !== undefined ? bestPromotion.used_count : 
                    (bestPromotion.usage_count !== undefined ? bestPromotion.usage_count : 0);
    
    return {
      ...bestPromotion,
      used_count: usedCount
    } as PromotionCode;
  } catch (err) {
    console.error("Error in autoApplyBestDiscount:", err);
    return null;
  }
};

// Export additional functions for further development
export { 
  recordPromotionRedemption as recordRedemption,
  autoApplyBestDiscount as findBestDiscount
};
