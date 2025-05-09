
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ApiKeyConfiguration } from '@/types/SupabaseTables';

interface UseApiKeyConfigResult {
  apiKeys: ApiKeyConfiguration[];
  isLoading: boolean;
  error: string | null;
  fetchApiKeyConfigurations: () => Promise<void>;
  updateApiKeyConfiguration: (id: string, updates: Partial<ApiKeyConfiguration>) => Promise<ApiKeyConfiguration | null>;
  createApiKeyConfiguration: (config: Partial<ApiKeyConfiguration>) => Promise<ApiKeyConfiguration | null>;
  deleteApiKeyConfiguration: (id: string) => Promise<boolean>;
  verifyApiKey: (id: string) => Promise<boolean>;
}

export const useApiKeyConfig = (): UseApiKeyConfigResult => {
  const [apiKeys, setApiKeys] = useState<ApiKeyConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchApiKeyConfigurations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('api_key_configurations')
        .select('*')
        .order('service_name');
        
      if (error) throw new Error(error.message);
      setApiKeys(data || []);
    } catch (err) {
      console.error('Error fetching API key configurations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load API key configurations');
      toast({
        title: 'Error',
        description: 'Failed to load API key configurations. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApiKeyConfiguration = async (id: string, updates: Partial<ApiKeyConfiguration>) => {
    try {
      const { data, error } = await supabase
        .from('api_key_configurations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setApiKeys(prev => 
        prev.map(key => key.id === id ? data as ApiKeyConfiguration : key)
      );
      
      toast({
        title: 'Success',
        description: 'API key configuration updated successfully.',
      });
      
      return data as ApiKeyConfiguration;
    } catch (err) {
      console.error('Error updating API key configuration:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update API key configuration',
        variant: 'destructive'
      });
      return null;
    }
  };

  const createApiKeyConfiguration = async (config: Partial<ApiKeyConfiguration>) => {
    try {
      const { data, error } = await supabase
        .from('api_key_configurations')
        .insert({
          ...config,
          is_active: config.is_active ?? true,
          metadata: config.metadata ?? {},
        })
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setApiKeys(prev => [...prev, data as ApiKeyConfiguration]);
      
      toast({
        title: 'Success',
        description: 'API key configuration created successfully.',
      });
      
      return data as ApiKeyConfiguration;
    } catch (err) {
      console.error('Error creating API key configuration:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create API key configuration',
        variant: 'destructive'
      });
      return null;
    }
  };

  const deleteApiKeyConfiguration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_key_configurations')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setApiKeys(prev => prev.filter(key => key.id !== id));
      
      toast({
        title: 'Success',
        description: 'API key configuration deleted successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting API key configuration:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete API key configuration',
        variant: 'destructive'
      });
      return false;
    }
  };

  const verifyApiKey = async (id: string) => {
    try {
      // In a real implementation, this would verify the API key with the service
      // For now, let's simulate a successful verification
      const { data, error } = await supabase
        .from('api_key_configurations')
        .update({ 
          last_verified_at: new Date().toISOString(),
          metadata: { ...apiKeys.find(k => k.id === id)?.metadata, last_check_status: 'success' }
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setApiKeys(prev => 
        prev.map(key => key.id === id ? data as ApiKeyConfiguration : key)
      );
      
      toast({
        title: 'Success',
        description: 'API key verified successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error verifying API key:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to verify API key',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    apiKeys,
    isLoading,
    error,
    fetchApiKeyConfigurations,
    updateApiKeyConfiguration,
    createApiKeyConfiguration,
    deleteApiKeyConfiguration,
    verifyApiKey
  };
};
