
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Promotion, PromotionAnalytics } from '@/types/SupabaseTables';

export interface PromotionFormData {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number | null;
  start_date: string;
  end_date?: string;
  min_purchase?: number;
  max_discount?: number;
  usage_limit?: number;
}

export const useEstablishmentPromotions = (establishmentId: string) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchPromotions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch promotions for the establishment
      const { data, error } = await supabase
        .from('establishment_promotions')
        .select('*, promotion_redemptions(count)')
        .eq('establishment_id', establishmentId)
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      // Process the data to add usage count and ensure correct typing
      const processedData = data.map(promo => ({
        ...promo,
        discount_type: promo.discount_type as 'percentage' | 'fixed' | 'free_item',
        usage_count: promo.promotion_redemptions?.[0]?.count || 0
      })) as Promotion[];
      
      setPromotions(processedData);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch promotions');
      toast({
        title: 'Error',
        description: 'Failed to load promotions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addPromotion = async (formData: PromotionFormData) => {
    try {
      // Validate form data
      if (!formData.code || !formData.description || !formData.discount_type || !formData.start_date) {
        throw new Error('Please fill in all required fields');
      }
      
      const newPromotion = {
        ...formData,
        establishment_id: establishmentId,
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('establishment_promotions')
        .insert([newPromotion])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Cast the returned data to the correct type
      const typedData = {
        ...data,
        discount_type: data.discount_type as 'percentage' | 'fixed' | 'free_item'
      } as Promotion;
      
      setPromotions(prevPromotions => [typedData, ...prevPromotions]);
      
      toast({
        title: 'Success',
        description: `Your promotion "${formData.code}" has been added successfully`,
      });
      
      return typedData;
    } catch (err) {
      console.error('Error adding promotion:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to add promotion',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updatePromotion = async (id: string, formData: Partial<PromotionFormData>) => {
    try {
      const { data, error } = await supabase
        .from('establishment_promotions')
        .update(formData)
        .eq('id', id)
        .eq('establishment_id', establishmentId) // Additional security check
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Cast the returned data to the correct type
      const typedData = {
        ...data,
        discount_type: data.discount_type as 'percentage' | 'fixed' | 'free_item'
      } as Promotion;
      
      setPromotions(prevPromotions => 
        prevPromotions.map(promo => 
          promo.id === id ? typedData : promo
        )
      );
      
      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      });
      
      return typedData;
    } catch (err) {
      console.error('Error updating promotion:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update promotion',
        variant: 'destructive'
      });
      throw err;
    }
  };
  
  const deletePromotion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('establishment_promotions')
        .delete()
        .eq('id', id)
        .eq('establishment_id', establishmentId); // Additional security check
        
      if (error) throw new Error(error.message);
      
      setPromotions(prevPromotions => 
        prevPromotions.filter(promo => promo.id !== id)
      );
      
      toast({
        title: 'Success',
        description: 'The promotion has been removed successfully',
      });
    } catch (err) {
      console.error('Error removing promotion:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to remove promotion',
        variant: 'destructive'
      });
      throw err;
    }
  };
  
  const togglePromotionStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { data, error } = await supabase
        .from('establishment_promotions')
        .update({ is_active: !currentStatus })
        .eq('id', id)
        .eq('establishment_id', establishmentId) // Additional security check
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Cast the returned data to the correct type
      const typedData = {
        ...data,
        discount_type: data.discount_type as 'percentage' | 'fixed' | 'free_item'
      } as Promotion;
      
      setPromotions(prevPromotions => 
        prevPromotions.map(promo => 
          promo.id === id ? typedData : promo
        )
      );
      
      toast({
        title: 'Success',
        description: `Promotion ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      
      return typedData;
    } catch (err) {
      console.error('Error toggling promotion status:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update promotion status',
        variant: 'destructive'
      });
      throw err;
    }
  };
  
  const getPromotionAnalytics = async (promotionId: string): Promise<PromotionAnalytics> => {
    try {
      // Query the promotion_analytics view directly 
      const { data, error } = await supabase
        .from('promotion_analytics')
        .select('*')
        .eq('id', promotionId)
        .eq('establishment_id', establishmentId)
        .single();
        
      if (error) throw new Error(error.message);
      
      return data as PromotionAnalytics;
    } catch (err) {
      console.error('Error fetching promotion analytics:', err);
      toast({
        title: 'Error',
        description: 'Failed to load promotion analytics',
        variant: 'destructive'
      });
      throw err;
    }
  };

  // Load promotions on component mount
  useEffect(() => {
    if (establishmentId) {
      fetchPromotions();
    }
  }, [establishmentId]);
  
  // Subscribe to real-time changes for promotions
  useEffect(() => {
    if (!establishmentId) return;
    
    const channel = supabase
      .channel('establishment-promotions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'establishment_promotions',
        filter: `establishment_id=eq.${establishmentId}`
      }, (payload) => {
        // Refresh promotions when changes occur
        fetchPromotions();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [establishmentId]);

  return {
    promotions,
    isLoading,
    error,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionStatus,
    getPromotionAnalytics,
    refreshPromotions: fetchPromotions
  };
};
