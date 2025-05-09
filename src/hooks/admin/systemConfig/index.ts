
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const fetchInProgressRef = useRef<boolean>(false);

  // Use refs for tracking loading states to prevent infinite loops
  const loadingStatesRef = useRef<{
    settings: boolean;
    auditLogs: boolean;
  }>({
    settings: false,
    auditLogs: false
  });

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

  // Setup realtime updates with memoized callback
  const handleSettingsChange = useCallback(() => {
    if (!fetchInProgressRef.current) {
      fetchSettings();
    }
  }, [fetchSettings]);

  const handleAuditLogChange = useCallback(() => {
    if (!fetchInProgressRef.current) {
      fetchAuditLogs();
    }
  }, [fetchAuditLogs]);

  useRealtimeUpdates({
    onSettingsChange: handleSettingsChange,
    onAuditLogChange: handleAuditLogChange
  });

  // Track loading states via ref
  useEffect(() => {
    loadingStatesRef.current.settings = settingsLoading;
    updateLoadingState();
  }, [settingsLoading]);

  useEffect(() => {
    loadingStatesRef.current.auditLogs = auditLogsLoading;
    updateLoadingState();
  }, [auditLogsLoading]);

  // Update global loading state based on individual loading states
  const updateLoadingState = useCallback(() => {
    const anyLoading = Object.values(loadingStatesRef.current).some(Boolean);
    setIsLoading(anyLoading);
  }, []);

  // Update global error state when individual errors occur
  useEffect(() => {
    if (settingsError) {
      setError(settingsError);
    }
  }, [settingsError]);

  // Fetch all configuration data
  const fetchAllConfigData = useCallback(async () => {
    if (fetchInProgressRef.current) return; // Prevent concurrent fetches
    
    fetchInProgressRef.current = true;
    setIsLoading(true);
    setHasAttemptedFetch(true);
    
    try {
      // Fetch essential data first
      await fetchSettings();
      
      // Then fetch the rest in parallel
      await Promise.all([
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
      fetchInProgressRef.current = false;
      setIsLoading(false);
    }
  }, [
    fetchSettings, 
    fetchEmailTemplates, 
    fetchApiKeyConfigurations, 
    fetchPaymentGateways, 
    fetchFeatureToggles, 
    fetchAuditLogs, 
    toast
  ]);

  // Initial fetch only on component mount, not on every render
  useEffect(() => {
    if (initialFetch && !hasAttemptedFetch && !fetchInProgressRef.current) {
      // Only fetch settings initially (others will be fetched on demand)
      fetchSettings().finally(() => {
        setHasAttemptedFetch(true);
      });
    }
  }, [initialFetch, fetchSettings, hasAttemptedFetch]);

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
