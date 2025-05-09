
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SystemSetting } from '@/types/SupabaseTables';
import { useRetry } from '@/hooks/useRetry';

interface UseSystemSettingsOptions {
  category?: string;
  initialFetch?: boolean;
}

export const useSystemSettings = (options: UseSystemSettingsOptions = {}) => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const requestIdRef = useRef<string>('');
  const loadingRef = useRef<boolean>(false);
  const categoryRef = useRef<string | undefined>(options.category);
  const isMountedRef = useRef<boolean>(true);
  
  const { category, initialFetch = true } = options;

  // Update category ref when category changes
  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const { executeWithRetry, isRetrying } = useRetry({ 
    maxAttempts: 3, 
    baseDelay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Retrying system settings fetch, attempt ${attempt} after error: ${error.message}`);
    }
  });

  // Stable function to generate request ID
  const generateRequestId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }, []);

  // Fetch system settings - properly memoized and stable
  const fetchSettings = useCallback(async () => {
    // Prevent concurrent fetches using ref instead of state to avoid re-renders
    if (loadingRef.current) return;
    
    // Generate a unique request ID to track this specific request
    const requestId = generateRequestId();
    requestIdRef.current = requestId;
    
    if (isMountedRef.current) {
      setIsLoading(true);
    }
    loadingRef.current = true;
    setError(null);
    
    try {
      const fetchData = async () => {
        // If request ID doesn't match, another request has superseded this one
        if (requestId !== requestIdRef.current) {
          throw new Error('Request superseded');
        }
        
        let query = supabase
          .from('system_settings')
          .select('*');
          
        if (categoryRef.current) {
          query = query.eq('category', categoryRef.current);
        }
        
        const { data, error } = await query.order('category', { ascending: true });
        
        if (error) throw error;
        return data as SystemSetting[];
      };
      
      // Use the retry mechanism
      const data = await executeWithRetry(fetchData);
      
      // Only update state if this is still the most recent request and component is mounted
      if (requestId === requestIdRef.current && isMountedRef.current) {
        setSettings(data);
      }
    } catch (err) {
      // Only update error state if this is still the most recent request and component is mounted
      if (requestId === requestIdRef.current && isMountedRef.current) {
        console.error('Error fetching system settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load system settings');
        
        // Don't show toast during retries
        if (!isRetrying) {
          toast({
            title: 'Error',
            description: 'Failed to load system settings. Please try again.',
            variant: 'destructive'
          });
        }
      }
    } finally {
      // Update loading state only if this is the current request and component is mounted
      if (requestId === requestIdRef.current && isMountedRef.current) {
        setIsLoading(false);
      }
      loadingRef.current = false;
    }
  }, [toast, executeWithRetry, isRetrying, generateRequestId]);

  // Update a system setting
  const updateSetting = useCallback(async (id: string, value: any, reason?: string) => {
    try {
      // First check if the setting is protected
      const setting = settings.find(s => s.id === id);
      if (!setting) throw new Error('Setting not found');
      
      let changeReasonRequired = false;
      
      if (setting.is_protected) {
        changeReasonRequired = true;
        if (!reason) {
          throw new Error('Change reason is required for protected settings');
        }
      }
      
      // Update the setting
      const { data: updatedSetting, error } = await supabase
        .from('system_settings')
        .update({ 
          value, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // If change reason is provided or required, log it to the audit log
      if (reason || changeReasonRequired) {
        const { error: auditError } = await supabase
          .from('system_settings_audit_log')
          .insert({
            setting_key: setting.key,
            old_value: setting.value,
            new_value: value,
            change_reason: reason
          });
          
        if (auditError) {
          console.error('Error logging setting change:', auditError);
        }
      }
      
      // Update local state
      if (isMountedRef.current) {
        setSettings(prev => prev.map(s => s.id === id ? updatedSetting as SystemSetting : s));
      }
      
      toast({
        title: 'Success',
        description: 'Setting updated successfully',
      });
      
      return updatedSetting as SystemSetting;
    } catch (err) {
      console.error('Error updating system setting:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update setting',
        variant: 'destructive'
      });
      throw err;
    }
  }, [settings, toast]);

  // Getter functions - memoized to be stable across renders
  const getSettingByKey = useCallback((key: string): SystemSetting | undefined => {
    return settings.find(s => s.key === key);
  }, [settings]);

  const getSettingValue = useCallback((key: string): any | null => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : null;
  }, [settings]);

  // Initial fetch effect - stabilized with proper dependencies
  useEffect(() => {
    if (initialFetch && !loadingRef.current && isMountedRef.current) {
      fetchSettings();
    }
  }, [initialFetch, fetchSettings]);

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSetting,
    getSettingByKey,
    getSettingValue,
  };
};
