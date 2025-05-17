
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  createPromotionCode, 
  deletePromotionCode, 
  getPromotionCodes,
  updatePromotionCode, 
  PromotionCode
} from '@/lib/promotions/api';
import { PromotionFormData } from '@/types/PromotionTypes';

export { PromotionFormData } from '@/types/PromotionTypes';

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
        discount_type: data.discountType,
        discount_value: data.discountValue,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate ? data.endDate.toISOString() : null,
        establishment_id: establishmentId,
        usage_limit: data.usageLimit || null,
        valid_days: data.validDays || null,
        min_purchase_amount: data.minPurchaseAmount || null,
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
      if (data.discountType) updateData.discount_type = data.discountType;
      if (data.discountValue !== undefined) updateData.discount_value = data.discountValue;
      if (data.startDate) updateData.start_date = data.startDate.toISOString();
      if (data.endDate) updateData.end_date = data.endDate.toISOString();
      if (data.validDays) updateData.valid_days = data.validDays;
      if (data.usageLimit !== undefined) updateData.usage_limit = data.usageLimit;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;
      if (data.minPurchaseAmount !== undefined) updateData.min_purchase_amount = data.minPurchaseAmount;
      
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
    return updatePromotion(id, { isActive: !currentStatus });
  };

  // Initialize promotions on mount
  useState(() => {
    loadPromotions();
  });

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
