
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Promotion } from '@/types/PromotionTypes';

export const useSavedPromotionCodes = (userId: string) => {
  const [savedCodes, setSavedCodes] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchSavedCodes = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        setSavedCodes([]);
        return;
      }
      
      // First get the saved code IDs
      const { data: savedCodesData, error: savedCodesError } = await supabase
        .from('user_saved_codes')
        .select('code_id')
        .eq('user_id', userId);
      
      if (savedCodesError) throw savedCodesError;
      
      if (savedCodesData.length === 0) {
        setSavedCodes([]);
        setLoading(false);
        return;
      }
      
      // Then get the actual promotion details
      const codeIds = savedCodesData.map(item => item.code_id);
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('establishment_promotions')
        .select('*')
        .in('id', codeIds);
      
      if (promotionsError) throw promotionsError;
      
      // Convert database promotions to our Promotion type
      const formattedPromotions: Promotion[] = promotionsData.map(p => ({
        id: p.id,
        code: p.code,
        description: p.description,
        discount_type: p.discount_type as 'percentage' | 'fixed' | 'free_item',
        discount_value: p.discount_value,
        start_date: p.start_date,
        end_date: p.end_date || undefined,
        is_active: p.is_active,
        usage_limit: p.usage_limit || null,
        usage_count: 0, // This might need to be fetched separately
        valid_days: p.valid_days || null,
        valid_hours: p.valid_hours || null,
        user_segment: p.user_segment || null,
        combinable: p.combinable,
        min_purchase_amount: p.min_purchase_amount || null
      }));
      
      setSavedCodes(formattedPromotions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching saved codes'));
      toast({
        title: 'Error fetching saved promotion codes',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const removeSavedCode = useCallback(async (codeId: string) => {
    try {
      const { error } = await supabase
        .from('user_saved_codes')
        .delete()
        .eq('user_id', userId)
        .eq('code_id', codeId);
      
      if (error) throw error;
      
      // Update local state
      setSavedCodes(prev => prev.filter(code => code.id !== codeId));
      
      toast({
        title: 'Promotion code removed',
        description: 'The promotion code has been removed from your saved codes',
      });
    } catch (err) {
      toast({
        title: 'Error removing code',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  }, [userId, toast]);

  const copyToClipboard = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(
      () => {
        toast({
          title: 'Code copied',
          description: 'Promotion code copied to clipboard',
        });
      },
      () => {
        toast({
          title: 'Failed to copy',
          description: 'Please try copying the code manually',
          variant: 'destructive',
        });
      }
    );
  }, [toast]);

  useEffect(() => {
    fetchSavedCodes();
  }, [fetchSavedCodes]);

  return {
    savedCodes,
    loading,
    error,
    fetchSavedCodes,
    removeSavedCode,
    copyToClipboard
  };
};
