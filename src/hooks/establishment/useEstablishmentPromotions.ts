
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Promotion } from '@/components/establishment/PromotionsTab';
import { useToast } from '@/hooks/use-toast';
import { ValidDays, UserSegmentType } from '@/types/auth/AuthTypes';

interface PromotionValidationResponse {
  valid: boolean;
  message?: string;
  promotion?: Partial<Promotion>;
}

export const useEstablishmentPromotions = (establishmentId: string) => {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch promotions
  useEffect(() => {
    fetchPromotions();
  }, [establishmentId]);
  
  const fetchPromotions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('establishment_promotions')
        .select(`
          *,
          promotion_redemptions:promotion_redemptions(id)
        `)
        .eq('establishment_id', establishmentId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert supabase data to our Promotion type
      const formattedPromotions = data.map((item: any): Promotion => {
        return {
          id: item.id,
          code: item.code,
          description: item.description,
          discount_type: item.discount_type,
          discount_value: item.discount_value || 0,
          start_date: item.start_date,
          end_date: item.end_date,
          is_active: item.is_active,
          usage_limit: item.usage_limit || null,
          usage_count: item.promotion_redemptions?.length || 0,
          valid_days: item.valid_days as string[] | null,
          valid_hours: typeof item.valid_hours === 'object' 
            ? item.valid_hours as { start: string; end: string } 
            : null,
          user_segment: item.user_segment as UserSegmentType | null,
          combinable: item.combinable,
          min_purchase_amount: item.min_purchase_amount || null,
        };
      });
      
      setPromotions(formattedPromotions);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch promotions');
      toast({
        title: "Error",
        description: `Could not load promotions: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddPromotion = async (promotion: Partial<Promotion>) => {
    try {
      const { data, error } = await supabase
        .from('establishment_promotions')
        .insert([{ 
          ...promotion,
          establishment_id: establishmentId 
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Promotion code has been added",
      });
      
      // Refetch promotions to get the updated list
      fetchPromotions();
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Could not add promotion: ${err.message}`,
        variant: "destructive"
      });
    }
  };
  
  const handleDeletePromotion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('establishment_promotions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Promotion code has been deleted",
      });
      
      // Update local state
      setPromotions((current) => current.filter(promo => promo.id !== id));
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Could not delete promotion: ${err.message}`,
        variant: "destructive"
      });
    }
  };
  
  const validatePromotionCode = async (
    code: string, 
    userId?: string, 
    purchaseAmount?: number
  ): Promise<PromotionValidationResponse> => {
    try {
      const { data: promotionData, error: fetchError } = await supabase
        .from('establishment_promotions')
        .select()
        .eq('code', code)
        .eq('establishment_id', establishmentId)
        .single();
      
      if (fetchError) {
        return { 
          valid: false, 
          message: 'Invalid promotion code'
        };
      }
      
      // If no active promotion found
      if (!promotionData || !promotionData.is_active) {
        return { 
          valid: false, 
          message: 'This promotion code is not active'
        };
      }
      
      // Call the validate_promotion function
      const { data, error } = await supabase
        .rpc('validate_promotion', {
          p_promotion_id: promotionData.id,
          p_user_id: userId,
          p_purchase_amount: purchaseAmount
        });
      
      if (error) {
        return { 
          valid: false, 
          message: error.message
        };
      }
      
      // Convert the JSON response to our type
      const response = data as PromotionValidationResponse;
      
      return response;
    } catch (err: any) {
      return {
        valid: false,
        message: err.message || 'Error validating promotion code'
      };
    }
  };
  
  return {
    promotions,
    isLoading,
    error,
    handleAddPromotion,
    handleDeletePromotion,
    validatePromotionCode,
    refreshPromotions: fetchPromotions
  };
};
