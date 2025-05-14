
import { supabase } from '@/integrations/supabase/client';

// Types
export interface PromotionCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  establishment_id: string;
  usage_limit?: number | null;
  usage_count?: number;
  valid_days?: string[] | null;
  valid_hours?: { start: string; end: string } | null;
  user_segment?: string | null;
  combinable: boolean;
  min_purchase_amount?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromotionCodeParams {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string | null;
  establishment_id: string;
  usage_limit?: number | null;
  valid_days?: string[] | null;
  valid_hours?: { start: string; end: string } | null;
  user_segment?: string | null;
  combinable?: boolean;
  min_purchase_amount?: number | null;
}

export interface BatchCreateParams {
  establishment_id: string;
  codes: Omit<CreatePromotionCodeParams, 'establishment_id'>[];
}

export interface PromotionAnalytics {
  id: string;
  promotion_id: string;
  total_usage: number;
  total_revenue: number;
  conversion_rate: number;
  average_order_value: number;
  period_start?: string;
  period_end?: string;
}

// Fetch all promotion codes for an establishment
export async function getPromotionCodes(establishmentId: string): Promise<PromotionCode[]> {
  const { data, error } = await supabase
    .from('establishment_promotions')
    .select(`
      *,
      promotion_redemptions:promotion_redemptions(id)
    `)
    .eq('establishment_id', establishmentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promotion codes:', error);
    throw new Error(error.message);
  }

  // Format the data with proper types
  return data.map((item: any): PromotionCode => {
    return {
      id: item.id,
      code: item.code,
      description: item.description,
      discount_type: item.discount_type,
      discount_value: item.discount_value || 0,
      start_date: item.start_date,
      end_date: item.end_date,
      is_active: item.is_active,
      establishment_id: item.establishment_id,
      usage_limit: item.usage_limit || null,
      usage_count: item.promotion_redemptions?.length || 0,
      valid_days: item.valid_days as string[] | null,
      valid_hours: typeof item.valid_hours === 'object' 
        ? item.valid_hours as { start: string; end: string } 
        : null,
      user_segment: item.user_segment as string | null,
      combinable: item.combinable,
      min_purchase_amount: item.min_purchase_amount || null,
      created_at: item.created_at,
      updated_at: item.updated_at
    };
  });
}

// Create a new promotion code
export async function createPromotionCode(params: CreatePromotionCodeParams): Promise<PromotionCode> {
  const { data, error } = await supabase
    .from('establishment_promotions')
    .insert({
      ...params,
      combinable: params.combinable ?? true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating promotion code:', error);
    throw new Error(error.message);
  }

  return data;
}

// Update an existing promotion code
export async function updatePromotionCode(id: string, params: Partial<CreatePromotionCodeParams>): Promise<PromotionCode> {
  const { data, error } = await supabase
    .from('establishment_promotions')
    .update(params)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating promotion code:', error);
    throw new Error(error.message);
  }

  return data;
}

// Delete a promotion code
export async function deletePromotionCode(id: string): Promise<void> {
  const { error } = await supabase
    .from('establishment_promotions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting promotion code:', error);
    throw new Error(error.message);
  }
}

// Batch create promotion codes
export async function batchCreatePromotionCodes(params: BatchCreateParams): Promise<PromotionCode[]> {
  const promotions = params.codes.map(code => ({
    ...code,
    establishment_id: params.establishment_id,
    combinable: code.combinable ?? true
  }));

  const { data, error } = await supabase
    .from('establishment_promotions')
    .insert(promotions)
    .select();

  if (error) {
    console.error('Error batch creating promotion codes:', error);
    throw new Error(error.message);
  }

  return data;
}

// Get analytics for promotion codes
export async function getPromotionAnalytics(establishmentId: string): Promise<PromotionAnalytics[]> {
  // This would typically be an API call to a dedicated analytics endpoint
  // For demonstration purposes, we're using the mock data
  const { data, error } = await supabase
    .from('promotion_analytics')
    .select('*')
    .eq('establishment_id', establishmentId);
  
  if (error) {
    console.error('Error fetching promotion analytics:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// Convert promotion codes to CSV format for export
export function exportPromotionCodesToCSV(codes: PromotionCode[]): string {
  // Define CSV headers
  const headers = [
    'code',
    'description',
    'discount_type',
    'discount_value',
    'start_date',
    'end_date',
    'is_active',
    'usage_limit',
    'usage_count',
    'valid_days',
    'valid_hours_start',
    'valid_hours_end',
    'user_segment',
    'combinable',
    'min_purchase_amount'
  ];
  
  // Convert codes to CSV rows
  const rows = codes.map(code => [
    code.code,
    code.description,
    code.discount_type,
    code.discount_value,
    code.start_date,
    code.end_date || '',
    code.is_active ? 'true' : 'false',
    code.usage_limit || '',
    code.usage_count || '0',
    code.valid_days ? code.valid_days.join(';') : '',
    code.valid_hours ? code.valid_hours.start : '',
    code.valid_hours ? code.valid_hours.end : '',
    code.user_segment || '',
    code.combinable ? 'true' : 'false',
    code.min_purchase_amount || ''
  ]);
  
  // Combine headers and rows
  return [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    )
  ].join('\n');
}

// Parse CSV data for importing promotion codes
export function parseCSVForImport(csvData: string, establishmentId: string): CreatePromotionCodeParams[] {
  const lines = csvData.split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file is empty or invalid');
  }
  
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map(line => {
      // Handle quoted fields with commas
      const fields: string[] = [];
      let inQuotes = false;
      let currentField = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(currentField);
          currentField = '';
        } else {
          currentField += char;
        }
      }
      fields.push(currentField); // Add the last field
      
      // Map CSV fields to promotion code object
      const values: Record<string, any> = {};
      headers.forEach((header, index) => {
        if (index < fields.length) {
          values[header] = fields[index]?.trim() || '';
        }
      });
      
      return {
        code: values.code || `PROMO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        description: values.description || 'Imported promotion',
        discount_type: values.discount_type as 'percentage' | 'fixed' | 'free_item' || 'percentage',
        discount_value: parseFloat(values.discount_value) || 0,
        start_date: values.start_date || new Date().toISOString(),
        end_date: values.end_date || null,
        establishment_id: establishmentId,
        usage_limit: values.usage_limit ? parseInt(values.usage_limit) : null,
        valid_days: values.valid_days ? values.valid_days.split(';') : null,
        valid_hours: values.valid_hours_start && values.valid_hours_end ? {
          start: values.valid_hours_start,
          end: values.valid_hours_end
        } : null,
        user_segment: values.user_segment || null,
        combinable: values.combinable === 'true',
        min_purchase_amount: values.min_purchase_amount ? parseFloat(values.min_purchase_amount) : null
      };
    });
}
