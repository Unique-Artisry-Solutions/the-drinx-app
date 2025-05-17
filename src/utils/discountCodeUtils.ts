
import { supabase } from '@/lib/supabase';
import { DiscountType } from '@/types/TicketTypes';

// Define the DiscountCode type to match what's used in the functions
export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  establishment_id: string;
  user_segment?: string | null;
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

// Define action types for auditDiscountCodeAction
type DiscountActionType = 'create' | 'update' | 'delete' | 'validate' | 'redeem' | 'expire' | 'automatic_apply';

/**
 * Increment the usage count for a discount code
 */
export async function incrementCodeUsage(codeId: string, tableName = 'establishment_promotions') {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update({ used_count: supabase.rpc('increment') })
      .eq('id', codeId)
      .select('used_count, usage_limit')
      .single();
    
    if (error) {
      console.error('Error incrementing code usage:', error);
      return false;
    }
    
    // If the usage limit is reached, deactivate the code
    if (data.usage_limit && data.used_count >= data.usage_limit) {
      await supabase
        .from(tableName)
        .update({ is_active: false })
        .eq('id', codeId);
      
      // Log the deactivation
      await auditDiscountCodeAction(codeId, 'expire', {
        reason: 'Usage limit reached',
        used_count: data.used_count,
        usage_limit: data.usage_limit
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error incrementing code usage:', error);
    return false;
  }
}

/**
 * Fetch active discount codes for an establishment
 */
export async function fetchActiveDiscountCodes(establishmentId: string): Promise<DiscountCode[]> {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('establishment_id', establishmentId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching discount codes:', error);
      return [];
    }
    
    // Process valid_hours to ensure proper typing
    const processedCodes = data.map(code => {
      // Handle valid_hours typing
      let validHours = null;
      if (code.valid_hours && typeof code.valid_hours === 'object') {
        const hoursObj = code.valid_hours as Record<string, any>;
        if (hoursObj.start && hoursObj.end) {
          validHours = {
            start: hoursObj.start as string,
            end: hoursObj.end as string
          };
        }
      }

      // Use used_count consistently (instead of usage_count)
      const processedCode = {
        ...code,
        used_count: code.used_count || 0,
        valid_hours: validHours
      } as DiscountCode;

      return processedCode;
    });
    
    return processedCodes;
  } catch (error) {
    console.error('Error fetching discount codes:', error);
    return [];
  }
}

/**
 * Validate a discount code is applicable
 */
export async function validateDiscountCode(code: string, establishmentId: string, purchaseAmount?: number): Promise<{ valid: boolean, code?: DiscountCode, message?: string }> {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('code', code)
      .eq('establishment_id', establishmentId)
      .eq('is_active', true)
      .single();
    
    if (error) {
      return { valid: false, message: 'Invalid promotion code' };
    }
    
    // Cast the data to our DiscountCode type
    const discountCode = data as unknown as DiscountCode;
    
    // Check if code has expired
    if (discountCode.end_date && new Date(discountCode.end_date) < new Date()) {
      await supabase
        .from('establishment_promotions')
        .update({ is_active: false })
        .eq('id', discountCode.id);
        
      return { valid: false, message: 'This promotion has expired' };
    }
    
    // Check usage limit
    if (discountCode.usage_limit && discountCode.used_count && discountCode.used_count >= discountCode.usage_limit) {
      await supabase
        .from('establishment_promotions')
        .update({ is_active: false })
        .eq('id', discountCode.id);
        
      return { valid: false, message: 'This promotion has reached its usage limit' };
    }
    
    // Check minimum purchase amount
    if (discountCode.min_purchase_amount && purchaseAmount && purchaseAmount < discountCode.min_purchase_amount) {
      return { 
        valid: false, 
        message: `Minimum purchase of $${discountCode.min_purchase_amount.toFixed(2)} required for this promotion`
      };
    }
    
    // Check day restrictions if applicable
    if (discountCode.valid_days && discountCode.valid_days.length > 0) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const validDays = discountCode.valid_days.map(day => day.toLowerCase());
      
      if (!validDays.includes(today)) {
        return { 
          valid: false, 
          message: `This promotion is not valid today. Valid days: ${discountCode.valid_days.join(', ')}` 
        };
      }
    }
    
    // Check time restrictions if applicable
    if (discountCode.valid_hours) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
      
      const startParts = discountCode.valid_hours.start.split(':');
      const endParts = discountCode.valid_hours.end.split(':');
      
      const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
      
      if (currentTime < startMinutes || currentTime > endMinutes) {
        return { 
          valid: false, 
          message: `This promotion is only valid between ${discountCode.valid_hours.start} and ${discountCode.valid_hours.end}` 
        };
      }
    }
    
    // Log validation success
    await auditDiscountCodeAction(discountCode.id, 'validate', { success: true });
    
    return { valid: true, code: discountCode };
  } catch (error) {
    console.error('Error validating discount code:', error);
    return { valid: false, message: 'An error occurred while validating the promotion code' };
  }
}

