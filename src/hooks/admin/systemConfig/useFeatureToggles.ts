
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FeatureToggle } from '@/types/SupabaseTables';

interface UseFeatureTogglesResult {
  featureToggles: FeatureToggle[];
  isLoading: boolean;
  error: string | null;
  fetchFeatureToggles: () => Promise<void>;
  updateFeatureToggle: (id: string, updates: Partial<FeatureToggle>) => Promise<FeatureToggle | null>;
  createFeatureToggle: (toggle: Partial<FeatureToggle>) => Promise<FeatureToggle | null>;
  deleteFeatureToggle: (id: string) => Promise<boolean>;
}

export const useFeatureToggles = (): UseFeatureTogglesResult => {
  const [featureToggles, setFeatureToggles] = useState<FeatureToggle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFeatureToggles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name');
        
      if (error) throw new Error(error.message);
      setFeatureToggles(data as FeatureToggle[] || []);
    } catch (err) {
      console.error('Error fetching feature toggles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feature toggles');
      toast({
        title: 'Error',
        description: 'Failed to load feature toggles. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeatureToggle = async (id: string, updates: Partial<FeatureToggle>) => {
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
        prev.map(toggle => toggle.id === id ? data as FeatureToggle : toggle)
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
      
      return data as FeatureToggle;
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

  const createFeatureToggle = async (toggle: Partial<FeatureToggle>) => {
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
      setFeatureToggles(prev => [...prev, data as FeatureToggle]);
      
      toast({
        title: 'Success',
        description: 'Feature toggle created successfully.',
      });
      
      return data as FeatureToggle;
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
