
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FeatureFlag } from '@/components/admin/systemBreakdown/types/releaseTypes';

export function useFeatureToggles() {
  const [featureToggles, setFeatureToggles] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchFeatureToggles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFeatureToggles(data);
    } catch (err) {
      console.error('Error fetching feature toggles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feature toggles');
      toast({
        title: 'Error',
        description: 'Failed to load feature toggles',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const updateFeatureToggle = async (id: string, updates: Partial<FeatureFlag>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('feature_flags')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // Update the local state
      setFeatureToggles(prev => 
        prev.map(toggle => toggle.id === id ? { ...toggle, ...updates } : toggle)
      );
      
      toast({
        title: 'Success',
        description: 'Feature toggle updated successfully',
      });
      
      return data;
    } catch (err) {
      console.error('Error updating feature toggle:', err);
      toast({
        title: 'Error',
        description: 'Failed to update feature toggle',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createFeatureToggle = async (toggleData: Partial<FeatureFlag>) => {
    try {
      setIsLoading(true);
      
      const newToggle = {
        name: toggleData.name || '',
        description: toggleData.description || '',
        status: toggleData.status || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('feature_flags')
        .insert([newToggle])
        .select();
      
      if (error) throw error;
      
      // Update the local state
      if (data && data.length > 0) {
        setFeatureToggles(prev => [data[0], ...prev]);
      }
      
      toast({
        title: 'Success',
        description: 'Feature toggle created successfully',
      });
      
      return data;
    } catch (err) {
      console.error('Error creating feature toggle:', err);
      toast({
        title: 'Error',
        description: 'Failed to create feature toggle',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteFeatureToggle = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('feature_flags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state
      setFeatureToggles(prev => prev.filter(toggle => toggle.id !== id));
      
      toast({
        title: 'Success',
        description: 'Feature toggle deleted successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting feature toggle:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete feature toggle',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    featureToggles,
    isLoading,
    error,
    fetchFeatureToggles,
    updateFeatureToggle,
    createFeatureToggle,
    deleteFeatureToggle,
  };
}
