
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number | null;
  start_date: string;
  end_date?: string | null;
  establishment_id: string;
  is_active: boolean;
  combinable: boolean;
  min_purchase_amount?: number | null;
  valid_days?: string[] | null;
  valid_hours?: { start: string; end: string } | null;
  user_segment?: string | null;
}

export interface PromotionFormData {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  start_date: string;
  end_date?: string;
  min_purchase_amount?: number;
  valid_days?: string[];
  valid_hours?: { start: string; end: string };
  user_segment?: string;
  combinable?: boolean;
}

export const useEstablishmentPromotions = (establishmentId: string) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPromotions();
  }, [establishmentId]);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('establishment_promotions')
        .select('*')
        .eq('establishment_id', establishmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPromotions(data || []);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch promotions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPromotion = async (promotion: Partial<Promotion>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('establishment_promotions')
        .insert({
          ...promotion,
          establishment_id: establishmentId
        });

      if (error) throw error;
      
      fetchPromotions();
      
      toast({
        title: 'Success',
        description: 'Promotion created successfully',
      });
    } catch (err) {
      console.error('Error adding promotion:', err);
      toast({
        title: 'Error',
        description: 'Failed to create promotion',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const handleUpdatePromotion = async (id: string, updates: Partial<Promotion>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('establishment_promotions')
        .update(updates)
        .eq('id', id)
        .eq('establishment_id', establishmentId);

      if (error) throw error;
      
      fetchPromotions();
      
      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      });
    } catch (err) {
      console.error('Error updating promotion:', err);
      toast({
        title: 'Error',
        description: 'Failed to update promotion',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const handleDeletePromotion = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('establishment_promotions')
        .delete()
        .eq('id', id)
        .eq('establishment_id', establishmentId);

      if (error) throw error;
      
      setPromotions(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: 'Success',
        description: 'Promotion deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting promotion:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete promotion',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const validatePromotionCode = async (code: string, userId?: string, purchaseAmount?: number): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('establishment_promotions')
        .select('*')
        .eq('code', code.trim())
        .eq('is_active', true)
        .single();

      if (error) {
        return false;
      }

      // Additional validation logic can be added here
      return true;
    } catch (err) {
      console.error('Error validating promotion code:', err);
      return false;
    }
  };

  const refreshPromotions = async (): Promise<void> => {
    await fetchPromotions();
  };

  return {
    promotions,
    isLoading,
    error,
    handleAddPromotion,
    handleUpdatePromotion: handleUpdatePromotion,
    handleDeletePromotion,
    validatePromotionCode,
    refreshPromotions
  };
};
