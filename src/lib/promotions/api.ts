import { supabase } from '@/integrations/supabase/client';
import { PromotionCode, BatchCreateParams, PromotionAnalytics } from '@/types/PromotionTypes';
import promoterService from '@/services/promoterService';

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

// Update the mapping functions to use used_count instead of usage_count
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
