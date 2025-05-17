
import { supabase } from '@/integrations/supabase/client';
import { 
  PromotionCode, 
  PromotionAnalytics, 
  CreatePromotionCodeParams, 
  BatchCreateParams 
} from '@/types/PromotionTypes';

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
        usage_limit: params.usage_limit || null,
        valid_days: params.valid_days || null,
        min_purchase_amount: params.min_purchase_amount || null,
        combinable: params.combinable !== undefined ? params.combinable : true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Explicitly cast to ensure correct typing
    return data as PromotionCode;
  } catch (error) {
    console.error('Error creating promotion code:', error);
    throw error;
  }
}

/**
 * Update an existing promotion code
 */
export async function updatePromotionCode(id: string, params: Partial<CreatePromotionCodeParams>): Promise<PromotionCode> {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .update(params)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Explicitly cast to ensure correct typing
    return data as PromotionCode;
  } catch (error) {
    console.error('Error updating promotion code:', error);
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
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting promotion code:', error);
    throw error;
  }
}

/**
 * Get all promotion codes for an establishment
 */
export async function getPromotionCodes(establishmentId: string): Promise<PromotionCode[]> {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Explicitly cast to ensure correct typing
    return data as PromotionCode[];
  } catch (error) {
    console.error('Error fetching promotion codes:', error);
    throw error;
  }
}

/**
 * Get promotion analytics for an establishment
 */
export async function getPromotionAnalytics(establishmentId: string): Promise<PromotionAnalytics[]> {
  try {
    // This is a mock implementation since we don't have the real table
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('establishment_id', establishmentId);
    
    if (error) throw error;
    
    // Map and transform the response to match the PromotionAnalytics interface
    const analytics = data.map(item => ({
      id: item.id,
      promotion_id: item.id, // Use the same ID for now
      code: item.code,
      description: item.description,
      discount_type: item.discount_type as 'percentage' | 'fixed' | 'free_item',
      discount_value: item.discount_value,
      start_date: item.start_date,
      end_date: item.end_date,
      establishment_id: item.establishment_id,
      redemption_count: item.used_count || 0,
      unique_users: Math.floor(Math.random() * 50),
      avg_purchase_amount: 30.0, // Mock value
      total_discount_amount: (30 * (item.used_count || 0) * 0.1),
      successful_validations: (item.used_count || 0) + Math.floor(Math.random() * 20),
      failed_validations: Math.floor(Math.random() * 10),
      auto_applied_count: Math.floor(Math.random() * 15),
      total_usage: item.used_count || 0,
      total_revenue: (30 * (item.used_count || 0)),
      conversion_rate: Math.random() * 0.5
    }));
    
    return analytics as PromotionAnalytics[];
  } catch (error) {
    console.error('Error fetching promotion analytics:', error);
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
    
    return data as PromotionCode[];
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

// Export types directly
export type { PromotionCode, PromotionAnalytics, CreatePromotionCodeParams, BatchCreateParams };
