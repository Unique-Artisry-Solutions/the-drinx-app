import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  SystemSetting, 
  SystemSettingAuditLog, 
  SystemEmailTemplate, 
  ApiKeyConfiguration, 
  PaymentGatewayConfig, 
  FeatureToggle 
} from '@/types/SupabaseTables';

interface UseSystemConfigurationOptions {
  category?: string;
  initialFetch?: boolean;
}

export const useSystemConfiguration = (options: UseSystemConfigurationOptions = {}) => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<SystemEmailTemplate[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyConfiguration[]>([]);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>([]);
  const [featureToggles, setFeatureToggles] = useState<FeatureToggle[]>([]);
  const [auditLogs, setAuditLogs] = useState<SystemSettingAuditLog[]>([]);
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

  // Fetch email templates (placeholder - implementation would depend on actual table structure)
  const fetchEmailTemplates = async () => {
    setIsLoading(true);
    console.log('Fetching email templates...');
    // In a real implementation, this would query a system_email_templates table
    setEmailTemplates([]);
    setIsLoading(false);
  };

  // Update an email template (placeholder)
  const updateEmailTemplate = async (id: string, updates: Partial<SystemEmailTemplate>) => {
    console.log('Updating email template:', id, updates);
    // In a real implementation, this would update a record in the system_email_templates table
    return {} as SystemEmailTemplate;
  };

  // Fetch API key configurations (placeholder)
  const fetchApiKeyConfigurations = async () => {
    setIsLoading(true);
    console.log('Fetching API key configurations...');
    // In a real implementation, this would query an api_key_configurations table
    setApiKeys([]);
    setIsLoading(false);
  };

  // Update API key configuration (placeholder)
  const updateApiKeyConfiguration = async (id: string, updates: Partial<ApiKeyConfiguration>) => {
    console.log('Updating API key configuration:', id, updates);
    // In a real implementation, this would update a record in the api_key_configurations table
    return {} as ApiKeyConfiguration;
  };

  // Fetch payment gateway configurations (placeholder)
  const fetchPaymentGateways = async () => {
    setIsLoading(true);
    console.log('Fetching payment gateway configurations...');
    // In a real implementation, this would query a payment_gateway_configs table
    setPaymentGateways([]);
    setIsLoading(false);
  };

  // Update payment gateway configuration (placeholder)
  const updatePaymentGateway = async (id: string, updates: Partial<PaymentGatewayConfig>) => {
    console.log('Updating payment gateway configuration:', id, updates);
    // In a real implementation, this would update a record in the payment_gateway_configs table
    return {} as PaymentGatewayConfig;
  };

  // Fetch feature toggles (placeholder)
  const fetchFeatureToggles = async () => {
    setIsLoading(true);
    console.log('Fetching feature toggles...');
    // In a real implementation, this would query a feature_toggles table
    setFeatureToggles([]);
    setIsLoading(false);
  };

  // Update feature toggle (placeholder)
  const updateFeatureToggle = async (id: string, status: boolean) => {
    console.log('Updating feature toggle:', id, status);
    // In a real implementation, this would update a record in the feature_toggles table
    return {} as FeatureToggle;
  };

  // Fetch audit logs
  const fetchAuditLogs = async (limit = 50) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('system_settings_audit_log')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(limit);
        
      if (error) throw new Error(error.message);
      setAuditLogs(data as SystemSettingAuditLog[]);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      toast({
        title: 'Error',
        description: 'Failed to load audit logs',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all configuration data
  const fetchAllConfigData = async () => {
    setIsLoading(true);
    
    try {
      await fetchSettings();
      // These are placeholders and would be implemented as actual tables exist
      // await fetchEmailTemplates();
      // await fetchApiKeyConfigurations();
      // await fetchPaymentGateways();
      // await fetchFeatureToggles();
      await fetchAuditLogs();
    } catch (err) {
      console.error('Error fetching all configuration data:', err);
      toast({
        title: 'Error',
        description: 'Some configuration data could not be loaded',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
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

  // Initial fetch
  useEffect(() => {
    if (initialFetch) {
      fetchSettings();
    }
  }, [category, initialFetch]);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('system-config-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_settings',
      }, () => {
        fetchSettings();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_settings_audit_log',
      }, () => {
        fetchAuditLogs();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    // Data
    settings,
    emailTemplates,
    apiKeys,
    paymentGateways,
    featureToggles,
    auditLogs,
    isLoading,
    error,
    
    // Setting operations
    fetchSettings,
    updateSetting,
    getSettingByKey,
    getSettingValue,
    
    // Email template operations
    fetchEmailTemplates,
    updateEmailTemplate,
    
    // API key operations
    fetchApiKeyConfigurations,
    updateApiKeyConfiguration,
    
    // Payment gateway operations
    fetchPaymentGateways,
    updatePaymentGateway,
    
    // Feature toggle operations
    fetchFeatureToggles,
    updateFeatureToggle,
    
    // Audit log operations
    fetchAuditLogs,
    
    // Convenience methods
    fetchAllConfigData
  };
};
