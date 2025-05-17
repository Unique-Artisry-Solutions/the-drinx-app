
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FeatureFlag } from '@/components/admin/systemBreakdown/types/releaseTypes';
import { useRetry } from '@/hooks/useRetry';

interface UseFeatureTogglesResult {
  featureToggles: FeatureFlag[];
  isLoading: boolean;
  error: string | null;
  fetchFeatureToggles: () => Promise<void>;
  updateFeatureToggle: (id: string, updates: Partial<FeatureFlag>) => Promise<FeatureFlag | null>;
  createFeatureToggle: (toggle: Partial<FeatureFlag>) => Promise<FeatureFlag | null>;
  deleteFeatureToggle: (id: string) => Promise<boolean>;
}

export const useFeatureToggles = (): UseFeatureTogglesResult => {
  const [featureToggles, setFeatureToggles] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { executeWithRetry } = useRetry({ maxAttempts: 3, baseDelay: 1000 });

  const fetchFeatureToggles = useCallback(async () => {
    if (isLoading) return; // Prevent concurrent fetches
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('*')
          .order('name');
          
        if (error) throw new Error(error.message);
        return data as FeatureFlag[] || [];
      };
      
      const data = await executeWithRetry(fetchData);
      setFeatureToggles(data);
    } catch (err) {
      console.error('Error fetching feature toggles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feature toggles');
      toast({
        title: 'Error',
        description: 'Failed to load feature toggles. We will automatically retry.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, executeWithRetry, isLoading]);

  const updateFeatureToggle = async (id: string, updates: Partial<FeatureFlag>) => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setFeatureToggles(prev => 
        prev.map(toggle => toggle.id === id ? data as FeatureFlag : toggle)
      );
      
      toast({
        title: 'Success',
        description: 'Feature toggle updated successfully.',
      });
      
      // Track the feature toggle change in the feature metrics table
      await supabase
        .from('feature_metrics')
        .insert({
          feature_id: id,
          event_type: 'toggle_update',
          event_data: {
            previous: featureToggles.find(t => t.id === id)?.status,
            current: updates.status,
            updated_by: (await supabase.auth.getUser()).data.user?.id
          }
        });
      
      return data as FeatureFlag;
    } catch (err) {
      console.error('Error updating feature toggle:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update feature toggle',
        variant: 'destructive'
      });
      return null;
    }
  };

  const createFeatureToggle = async (toggle: Partial<FeatureFlag>) => {
    try {
      // Make sure name is provided
      if (!toggle.name) {
        throw new Error('Feature name is required');
      }
      
      const { data, error } = await supabase
        .from('feature_flags')
        .insert({
          name: toggle.name,
          description: toggle.description,
          status: toggle.status ?? false
        })
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setFeatureToggles(prev => [...prev, data as FeatureFlag]);
      
      toast({
        title: 'Success',
        description: 'Feature toggle created successfully.',
      });
      
      return data as FeatureFlag;
    } catch (err) {
      console.error('Error creating feature toggle:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create feature toggle',
        variant: 'destructive'
      });
      return null;
    }
  };

  const deleteFeatureToggle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setFeatureToggles(prev => prev.filter(toggle => toggle.id !== id));
      
      toast({
        title: 'Success',
        description: 'Feature toggle deleted successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting feature toggle:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete feature toggle',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    featureToggles,
    isLoading,
    error,
    fetchFeatureToggles,
    updateFeatureToggle,
    createFeatureToggle,
    deleteFeatureToggle
  };
};
