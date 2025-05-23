
/**
 * This utility file provides shared functions for service modules
 */

import { supabase } from '@/integrations/supabase/client';

// Define a type that includes both possible field names for consistency handling
interface PromotionRecord {
  id: string;
  used_count?: number;
  usage_count?: number;
  [key: string]: any; // Allow other properties
}

/**
 * Increments the usage count for a promotion code
 * 
 * @param codeId The ID of the promotion code to increment
 * @returns Promise<boolean> indicating success or failure
 */
export const incrementCodeUsage = async (codeId: string): Promise<boolean> => {
  try {
    // First get the current usage count
    const { data, error: fetchError } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('id', codeId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching code usage:", fetchError);
      return false;
    }
    
    // Cast the data to our extended type that includes both field names
    const promotion = data as PromotionRecord;
    
    // Check which fields exist in the data
    const hasUsedCount = promotion && Object.prototype.hasOwnProperty.call(promotion, 'used_count');
    const hasUsageCount = promotion && Object.prototype.hasOwnProperty.call(promotion, 'usage_count');
    
    if (!hasUsedCount && !hasUsageCount) {
      console.error("Neither used_count nor usage_count field exists in the record");
      // Since used_count doesn't exist in the table schema, we'll use a raw SQL update
      const { error: updateError } = await supabase.rpc('sql', {
        query: `UPDATE establishment_promotions SET usage_count = COALESCE(usage_count, 0) + 1 WHERE id = '${codeId}'`
      });
      
      return !updateError;
    }
    
    // Determine which field to update based on what's available
    const updateField = hasUsedCount ? 'used_count' : 'usage_count';
    
    // Determine the current count
    const currentCount = hasUsedCount ? (promotion.used_count || 0) : 
                         hasUsageCount ? (promotion.usage_count || 0) : 0;
    
    // Create update object with only the field that exists
    const updateData: any = {};
    updateData[updateField] = currentCount + 1;
    
    // Increment the count
    const { error: updateError } = await supabase
      .from('establishment_promotions')
      .update(updateData)
      .eq('id', codeId);
      
    if (updateError) {
      console.error("Error incrementing code usage:", updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in incrementCodeUsage:", err);
    return false;
  }
};

/**
 * Shares a promotion code with another user
 * 
 * @param codeId The ID of the promotion code to share
 * @param userId The ID of the user to share with
 * @returns Promise<boolean> indicating success or failure
 */
export const sharePromotionCode = async (codeId: string, userId: string): Promise<boolean> => {
  try {
    // Record that this user has saved the code
    const { error } = await supabase
      .from('user_saved_codes')
      .insert({
        user_id: userId,
        code_id: codeId,
      });
      
    if (error) {
      console.error("Error sharing promotion code:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in sharePromotionCode:", err);
    return false;
  }
};
