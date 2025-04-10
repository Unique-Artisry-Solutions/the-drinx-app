
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
} from '@/types/DatabaseTypes';

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
      setSettings(data);
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
      setSettings(prev => prev.map(s => s.id === id ? updatedSetting : s));
      
      toast({
        title: 'Success',
        description: 'Setting updated successfully',
      });
      
      return updatedSetting;
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

  // Fetch email templates
  const fetchEmailTemplates = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('system_email_templates')
        .select('*')
        .order('name');
        
      if (error) throw new Error(error.message);
      setEmailTemplates(data);
    } catch (err) {
      console.error('Error fetching email templates:', err);
      toast({
        title: 'Error',
        description: 'Failed to load email templates',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an email template
  const updateEmailTemplate = async (id: string, updates: Partial<SystemEmailTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('system_email_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      setEmailTemplates(prev => prev.map(t => t.id === id ? data : t));
      
      toast({
        title: 'Success',
        description: 'Email template updated successfully',
      });
      
      return data;
    } catch (err) {
      console.error('Error updating email template:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update template',
        variant: 'destructive'
      });
      throw err;
    }
  };

  // Fetch API key configurations
  const fetchApiKeyConfigurations = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('api_key_configurations')
        .select('*')
        .order('service_name');
        
      if (error) throw new Error(error.message);
      setApiKeys(data);
    } catch (err) {
      console.error('Error fetching API key configurations:', err);
      toast({
        title: 'Error',
        description: 'Failed to load API configurations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update API key configuration
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
      
      setApiKeys(prev => prev.map(k => k.id === id ? data : k));
      
      toast({
        title: 'Success',
        description: 'API configuration updated successfully',
      });
      
      return data;
    } catch (err) {
      console.error('Error updating API configuration:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update API configuration',
        variant: 'destructive'
      });
      throw err;
    }
  };

  // Fetch payment gateway configurations
  const fetchPaymentGateways = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .select('*')
        .order('gateway_name');
        
      if (error) throw new Error(error.message);
      setPaymentGateways(data);
    } catch (err) {
      console.error('Error fetching payment gateway configurations:', err);
      toast({
        title: 'Error',
        description: 'Failed to load payment gateway configurations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update payment gateway configuration
  const updatePaymentGateway = async (id: string, updates: Partial<PaymentGatewayConfig>) => {
    try {
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      setPaymentGateways(prev => prev.map(g => g.id === id ? data : g));
      
      toast({
        title: 'Success',
        description: 'Payment gateway configuration updated successfully',
      });
      
      return data;
    } catch (err) {
      console.error('Error updating payment gateway configuration:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update payment configuration',
        variant: 'destructive'
      });
      throw err;
    }
  };

  // Fetch feature toggles
  const fetchFeatureToggles = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('feature_toggles')
        .select('*')
        .order('name');
        
      if (error) throw new Error(error.message);
      setFeatureToggles(data);
    } catch (err) {
      console.error('Error fetching feature toggles:', err);
      toast({
        title: 'Error',
        description: 'Failed to load feature toggles',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update feature toggle
  const updateFeatureToggle = async (id: string, status: boolean) => {
    try {
      const { data, error } = await supabase
        .from('feature_toggles')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      setFeatureToggles(prev => prev.map(f => f.id === id ? data : f));
      
      toast({
        title: 'Success',
        description: `Feature toggle ${status ? 'enabled' : 'disabled'} successfully`,
      });
      
      return data;
    } catch (err) {
      console.error('Error updating feature toggle:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update feature toggle',
        variant: 'destructive'
      });
      throw err;
    }
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
      setAuditLogs(data);
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
      await Promise.all([
        fetchSettings(),
        fetchEmailTemplates(),
        fetchApiKeyConfigurations(),
        fetchPaymentGateways(),
        fetchFeatureToggles(),
        fetchAuditLogs()
      ]);
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
        table: 'system_email_templates',
      }, () => {
        fetchEmailTemplates();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'api_key_configurations',
      }, () => {
        fetchApiKeyConfigurations();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payment_gateway_configs',
      }, () => {
        fetchPaymentGateways();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'feature_toggles',
      }, () => {
        fetchFeatureToggles();
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
