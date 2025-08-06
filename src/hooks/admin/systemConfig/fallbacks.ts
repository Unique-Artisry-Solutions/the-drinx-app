/**
 * Fallback implementations for system configuration hooks
 * to ensure graceful degradation when dependencies are missing
 */

export const createFallbackSystemSettings = () => ({
  settings: [],
  isLoading: false,
  error: null,
  fetchSettings: async () => console.warn('System settings hook not available'),
  updateSetting: async () => console.warn('System settings hook not available'),
  getSettingByKey: () => undefined,
  getSettingValue: () => null,
});

export const createFallbackAuditLogs = () => ({
  auditLogs: [],
  isLoading: false,
  error: null,
  fetchAuditLogs: async () => console.warn('Audit logs hook not available'),
});

export const createFallbackEmailTemplates = () => ({
  emailTemplates: [],
  fetchEmailTemplates: async () => console.warn('Email templates hook not available'),
  updateEmailTemplate: async () => null,
  createEmailTemplate: async () => null,
  deleteEmailTemplate: async () => false,
  previewEmailTemplate: async () => null,
});

export const createFallbackApiKeyConfig = () => ({
  apiKeys: [],
  fetchApiKeyConfigurations: async () => console.warn('API key config hook not available'),
  updateApiKeyConfiguration: async () => null,
  createApiKeyConfiguration: async () => null,
  deleteApiKeyConfiguration: async () => false,
  verifyApiKey: async () => false,
});

export const createFallbackPaymentGateways = () => ({
  paymentGateways: [],
  fetchPaymentGateways: async () => console.warn('Payment gateways hook not available'),
  updatePaymentGateway: async () => null,
  createPaymentGateway: async () => null,
  deletePaymentGateway: async () => false,
  toggleTestMode: async () => null,
});

export const createFallbackFeatureToggles = () => ({
  featureToggles: [],
  fetchFeatureToggles: async () => console.warn('Feature toggles hook not available'),
  updateFeatureToggle: async () => null,
  createFeatureToggle: async () => null,
  deleteFeatureToggle: async () => false,
});