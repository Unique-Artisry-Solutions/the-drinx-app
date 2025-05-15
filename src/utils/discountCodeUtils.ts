
import { supabase } from "@/lib/supabase";

export type DiscountCodeType = 'fixed' | 'percentage' | 'free_item';

export interface DiscountCode {
  id: string;
  code: string;
  description?: string;
  discount_type: DiscountCodeType;
  discount_value: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  establishment_id?: string;
  usage_limit?: number;
  valid_days?: string[];
  valid_hours?: string;
  user_segment?: string;
  combinable?: boolean;
  min_purchase_amount?: number;
}

export interface AppliedDiscount {
  code: string;
  codeId: string;
  discountAmount: number;
  discountType: DiscountCodeType;
  description?: string;
}

/**
 * Automatically applies the best discount for the given items
 */
export async function autoApplyBestDiscount(items: any[], userId?: string): Promise<AppliedDiscount | null> {
  try {
    // This is a simplified implementation
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('is_active', true)
      .order('discount_value', { ascending: false })
      .limit(1);
      
    if (error || !data || data.length === 0) {
      return null;
    }
    
    const bestDiscount = data[0];
    
    // Calculate discount amount
    const discountAmount = bestDiscount.discount_type === 'percentage'
      ? items.reduce((total, item) => total + item.price, 0) * (bestDiscount.discount_value / 100)
      : bestDiscount.discount_value;
      
    return {
      code: bestDiscount.code,
      codeId: bestDiscount.id,
      discountAmount,
      discountType: bestDiscount.discount_type as DiscountCodeType,
      description: bestDiscount.description
    };
    
  } catch (error) {
    console.error("Error finding auto-discount:", error);
    return null;
  }
}

export function sharePromotionCode(code: string): Promise<boolean> {
  // Implementation for sharing promotion code
  return Promise.resolve(true);
}
