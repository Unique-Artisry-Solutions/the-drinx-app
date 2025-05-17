import { supabase } from '@/integrations/supabase/client';
import { CreatePromotionCodeParams, PromotionCode, Promotion } from '@/types/PromotionTypes';
import { getPromoterProfile } from '@/services/promoterService';

/**
 * Get promotion codes for an establishment
 */
export async function getPromotionCodes(establishmentId: string): Promise<PromotionCode[]> {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching promotion codes:', error);
      throw new Error(`Failed to fetch promotion codes: ${error.message}`);
    }
    
    // Transform the data to match our PromotionCode type
    const promotions: PromotionCode[] = data.map(item => ({
      id: item.id,
      code: item.code,
      description: item.description,
      discount_type: item.discount_type as 'percentage' | 'fixed' | 'free_item',
      discount_value: Number(item.discount_value),
      start_date: item.start_date,
      end_date: item.end_date,
      is_active: item.is_active,
      establishment_id: item.establishment_id,
      user_segment: item.user_segment || null,
      usage_limit: item.usage_limit,
      used_count: item.used_count || 0, // Changed from usage_count to used_count
      valid_days: item.valid_days,
      valid_hours: item.valid_hours,
      combinable: item.combinable,
      min_purchase_amount: item.min_purchase_amount,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    return promotions;
  } catch (error) {
    console.error('Exception in getPromotionCodes:', error);
    throw error;
  }
}

/**
 * Create a new promotion code
 */
export async function createPromotionCode(params: CreatePromotionCodeParams): Promise<PromotionCode> {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .insert({
        code: params.code,
        description: params.description,
        discount_type: params.discount_type,
        discount_value: params.discount_value,
        start_date: params.start_date,
        end_date: params.end_date,
        establishment_id: params.establishment_id,
        usage_limit: params.usage_limit,
        valid_days: params.valid_days,
        min_purchase_amount: params.min_purchase_amount,
        combinable: params.combinable ?? true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating promotion code:', error);
      throw new Error(`Failed to create promotion code: ${error.message}`);
    }
    
    // Transform the data to match our PromotionCode type
    const promotion: PromotionCode = {
      id: data.id,
      code: data.code,
      description: data.description,
      discount_type: data.discount_type as 'percentage' | 'fixed' | 'free_item',
      discount_value: Number(data.discount_value),
      start_date: data.start_date,
      end_date: data.end_date,
      is_active: data.is_active,
      establishment_id: data.establishment_id,
      user_segment: data.user_segment || null,
      usage_limit: data.usage_limit,
      used_count: data.used_count || 0, // Changed from usage_count to used_count
      valid_days: data.valid_days,
      valid_hours: data.valid_hours,
      combinable: data.combinable,
      min_purchase_amount: data.min_purchase_amount,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return promotion;
  } catch (error) {
    console.error('Exception in createPromotionCode:', error);
    throw error;
  }
}

/**
 * Update an existing promotion code
 */
export async function updatePromotionCode(id: string, updates: Partial<PromotionCode>): Promise<PromotionCode> {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating promotion code:', error);
      throw new Error(`Failed to update promotion code: ${error.message}`);
    }
    
    // Transform the data to match our PromotionCode type
    const promotion: PromotionCode = {
      id: data.id,
      code: data.code,
      description: data.description,
      discount_type: data.discount_type as 'percentage' | 'fixed' | 'free_item',
      discount_value: Number(data.discount_value),
      start_date: data.start_date,
      end_date: data.end_date,
      is_active: data.is_active,
      establishment_id: data.establishment_id,
      user_segment: data.user_segment || null,
      usage_limit: data.usage_limit,
      used_count: data.used_count || 0, // Changed from usage_count to used_count
      valid_days: data.valid_days,
      valid_hours: data.valid_hours,
      combinable: data.combinable,
      min_purchase_amount: data.min_purchase_amount,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return promotion;
  } catch (error) {
    console.error('Exception in updatePromotionCode:', error);
    throw error;
  }
}

/**
 * Delete a promotion code
 */
export async function deletePromotionCode(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('establishment_promotions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting promotion code:', error);
      throw new Error(`Failed to delete promotion code: ${error.message}`);
    }
  } catch (error) {
    console.error('Exception in deletePromotionCode:', error);
    throw error;
  }
}

/**
 * Get analytics for promotions
 */
export async function getPromotionAnalytics(establishmentId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('promotion_analytics')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('total_redemptions', { ascending: false });
    
    if (error) {
      console.error('Error fetching promotion analytics:', error);
      throw new Error(`Failed to fetch promotion analytics: ${error.message}`);
    }
    
    // Transform to consistent promotion analytics format
    const analytics = data.map(item => ({
      ...item,
      usage_limit: item.usage_limit,
      used_count: item.total_redemptions || 0, // Map total_redemptions to used_count for consistency
      usage_percentage: item.usage_percentage || 0,
      discount_value: Number(item.discount_value)
    }));
    
    return analytics;
  } catch (error) {
    console.error('Exception in getPromotionAnalytics:', error);
    throw error;
  }
}

