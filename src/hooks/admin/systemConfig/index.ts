
import { useState, useEffect, useCallback } from 'react';
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
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);

  const {
    settings,
    isLoading: settingsLoading,
    error: settingsError,
    fetchSettings,
    updateSetting,
    getSettingByKey,
    getSettingValue
  } = useSystemSettings({ category, initialFetch: false });

  const {
    auditLogs,
    isLoading: auditLogsLoading,
    fetchAuditLogs
  } = useAuditLogs();

  const {
    emailTemplates,
    fetchEmailTemplates,
    updateEmailTemplate,
    createEmailTemplate,
    deleteEmailTemplate,
    previewEmailTemplate
  } = useEmailTemplates();

  const {
    apiKeys,
    fetchApiKeyConfigurations,
    updateApiKeyConfiguration,
    createApiKeyConfiguration,
    deleteApiKeyConfiguration,
    verifyApiKey
  } = useApiKeyConfig();

  const {
    paymentGateways,
    fetchPaymentGateways,
    updatePaymentGateway,
    createPaymentGateway,
    deletePaymentGateway,
    toggleTestMode
  } = usePaymentGateways();

  const {
    featureToggles,
    fetchFeatureToggles,
    updateFeatureToggle,
    createFeatureToggle,
    deleteFeatureToggle
  } = useFeatureToggles();

  // Setup realtime updates
  useRealtimeUpdates({
    onSettingsChange: fetchSettings,
    onAuditLogChange: fetchAuditLogs
  });

  // Fetch all configuration data
  const fetchAllConfigData = useCallback(async () => {
    if (isLoading) return; // Prevent concurrent fetches
    
    setIsLoading(true);
    setHasAttemptedFetch(true);
    
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
      setError('Some configuration data could not be loaded. Please refresh the page or try again later.');
      toast({
        title: 'Warning',
        description: 'Some configuration data could not be loaded. The page will continue to function with available data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchSettings, fetchEmailTemplates, fetchApiKeyConfigurations, fetchPaymentGateways, fetchFeatureToggles, fetchAuditLogs, toast, isLoading]);

  // Initial fetch only on component mount, not on every render
  useEffect(() => {
    if (initialFetch && !hasAttemptedFetch) {
      // Only fetch settings initially (others will be fetched on demand)
      fetchSettings();
    }
  }, [initialFetch, fetchSettings, hasAttemptedFetch]);

  // Update global error state when individual errors occur
  useEffect(() => {
    if (settingsError) {
      setError(settingsError);
    }
  }, [settingsError]);

  // Update global loading state when individual loadings change
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
    hasAttemptedFetch,
    
    // Setting operations
    fetchSettings,
    updateSetting,
    getSettingByKey,
    getSettingValue,
    
    // Email template operations
    fetchEmailTemplates,
    updateEmailTemplate,
    createEmailTemplate,
    deleteEmailTemplate,
    previewEmailTemplate,
    
    // API key operations
    fetchApiKeyConfigurations,
    updateApiKeyConfiguration,
    createApiKeyConfiguration,
    deleteApiKeyConfiguration,
    verifyApiKey,
    
    // Payment gateway operations
    fetchPaymentGateways,
    updatePaymentGateway,
    createPaymentGateway,
    deletePaymentGateway,
    toggleTestMode,
    
    // Feature toggle operations
    fetchFeatureToggles,
    updateFeatureToggle,
    createFeatureToggle,
    deleteFeatureToggle,
    
    // Audit log operations
    fetchAuditLogs,
    
    // Convenience methods
    fetchAllConfigData
  };
};

// Re-export individual hooks for direct usage
export {
  useSystemSettings,
  useAuditLogs,
  useEmailTemplates,
  useApiKeyConfig,
  usePaymentGateways,
  useFeatureToggles,
  useRealtimeUpdates
};
