
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  createPromotionCode, 
  deletePromotionCode, 
  getPromotionCodes,
  updatePromotionCode, 
  PromotionCode
} from '@/lib/promotions/api';
import { PromotionFormData } from '@/types/PromotionTypes';

// Re-export the type correctly
export type { PromotionFormData } from '@/types/PromotionTypes';

export const useEstablishmentPromotions = (establishmentId: string) => {
  const [promotions, setPromotions] = useState<PromotionCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load promotions
  const loadPromotions = async () => {
    if (!establishmentId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getPromotionCodes(establishmentId);
      setPromotions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load promotions';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new promotion
  const handleAddPromotion = async (data: PromotionFormData): Promise<void> => {
    if (!establishmentId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await createPromotionCode({
        code: data.code,
        description: data.description,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        start_date: data.start_date instanceof Date ? data.start_date.toISOString() : data.start_date,
        end_date: data.end_date ? (data.end_date instanceof Date ? data.end_date.toISOString() : data.end_date) : null,
        establishment_id: establishmentId,
        usage_limit: data.usage_limit || null,
        valid_days: data.valid_days || null,
        min_purchase_amount: data.min_purchase_amount || null,
        combinable: data.combinable ?? true
      });
      
      toast({
        title: 'Success',
        description: 'Promotion code created successfully',
      });
      
      // Reload promotions list
      await loadPromotions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create promotion';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a promotion
  const handleDeletePromotion = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deletePromotionCode(id);
      
      toast({
        title: 'Success',
        description: 'Promotion code deleted successfully',
      });
      
      // Update local state
      setPromotions(promotions.filter(promo => promo.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete promotion';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update a promotion
  const updatePromotion = async (id: string, data: Partial<PromotionFormData>): Promise<void> => {
    if (!establishmentId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Transform the form data to match the API requirements
      const updateData: any = {};
      
      if (data.code) updateData.code = data.code;
      if (data.description) updateData.description = data.description;
      if (data.discount_type) updateData.discount_type = data.discount_type;
      if (data.discount_value !== undefined) updateData.discount_value = data.discount_value;
      if (data.start_date) updateData.start_date = data.start_date instanceof Date ? data.start_date.toISOString() : data.start_date;
      if (data.end_date) updateData.end_date = data.end_date instanceof Date ? data.end_date.toISOString() : data.end_date;
      if (data.valid_days) updateData.valid_days = data.valid_days;
      if (data.usage_limit !== undefined) updateData.usage_limit = data.usage_limit;
      if (data.is_active !== undefined) updateData.is_active = data.is_active;
      if (data.min_purchase_amount !== undefined) updateData.min_purchase_amount = data.min_purchase_amount;
      
      await updatePromotionCode(id, updateData);
      
      toast({
        title: 'Success',
        description: 'Promotion code updated successfully',
      });
      
      // Reload promotions list
      await loadPromotions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update promotion';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle promotion status
  const togglePromotionStatus = async (id: string, currentStatus: boolean): Promise<void> => {
    return updatePromotion(id, { is_active: !currentStatus });
  };

  // Initialize promotions on mount
  useEffect(() => {
    loadPromotions();
  }, []);

  return {
    promotions,
    isLoading,
    error,
    handleAddPromotion,
    handleDeletePromotion,
    updatePromotion,
    togglePromotionStatus
  };
};