/**
 * Get promotions for a promoter
 */
export async function getPromoterPromotions(): Promise<PromotionCode[]> {
  try {
    const promoterProfile = await getPromoterProfile();
    
    if (!promoterProfile?.id) {
      throw new Error('No promoter profile found');
    }
    
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('establishment_id', promoterProfile.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching promoter promotions:', error);
      throw new Error(`Failed to fetch promoter promotions: ${error.message}`);
    }
    
    // Transform the data to match our PromotionCode type
    const promotions: PromotionCode[] = data.map(item => ({
      id: item.id,
      code: item.code,
      description: item.description,
      discount_type: item.discount_type as 'percentage' | 'fixed' | 'free_item',
      discount_value: Number(item.discount_value),
      start_date: item.start_date,
      end_date: item.end_date,
      is_active: item.is_active,
      establishment_id: item.establishment_id,
      user_segment: item.user_segment || null,
      usage_limit: item.usage_limit,
      used_count: item.used_count || 0, // Changed from usage_count to used_count
      valid_days: item.valid_days,
      valid_hours: item.valid_hours,
      combinable: item.combinable,
      min_purchase_amount: item.min_purchase_amount,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    return promotions;
  } catch (error) {
    console.error('Exception in getPromoterPromotions:', error);
    throw error;
  }
}

/**
 * Save a promotion code for a user
 */
export async function savePromotionCodeForUser(promotionId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_saved_codes')
      .insert({
        user_id: userId,
        code_id: promotionId
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving promotion code for user:', error);
    return false;
  }
}

/**
 * Remove a saved promotion code for a user
 */
export async function removeSavedPromotionCode(promotionId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_saved_codes')
      .delete()
      .eq('user_id', userId)
      .eq('code_id', promotionId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error removing saved promotion code:', error);
    return false;
  }
}

/**
 * Batch create multiple promotion codes
 */
export async function batchCreatePromotionCodes(params: BatchCreateParams): Promise<PromotionCode[]> {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .insert(params.codes.map(code => ({
        ...code,
        establishment_id: params.establishment_id
      })))
      .select();
    
    if (error) throw error;
    
    // Convert each item to match the PromotionCode interface
    return data.map(item => ({
      id: item.id,
      code: item.code,
      description: item.description,
      discount_type: item.discount_type as 'percentage' | 'fixed' | 'free_item',
      discount_value: item.discount_value,
      start_date: item.start_date,
      end_date: item.end_date,
      is_active: item.is_active,
      establishment_id: item.establishment_id,
      user_segment: item.user_segment,
      usage_limit: item.usage_limit,
      min_purchase_amount: item.min_purchase_amount,
      combinable: item.combinable,
      valid_days: item.valid_days,
      valid_hours: item.valid_hours as any,
      created_at: item.created_at,
      updated_at: item.updated_at,
      used_count: item.used_count
    }));
  } catch (error) {
    console.error('Error batch creating promotion codes:', error);
    throw error;
  }
}

/**
 * Export promotion codes to CSV format
 */
export function exportPromotionCodesToCSV(codes: PromotionCode[]): string {
  const headers = [
    'Code', 'Description', 'Discount Type', 'Discount Value', 
    'Start Date', 'End Date', 'Is Active', 'Usage Limit', 'Used Count'
  ];
  
  const csvContent = [
    headers.join(','),
    ...codes.map(code => [
      code.code,
      `"${code.description.replace(/"/g, '""')}"`,
      code.discount_type,
      code.discount_value,
      code.start_date,
      code.end_date || '',
      code.is_active ? 'Yes' : 'No',
      code.usage_limit || '',
      code.used_count || '0'
    ].join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Parse CSV data for import
 */
export function parseCSVForImport(csvData: string, establishmentId: string): CreatePromotionCodeParams[] {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map(line => {
      const values = line.split(',');
      return {
        code: values[0],
        description: values[1].replace(/^"|"$/g, '').replace(/""/g, '"'),
        discount_type: values[2] as 'percentage' | 'fixed' | 'free_item',
        discount_value: parseFloat(values[3]),
        start_date: values[4],
        end_date: values[5] ? values[5] : null,
        establishment_id: establishmentId,
        usage_limit: values[7] ? parseInt(values[7]) : null,
        combinable: true
      };
    });
}

// Export types for consumption by other modules
export type { PromotionCode, PromotionAnalytics, CreatePromotionCodeParams, BatchCreateParams };
