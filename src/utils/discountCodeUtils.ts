
import { supabase } from '@/lib/supabase';

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  establishment_id: string;
  is_active: boolean;
  min_purchase_amount?: number | null;
  valid_days?: string[] | null;
  valid_hours?: { start: string; end: string } | null;
  user_segment?: string | null;
  combinable: boolean;
}

export interface AppliedDiscount {
  code: string;
  codeId: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed' | 'free_item';
  description?: string;
}

export const validateDiscountCode = async (
  code: string,
  userId?: string,
  purchaseAmount?: number
): Promise<{ valid: boolean; discount?: AppliedDiscount; message?: string }> => {
  try {
    // First check establishment promotions
    const { data: promoData, error: promoError } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .single();

    if (promoError && promoError.code !== 'PGRST116') {
      console.error('Error checking promotion code:', promoError);
      return { valid: false, message: 'Error validating code' };
    }

    if (promoData) {
      // Check if code is expired
      if (promoData.end_date && new Date(promoData.end_date) < new Date()) {
        return { valid: false, message: 'This code has expired' };
      }

      // Check minimum purchase requirement
      if (promoData.min_purchase_amount && purchaseAmount && purchaseAmount < promoData.min_purchase_amount) {
        return { 
          valid: false, 
          message: `Minimum purchase of $${promoData.min_purchase_amount.toFixed(2)} required` 
        };
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (promoData.discount_type === 'percentage' && purchaseAmount) {
        discountAmount = (purchaseAmount * (promoData.discount_value / 100));
      } else if (promoData.discount_type === 'fixed') {
        discountAmount = promoData.discount_value;
      }

      return {
        valid: true,
        discount: {
          code: promoData.code,
          codeId: promoData.id,
          discountAmount,
          discountType: promoData.discount_type,
          description: promoData.description
        }
      };
    }

    // If not found in establishment promotions, check event discount codes
    const { data: eventData, error: eventError } = await supabase
      .from('event_discount_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .single();

    if (eventError && eventError.code !== 'PGRST116') {
      console.error('Error checking event discount code:', eventError);
      return { valid: false, message: 'Error validating code' };
    }

    if (eventData) {
      // Check if code is expired
      if (eventData.expires_at && new Date(eventData.expires_at) < new Date()) {
        return { valid: false, message: 'This code has expired' };
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (eventData.discount_type === 'percentage' && purchaseAmount) {
        discountAmount = (purchaseAmount * (eventData.discount_amount / 100));
      } else if (eventData.discount_type === 'fixed') {
        discountAmount = eventData.discount_amount;
      }

      return {
        valid: true,
        discount: {
          code: eventData.code,
          codeId: eventData.id,
          discountAmount,
          discountType: eventData.discount_type,
          description: eventData.description
        }
      };
    }

    return { valid: false, message: 'Invalid discount code' };
  } catch (error) {
    console.error('Discount validation error:', error);
    return { valid: false, message: 'Error validating discount code' };
  }
};

export const autoApplyBestDiscount = async (
  items: any[],
  userId?: string
): Promise<AppliedDiscount | null> => {
  if (!userId) return null;

  try {
    // Get user's saved codes
    const { data: savedCodesData, error: savedCodesError } = await supabase
      .from('user_saved_codes')
      .select(`
        code_id,
        establishment_promotions (
          id,
          code,
          description,
          discount_type,
          discount_value,
          start_date,
          end_date,
          is_active,
          min_purchase_amount
        )
      `)
      .eq('user_id', userId);

    if (savedCodesError) {
      console.error('Error fetching saved codes:', savedCodesError);
      return null;
    }

    if (!savedCodesData || savedCodesData.length === 0) {
      return null;
    }

    // Calculate total purchase amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    // Find the best discount
    let bestDiscount: AppliedDiscount | null = null;
    let highestDiscountAmount = 0;

    for (const savedCode of savedCodesData) {
      const promotion = savedCode.establishment_promotions;
      
      if (!promotion || !promotion.is_active) continue;
      
      // Check if promotion is expired
      if (promotion.end_date && new Date(promotion.end_date) < new Date()) continue;
      
      // Check minimum purchase
      if (promotion.min_purchase_amount && totalAmount < promotion.min_purchase_amount) continue;

      // Calculate discount amount
      let discountAmount = 0;
      if (promotion.discount_type === 'percentage') {
        discountAmount = totalAmount * (promotion.discount_value / 100);
      } else if (promotion.discount_type === 'fixed') {
        discountAmount = promotion.discount_value;
      }

      // Check if this is the best discount so far
      if (discountAmount > highestDiscountAmount) {
        highestDiscountAmount = discountAmount;
        bestDiscount = {
          code: promotion.code,
          codeId: promotion.id,
          discountAmount,
          discountType: promotion.discount_type,
          description: promotion.description
        };
      }
    }

    return bestDiscount;
  } catch (error) {
    console.error('Error auto-applying discount:', error);
    return null;
  }
};
