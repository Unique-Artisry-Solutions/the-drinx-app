
import { supabase } from '@/integrations/supabase/client';
import { ValidDays, UserSegmentType } from '@/types/auth/AuthTypes';

export type PromotionCodeType = 'percentage' | 'fixed';

export interface PromotionCode {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  establishment_id: string;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  usage_limit?: number | null;
  usage_count?: number | null;
  valid_days?: string[] | null;
  valid_hours?: { start: string; end: string } | null;
  user_segment?: UserSegmentType | null;
  combinable: boolean;
  min_purchase_amount?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePromotionCodeParams {
  code: string;
  description: string;
  discount_type: PromotionCodeType;
  discount_value: number;
  establishment_id: string;
  start_date: string;
  end_date?: string | null;
  is_active?: boolean;
  usage_limit?: number | null;
  valid_days?: string[] | null;
  valid_hours?: { start: string; end: string } | null;
  user_segment?: UserSegmentType | null;
  combinable?: boolean;
  min_purchase_amount?: number | null;
}

export interface BatchCreateParams {
  prefix: string;
  count: number;
  discount_type: PromotionCodeType;
  discount_value: number;
  establishment_id: string;
  start_date: string;
  end_date?: string | null;
  is_active?: boolean;
  usage_limit?: number | null;
  valid_days?: string[] | null;
  valid_hours?: { start: string; end: string } | null;
  user_segment?: UserSegmentType | null;
  combinable?: boolean;
  min_purchase_amount?: number | null;
}

export interface PromotionAnalytics {
  code: string;
  redemptions: number;
  total_discount_amount: number;
  average_order_value: number;
  conversion_rate?: number;
}

/**
 * Create a single promotion code
 */
export async function createPromotionCode(params: CreatePromotionCodeParams): Promise<PromotionCode | null> {
  const { data, error } = await supabase
    .from('establishment_promotions')
    .insert([params])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating promotion code:', error);
    throw error;
  }
  