/**
 * Record an audit entry for a discount code action
 */
export async function auditDiscountCodeAction(
  codeId: string, 
  action: DiscountActionType, 
  details?: Record<string, any>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('promotion_audit_logs')
      .insert({
        promotion_id: codeId,
        action,
        details,
        performed_by: await getCurrentUserId()
      });
    
    if (error) {
      console.error('Error logging discount code action:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error logging discount code action:', error);
    return false;
  }
}

/**
 * Auto-apply the best discount code for a purchase
 */
export async function autoApplyBestDiscount(
  establishmentId: string, 
  purchaseAmount: number
): Promise<{ success: boolean, discountCode?: DiscountCode, message?: string }> {
  try {
    // Get all valid discount codes for the establishment
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('establishment_id', establishmentId)
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching discount codes for auto-apply:', error);
      return { success: false, message: 'Unable to check for available promotions' };
    }
    
    if (!data || data.length === 0) {
      return { success: false, message: 'No promotions available' };
    }
    
    let bestDiscount: DiscountCode | null = null;
    let highestDiscountValue = 0;
    
    // Process the codes and find the best one
    for (const code of data) {
      // Type the code as DiscountCode
      const discountCode = code as unknown as DiscountCode;
      
      // Skip if minimum purchase not met
      if (discountCode.min_purchase_amount && purchaseAmount < discountCode.min_purchase_amount) {
        continue;
      }
      
      // Check usage limits
      if (discountCode.usage_limit && discountCode.used_count && discountCode.used_count >= discountCode.usage_limit) {
        continue;
      }
      
      // Check date validity
      if (discountCode.end_date && new Date(discountCode.end_date) < new Date()) {
        continue;
      }
      
      // Check day restrictions
      if (discountCode.valid_days && discountCode.valid_days.length > 0) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const validDays = discountCode.valid_days.map(day => day.toLowerCase());
        if (!validDays.includes(today)) {
          continue;
        }
      }
      
      // Check time restrictions
      if (discountCode.valid_hours) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const startParts = discountCode.valid_hours.start.split(':');
        const endParts = discountCode.valid_hours.end.split(':');
        
        const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
        
        if (currentTime < startMinutes || currentTime > endMinutes) {
          continue;
        }
      }
      
      // Calculate discount value
      let discountValue = 0;
      if (discountCode.discount_type === 'percentage') {
        discountValue = (discountCode.discount_value / 100) * purchaseAmount;
      } else if (discountCode.discount_type === 'fixed') {
        discountValue = Math.min(discountCode.discount_value, purchaseAmount);
      }
      
      // Update best discount if this one is better
      if (discountValue > highestDiscountValue) {
        highestDiscountValue = discountValue;
        bestDiscount = discountCode;
      }
    }
    
    if (!bestDiscount) {
      return { success: false, message: 'No applicable promotions found' };
    }
    
    // Log the auto-apply action
    await auditDiscountCodeAction(bestDiscount.id, 'automatic_apply' as DiscountActionType, {
      purchase_amount: purchaseAmount,
      discount_value: highestDiscountValue
    });
    
    return { success: true, discountCode: bestDiscount };
  } catch (error) {
    console.error('Error in auto-apply discount:', error);
    return { success: false, message: 'An error occurred while finding the best promotion' };
  }
}

// Helper to get the current user ID
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}
