
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SystemSetting } from '@/types/SupabaseTables';

interface UseSystemSettingsOptions {
  category?: string;
  initialFetch?: boolean;
}

export const useSystemSettings = (options: UseSystemSettingsOptions = {}) => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { category, initialFetch = true } = options;

  // Fetch system settings
  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('system_settings')
        .select('*');
        
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('category', { ascending: true });
      
      if (error) throw new Error(error.message);
      setSettings(data as SystemSetting[]);
    } catch (err) {
      console.error('Error fetching system settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load system settings');
      toast({
        title: 'Error',
        description: 'Failed to load system settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update a system setting
  const updateSetting = async (id: string, value: any, reason?: string) => {
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
      setSettings(prev => prev.map(s => s.id === id ? updatedSetting as SystemSetting : s));
      
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
  };

  // Get a setting by key
  const getSettingByKey = (key: string): SystemSetting | undefined => {
    return settings.find(s => s.key === key);
  };

  // Get a setting value by key
  const getSettingValue = (key: string): any | null => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : null;
  };

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
