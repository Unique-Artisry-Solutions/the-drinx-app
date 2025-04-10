
import { useState, useEffect } from 'react';
import { useSystemSettings } from './useSystemSettings';
import { useAuditLogs } from './useAuditLogs';
import { useEmailTemplates } from './useEmailTemplates';
import { useApiKeyConfig } from './useApiKeyConfig';
import { usePaymentGateways } from './usePaymentGateways';
import { useFeatureToggles } from './useFeatureToggles';
import { useRealtimeUpdates } from './useRealtimeUpdates';
import { useToast } from '@/hooks/use-toast';

interface UseSystemConfigurationOptions {
  category?: string;
  initialFetch?: boolean;
}

export const useSystemConfiguration = (options: UseSystemConfigurationOptions = {}) => {
  const { category, initialFetch = true } = options;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    settings,
    isLoading: settingsLoading,
    error: settingsError,
    fetchSettings,
    updateSetting,
    getSettingByKey,
    getSettingValue
  } = useSystemSettings({ category, initialFetch });

  const {
    auditLogs,
    isLoading: auditLogsLoading,
    fetchAuditLogs
  } = useAuditLogs();

  const {
    emailTemplates,
    fetchEmailTemplates,
    updateEmailTemplate
  } = useEmailTemplates();

  const {
    apiKeys,
    fetchApiKeyConfigurations,
    updateApiKeyConfiguration
  } = useApiKeyConfig();

  const {
    paymentGateways,
    fetchPaymentGateways,
    updatePaymentGateway
  } = usePaymentGateways();

  const {
    featureToggles,
    fetchFeatureToggles,
    updateFeatureToggle
  } = useFeatureToggles();

  // Setup realtime updates
  useRealtimeUpdates({
    onSettingsChange: fetchSettings,
    onAuditLogChange: fetchAuditLogs
  });

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

  // Initial fetch
  useEffect(() => {
    if (initialFetch) {
      fetchSettings();
    }
  }, [category, initialFetch]);

  useEffect(() => {
    if (settingsError) {
      setError(settingsError);
    }
  }, [settingsError]);

  useEffect(() => {
    setIsLoading(settingsLoading || auditLogsLoading);
  }, [settingsLoading, auditLogsLoading]);

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