  // Convert the response to our PromotionCode type
  const promotionCode: PromotionCode = {
    id: data.id,
    code: data.code,
    description: data.description,
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    establishment_id: data.establishment_id,
    start_date: data.start_date,
    end_date: data.end_date,
    is_active: data.is_active,
    usage_limit: data.usage_limit,
    usage_count: data.usage_count,
    valid_days: data.valid_days,
    valid_hours: data.valid_hours as { start: string; end: string } | undefined,
    user_segment: data.user_segment as UserSegmentType | undefined,
    combinable: data.combinable,
    min_purchase_amount: data.min_purchase_amount,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
  
  return promotionCode;
}

/**
 * Create multiple promotion codes in batch with a prefix and random suffixes
 */
export async function batchCreatePromotionCodes(params: BatchCreateParams): Promise<PromotionCode[]> {
  // Generate codes with the prefix and random suffixes
  const codes = Array.from({ length: params.count }, () => {
    // Generate a random 6-character alphanumeric suffix
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create the code object with the required properties
    return {
      code: `${params.prefix}${randomSuffix}`,
      description: params.description,
      discount_type: params.discount_type,
      discount_value: params.discount_value,
      establishment_id: params.establishment_id,
      start_date: params.start_date,
      end_date: params.end_date,
      is_active: params.is_active !== undefined ? params.is_active : true,
      usage_limit: params.usage_limit,
      valid_days: params.valid_days,
      valid_hours: params.valid_hours,
      user_segment: params.user_segment,
      combinable: params.combinable !== undefined ? params.combinable : true,
      min_purchase_amount: params.min_purchase_amount
    };
  });
  
  const { data, error } = await supabase
    .from('establishment_promotions')
    .insert(codes)
    .select();
    
  if (error) {
    console.error('Error batch creating promotion codes:', error);
    throw error;
  }
  
  // Convert the response to our PromotionCode type
  const promotionCodes: PromotionCode[] = data.map((item: any): PromotionCode => ({
    id: item.id,
    code: item.code,
    description: item.description,
    discount_type: item.discount_type,
    discount_value: item.discount_value,
    establishment_id: item.establishment_id,
    start_date: item.start_date,
    end_date: item.end_date,
    is_active: item.is_active,
    usage_limit: item.usage_limit,
    usage_count: item.usage_count,
    valid_days: item.valid_days,
    valid_hours: item.valid_hours as { start: string; end: string } | undefined,
    user_segment: item.user_segment as UserSegmentType | undefined,
    combinable: item.combinable,
    min_purchase_amount: item.min_purchase_amount,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
  
  return promotionCodes;
}

/**
 * Get all promotion codes for an establishment
 */
export async function getPromotionCodes(establishmentId: string): Promise<PromotionCode[]> {
  const { data, error } = await supabase
    .from('establishment_promotions')
    .select('*')
    .eq('establishment_id', establishmentId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching promotion codes:', error);
    throw error;
  }
  
  // Convert the response to our PromotionCode type
  const promotionCodes: PromotionCode[] = (data || []).map((item: any): PromotionCode => ({
    id: item.id,
    code: item.code,
    description: item.description,
    discount_type: item.discount_type,
    discount_value: item.discount_value,
    establishment_id: item.establishment_id,
    start_date: item.start_date,
    end_date: item.end_date,
    is_active: item.is_active,
    usage_limit: item.usage_limit,
    usage_count: item.usage_count,
    valid_days: item.valid_days,
    valid_hours: item.valid_hours as { start: string; end: string } | undefined,
    user_segment: item.user_segment as UserSegmentType | undefined,
    combinable: item.combinable,
    min_purchase_amount: item.min_purchase_amount,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
  
  return promotionCodes;
}

/**
 * Update a promotion code
 */
export async function updatePromotionCode(id: string, params: Partial<CreatePromotionCodeParams>): Promise<PromotionCode | null> {
  const { data, error } = await supabase
    .from('establishment_promotions')
    .update(params)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating promotion code:', error);
    throw error;
  }
  
  // Convert the response to our PromotionCode type
  const promotionCode: PromotionCode = {
    id: data.id,
    code: data.code,
    description: data.description,
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    establishment_id: data.establishment_id,
    start_date: data.start_date,
    end_date: data.end_date,
    is_active: data.is_active,
    usage_limit: data.usage_limit,
    usage_count: data.usage_count,
    valid_days: data.valid_days,
    valid_hours: data.valid_hours as { start: string; end: string } | undefined,
    user_segment: data.user_segment as UserSegmentType | undefined,
    combinable: data.combinable,
    min_purchase_amount: data.min_purchase_amount,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
  
  return promotionCode;
}

/**
 * Delete a promotion code
 */
export async function deletePromotionCode(id: string): Promise<void> {
  const { error } = await supabase
    .from('establishment_promotions')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting promotion code:', error);
    throw error;
  }
}

/**
 * Get analytics for promotion codes
 */
export async function getPromotionAnalytics(establishmentId: string): Promise<PromotionAnalytics[]> {
  const { data, error } = await supabase
    .from('promotion_analytics')
    .select('*')
    .eq('establishment_id', establishmentId);
    
  if (error) {
    console.error('Error fetching promotion analytics:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Export promotion codes to CSV
 */
export function exportPromotionCodesToCSV(codes: PromotionCode[]): string {
  // Define CSV headers
  const headers = [
    'Code',
    'Description',
    'Type',
    'Value',
    'Start Date',
    'End Date',
    'Active',
    'Usage Limit',
    'Usage Count',
    'Valid Days',
    'Valid Hours',
    'User Segment',
    'Combinable',
    'Min Purchase'
  ].join(',');
  
  // Format each code as a CSV row
  const rows = codes.map(code => {
    const validDays = code.valid_days ? `"${code.valid_days.join(',')}"` : '';
    const validHours = code.valid_hours 
      ? `"${code.valid_hours.start}-${code.valid_hours.end}"` 
      : '';
    
    return [
      code.code,
      `"${code.description.replace(/"/g, '""')}"`, // Escape quotes in description
      code.discount_type,
      code.discount_value,
      code.start_date,
      code.end_date || '',
      code.is_active ? 'Yes' : 'No',
      code.usage_limit || '',
      code.usage_count || '0',
      validDays,
      validHours,
      code.user_segment || '',
      code.combinable ? 'Yes' : 'No',
      code.min_purchase_amount || ''
    ].join(',');
  });
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
}

/**
 * Parse CSV data to import promotion codes
 */
export function parseCSVForImport(csvData: string, establishmentId: string): CreatePromotionCodeParams[] {
  const lines = csvData.trim().split('\n');
  
  // Skip header row and process data rows
  return lines.slice(1).map((line) => {
    const columns = line.split(',');
    
    // Parse valid days from CSV
    const validDaysString = columns[9].replace(/"/g, '');
    const validDays = validDaysString ? validDaysString.split(',') : null;
    
    // Parse valid hours from CSV
    const validHoursString = columns[10].replace(/"/g, '');
    let validHours = null;
    if (validHoursString) {
      const [start, end] = validHoursString.split('-');
      validHours = { start, end };
    }
    
    return {
      code: columns[0],
      description: columns[1].replace(/(^"|"$)/g, '').replace(/""/g, '"'), // Unescape quotes
      discount_type: columns[2] as PromotionCodeType,
      discount_value: Number(columns[3]),
      establishment_id: establishmentId,
      start_date: columns[4],
      end_date: columns[5] || null,
      is_active: columns[6].toLowerCase() === 'yes',
      usage_limit: columns[7] ? Number(columns[7]) : null,
      valid_days: validDays as string[] | null,
      valid_hours: validHours,
      user_segment: columns[11] as UserSegmentType || null,
      combinable: columns[12].toLowerCase() === 'yes',
      min_purchase_amount: columns[13] ? Number(columns[13]) : null
    };
  });
}
