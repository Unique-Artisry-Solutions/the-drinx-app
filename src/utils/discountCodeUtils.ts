
import { supabase } from '@/integrations/supabase/client';

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  establishment_id: string;
  user_segment?: string | null;
  usage_limit?: number | null;
  used_count?: number | null;
  min_purchase_amount?: number | null;
  combinable: boolean;
  valid_days?: string[] | null;
  valid_hours?: {
    start: string;
    end: string;
  } | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch discount code details
 */
export async function getDiscountCode(code: string): Promise<DiscountCode | null> {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();
    
    if (error || !data) {
      console.error('Error fetching discount code:', error);
      return null;
    }
    
    // Safely type cast the data with default values for potentially missing fields
    return {
      ...data,
      valid_hours: data.valid_hours as { start: string; end: string; } | null,
      used_count: data.used_count || 0,
      usage_limit: data.usage_limit || null
    } as DiscountCode;
  } catch (error) {
    console.error('Exception in getDiscountCode:', error);
    return null;
  }
}

/**
 * Increment the usage count for a discount code
 */
export async function incrementCodeUsage(codeId: string, tableName: string = 'establishment_promotions'): Promise<boolean> {
  try {
    if (tableName !== 'establishment_promotions') {
      console.warn(`Table ${tableName} may not exist, defaulting to establishment_promotions`);
      tableName = 'establishment_promotions';
    }
    
    // First, get the current usage count and limit
    const { data, error } = await supabase
      .from(tableName as 'establishment_promotions')
      .select('*')
      .eq('id', codeId)
      .single();
    
    if (error) {
      console.error('Error fetching code usage data:', error);
      return false;
    }
    
    // Create an update object with used_count incremented by 1
    const currentUsedCount = data?.used_count || 0;
    const updates: Record<string, any> = { 
      used_count: currentUsedCount + 1,
    };
    
    // If usage limit is reached, mark as inactive
    if (data?.usage_limit && (currentUsedCount + 1) >= data.usage_limit) {
      updates.is_active = false;
    }
    
    // Update the record
    const { error: updateError } = await supabase
      .from(tableName as 'establishment_promotions')
      .update(updates)
      .eq('id', codeId);
      
    if (updateError) {
      console.error('Error updating code usage:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in incrementCodeUsage:', error);
    return false;
  }
}

/**
 * Check if a discount code is valid for the current date and time
 */
export function isDiscountCodeValid(code: DiscountCode): boolean {
  if (!code.is_active) return false;
  
  const now = new Date();
  const startDate = new Date(code.start_date);
  
  // Check if code has started
  if (now < startDate) return false;
  
  // Check if code has expired
  if (code.end_date && now > new Date(code.end_date)) return false;
  
  // Check for usage limit
  if (code.usage_limit !== null && code.used_count !== null && code.used_count >= code.usage_limit) {
    return false;
  }
  
  // Check for day restrictions
  if (code.valid_days && code.valid_days.length > 0) {
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    if (!code.valid_days.includes(currentDay)) return false;
  }
  
  // Check for time restrictions
  if (code.valid_hours) {
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM
    if (currentTime < code.valid_hours.start || currentTime > code.valid_hours.end) {
      return false;
    }
  }
  
  return true;
}

/**
 * Save a promotion code for a user
 */
export async function savePromotionCode(userId: string, codeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_saved_codes')
      .insert({
        user_id: userId,
        code_id: codeId
      });
      
    if (error) {
      console.error('Error saving promotion code:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in savePromotionCode:', error);
    return false;
  }
}

/**
 * Share a promotion code
 */
export async function sharePromotionCode(code: string, method: 'email' | 'sms' | 'clipboard' | 'social'): Promise<boolean> {
  try {
    // Log promotional code sharing to analytics instead of database that doesn't exist
    console.log('Promotion sharing event:', {
      code,
      method,
      timestamp: new Date().toISOString()
    });
      
    // Handle the different sharing methods
    switch (method) {
      case 'email':
        // Open email client with prefilled message
        window.location.href = `mailto:?subject=Check out this promotion&body=Use code ${code} for a discount!`;
        break;
      case 'sms':
        // Open SMS with prefilled message (mobile only)
        window.location.href = `sms:?body=Use code ${code} for a discount!`;
        break;
      case 'clipboard':
        // Copy to clipboard handled separately
        break;
      case 'social':
        // Open a share dialog (implementation depends on platform)
        if (navigator.share) {
          await navigator.share({
            title: 'Promotion Code',
            text: `Use code ${code} for a discount!`,
            url: window.location.href
          });
        } else {
          console.log('Web Share API not supported');
          return false;
        }
        break;
    }
    
    return true;
  } catch (error) {
    console.error('Error sharing promotion code:', error);
    return false;
  }
}

/**
 * Auto-apply best discount to an order
 */
export async function autoApplyBestDiscount(userId: string, orderAmount: number, establishmentId: string): Promise<DiscountCode | null> {
  try {
    // Fetch all active codes for this establishment
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('is_active', true)
      .eq('establishment_id', establishmentId)
      .lt('min_purchase_amount', orderAmount)
      .order('discount_value', { ascending: false });
      
    if (error || !data || data.length === 0) {
      return null;
    }
    
    // Find the best discount
    let bestDiscount: DiscountCode | null = null;
    let highestValue = 0;
    
    for (const code of data) {
      const discountCode = {
        ...code,
        valid_hours: code.valid_hours as { start: string; end: string; } | null,
        used_count: code.used_count || 0,
        usage_limit: code.usage_limit || null
      } as DiscountCode;
      
      if (isDiscountCodeValid(discountCode)) {
        let value = 0;
        
        if (discountCode.discount_type === 'percentage') {
          value = (discountCode.discount_value / 100) * orderAmount;
        } else {
          value = discountCode.discount_value;
        }
        
        if (value > highestValue) {
          highestValue = value;
          bestDiscount = discountCode;
        }
      }
    }
    
    return bestDiscount;
  } catch (error) {
    console.error('Error in autoApplyBestDiscount:', error);
    return null;
  }
}
