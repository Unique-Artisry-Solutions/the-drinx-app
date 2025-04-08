
import { useState, useEffect } from 'react';
import { SystemSetting, SettingsUpdatePayload } from '@/types/SystemSettingsTypes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true })
        .order('key', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setSettings(data || []);
    } catch (err) {
      console.error('Error fetching system settings:', err);
      setError('Failed to load system settings');
      toast({
        title: 'Error',
        description: 'Failed to load system settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (payload: SettingsUpdatePayload) => {
    try {
      const { key, value, change_reason } = payload;
      
      // Get the current user ID
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      // Get the setting to check if it's protected
      const { data: settingData } = await supabase
        .from('system_settings')
        .select('is_protected')
        .eq('key', key)
        .single();
      
      // If protected and no change reason provided, show error
      if (settingData?.is_protected && !change_reason) {
        toast({
          title: 'Change reason required',
          description: 'Protected settings require a change reason',
          variant: 'destructive',
        });
        return false;
      }
      
      // Update the setting
      const { error: updateError } = await supabase
        .from('system_settings')
        .update({ 
          value, 
          updated_at: new Date().toISOString(),
          updated_by: userId 
        })
        .eq('key', key);
      
      if (updateError) {
        throw updateError;
      }
      
      // If it's a protected setting, add audit log entry with reason
      if (settingData?.is_protected && change_reason) {
        const { error: auditError } = await supabase
          .from('system_settings_audit_log')
          .insert({
            setting_key: key,
            new_value: value,
            changed_by: userId,
            change_reason
          });
        
        if (auditError) {
          console.error('Error logging setting change:', auditError);
        }
      }
      
      toast({
        title: 'Setting updated',
        description: `"${key}" has been successfully updated.`,
      });
      
      // Refresh settings list
      await fetchSettings();
      return true;
    } catch (err) {
      console.error('Error updating setting:', err);
      toast({
        title: 'Update failed',
        description: 'Failed to update system setting',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getSettingValue = (key: string, defaultValue: any = null) => {
    const setting = settings.find(s => s.key === key);
    if (!setting) return defaultValue;
    
    try {
      // For boolean values stored as strings
      if (setting.value === 'true') return true;
      if (setting.value === 'false') return false;
      
      // Try to parse JSON value
      return JSON.parse(setting.value);
    } catch (err) {
      // Return as is if not JSON
      return setting.value;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSetting,
    getSettingValue
  };
}
