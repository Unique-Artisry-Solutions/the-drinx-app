
/**
 * This utility file provides shared functions for service modules
 */

import { supabase } from '@/integrations/supabase/client';

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
    
    // Check which fields exist in the data
    const hasUsedCount = data && Object.prototype.hasOwnProperty.call(data, 'used_count');
    const hasUsageCount = data && Object.prototype.hasOwnProperty.call(data, 'usage_count');
    
    if (!hasUsedCount && !hasUsageCount) {
      console.error("Neither used_count nor usage_count field exists in the record");
      // Create a used_count field if neither exists
      const { error: updateError } = await supabase
        .from('establishment_promotions')
        .update({ used_count: 1 })
        .eq('id', codeId);
        
      return !updateError;
    }
    
    // Determine which field to update based on what's available
    const updateField = hasUsedCount ? 'used_count' : 'usage_count';
    
    // Determine the current count
    const currentCount = hasUsedCount ? (data.used_count || 0) : 
                         hasUsageCount ? (data.usage_count || 0) : 0;
    
    // Increment the count
    const { error: updateError } = await supabase
      .from('establishment_promotions')
      .update({ [updateField]: currentCount + 1 })
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
