import { supabase } from '@/integrations/supabase/client';
import { PromotionCode, BatchCreateParams, PromotionAnalytics, CreatePromotionCodeParams } from '@/types/PromotionTypes';
import promoterService from '@/services/promoterService';

// Export these types so they can be imported elsewhere
export type { PromotionCode, BatchCreateParams, PromotionAnalytics, CreatePromotionCodeParams };

export const getPromotionCodes = async (establishmentId: string): Promise<PromotionCode[]> => {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('establishment_id', establishmentId);

    if (error) {
      console.error("Error fetching promotion codes:", error);
      throw new Error(`Failed to fetch promotion codes: ${error.message}`);
    }

    if (!data) {
      console.warn("No promotion codes found for establishment:", establishmentId);
      return [];
    }

    return data.map(mapPromotionFromDb);
  } catch (error) {
    console.error("Unexpected error fetching promotion codes:", error);
    throw error;
  }
};

export const createPromotionCode = async (params: any): Promise<PromotionCode> => {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .insert([params])
      .select()
      .single();

    if (error) {
      console.error("Error creating promotion code:", error);
      throw new Error(`Failed to create promotion code: ${error.message}`);
    }

    return mapPromotionFromDb(data);
  } catch (error) {
    console.error("Unexpected error creating promotion code:", error);
    throw error;
  }
};

export const batchCreatePromotionCodes = async (params: BatchCreateParams): Promise<PromotionCode[]> => {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .insert(params.codes)
      .select();

    if (error) {
      console.error("Error creating promotion codes:", error);
      throw new Error(`Failed to create promotion codes: ${error.message}`);
    }

    if (!data) {
      console.warn("No promotion codes created for establishment:", params.establishment_id);
      return [];
    }

    return data.map(mapPromotionFromDb);
  } catch (error) {
    console.error("Unexpected error creating promotion codes:", error);
    throw error;
  }
};

export const getPromotionCodeById = async (id: string): Promise<PromotionCode | null> => {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // If the error is specifically a "not found" error, return null
      if (error.message.includes('No rows found')) {
        return null;
      }
      console.error("Error fetching promotion code by ID:", error);
      throw new Error(`Failed to fetch promotion code by ID: ${error.message}`);
    }

    return mapPromotionFromDb(data);
  } catch (error) {
    console.error("Unexpected error fetching promotion code by ID:", error);
    throw error;
  }
};

export const updatePromotionCode = async (id: string, updates: Partial<PromotionCode>): Promise<PromotionCode | null> => {
  try {
    const { data, error } = await supabase
      .from('establishment_promotions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating promotion code:", error);
      throw new Error(`Failed to update promotion code: ${error.message}`);
    }

    return mapPromotionFromDb(data);
  } catch (error) {
    console.error("Unexpected error updating promotion code:", error);
    throw error;
  }
};

export const deletePromotionCode = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('establishment_promotions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting promotion code:", error);
      throw new Error(`Failed to delete promotion code: ${error.message}`);
    }
  } catch (error) {
    console.error("Unexpected error deleting promotion code:", error);
    throw error;
  }
};

// Add missing function declarations that are used in usePromotionCodes

export const getPromotionAnalytics = async (establishmentId: string): Promise<PromotionAnalytics[]> => {
  // Mock implementation for now
  return [{
    id: "mock-analytics-id",
    promotion_id: "mock-promo-id",
    code: "MOCK",
    description: "Mock promotion analytics",
    discount_type: "percentage",
    discount_value: 10,
    start_date: new Date().toISOString(),
    establishment_id: establishmentId,
    redemption_count: 5,
    unique_users: 3,
    avg_purchase_amount: 45.50,
    total_discount_amount: 22.75,
    successful_validations: 12,
    failed_validations: 2,
    auto_applied_count: 0,
    total_usage: 17,
    total_revenue: 300,
    conversion_rate: 12.5
  }];
};

export const exportPromotionCodesToCSV = (promotions: PromotionCode[]): string => {
  // Basic CSV export implementation
  const headers = ['code', 'description', 'discount_type', 'discount_value', 'start_date', 'end_date', 'is_active'];
  
  const csvRows = [
    headers.join(','),
    ...promotions.map(p => {
      return [
        p.code,
        `"${p.description.replace(/"/g, '""')}"`,
        p.discount_type,
        p.discount_value,
        p.start_date,
        p.end_date || '',
        p.is_active ? 'true' : 'false'
      ].join(',');
    })
  ];
  
  return csvRows.join('\n');
};

export const parseCSVForImport = (csvData: string, establishmentId: string): CreatePromotionCodeParams[] => {
  // Basic CSV import implementation
  const rows = csvData.split('\n').filter(row => row.trim() !== '');
  const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
  
  return rows.slice(1).map(row => {
    const values = row.split(',');
    const rowData: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      rowData[header] = values[index] ? values[index].trim() : '';
    });
    
    return {
      code: rowData.code,
      description: rowData.description,
      discount_type: rowData.discount_type as 'percentage' | 'fixed' | 'free_item',
      discount_value: parseFloat(rowData.discount_value),
      start_date: rowData.start_date,
      end_date: rowData.end_date || null,
      establishment_id: establishmentId,
      usage_limit: rowData.usage_limit ? parseInt(rowData.usage_limit, 10) : null,
      valid_days: rowData.valid_days ? JSON.parse(rowData.valid_days) : null,
      min_purchase_amount: rowData.min_purchase_amount ? parseFloat(rowData.min_purchase_amount) : null,
      combinable: rowData.combinable === 'true'
    };
  });
};

// Keep the mapping function as is
const mapPromotionFromDb = (data: any): PromotionCode => ({
  id: data.id,
  code: data.code,
  description: data.description,
  discount_type: data.discount_type,
  discount_value: data.discount_value,
  start_date: data.start_date,
  end_date: data.end_date,
  is_active: data.is_active,
  establishment_id: data.establishment_id,
  user_segment: data.user_segment,
  usage_limit: data.usage_limit,
  used_count: data.used_count, // Using used_count consistently
  valid_days: data.valid_days,
  valid_hours: data.valid_hours,
  min_purchase_amount: data.min_purchase_amount,
  combinable: data.combinable,
  created_at: data.created_at,
  updated_at: data.updated_at
});
