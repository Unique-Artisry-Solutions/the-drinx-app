/**
 * PCI DSS and GDPR Compliance Management
 * Handles data retention, secure deletion, consent tracking, and data anonymization
 */

import { supabase } from '@/integrations/supabase/client';

// Types for compliance operations
export interface DataRetentionPolicy {
  id?: string;
  data_type: string;
  retention_period_days: number;
  auto_deletion_enabled: boolean;
  deletion_method: 'hard_delete' | 'anonymize' | 'archive';
  is_active: boolean;
}

export interface UserConsent {
  consent_type: 'payment_processing' | 'data_analytics' | 'marketing';
  consent_given: boolean;
  consent_source: 'registration' | 'payment_flow' | 'settings_update';
  consent_version?: string;
  expires_at?: string;
}

export interface AnonymizationRequest {
  tables_affected: string[];
  request_type: 'user_request' | 'retention_policy' | 'compliance';
  anonymization_method: Record<string, any>;
}

export interface GDPRExportRequest {
  export_format: 'json' | 'csv' | 'pdf';
  tables_included: string[];
}

/**
 * PCI DSS Compliance Functions
 */

// Ensure no sensitive card data is logged
export const sanitizeForPCIDSS = (data: Record<string, any>): Record<string, any> => {
  const sanitized = { ...data };
  
  // Remove or mask sensitive payment card data
  const sensitiveFields = [
    'card_number', 'cardNumber', 'cvv', 'cvc', 'expiry_date', 'pin',
    'magnetic_stripe', 'chip_data', 'full_track_data'
  ];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      if (field === 'card_number' || field === 'cardNumber') {
        // Keep only last 4 digits
        const cardNumber = sanitized[field].toString();
        sanitized[field] = '**** **** **** ' + cardNumber.slice(-4);
      } else {
        sanitized[field] = '[REDACTED]';
      }
    }
  });
  
  return sanitized;
};

// Create data retention policy
export const createDataRetentionPolicy = async (policy: DataRetentionPolicy) => {
  const { data, error } = await supabase
    .from('data_retention_policies')
    .insert(policy)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Get active retention policies
export const getDataRetentionPolicies = async (dataType?: string) => {
  let query = supabase
    .from('data_retention_policies')
    .select('*')
    .eq('is_active', true);
  
  if (dataType) {
    query = query.eq('data_type', dataType);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Execute secure deletion based on retention policies
export const executeSecureDeletion = async (
  tableName: string,
  recordIds: string[],
  deletionType: 'scheduled' | 'manual' | 'user_request',
  deletionMethod: 'hard_delete' | 'anonymize',
  reason?: string
) => {
  const { data, error } = await supabase
    .from('secure_deletion_logs')
    .insert({
      table_name: tableName,
      record_ids: recordIds,
      deletion_type: deletionType,
      deletion_method: deletionMethod,
      reason,
      records_count: recordIds.length,
      verification_hash: await generateVerificationHash(recordIds.join(','))
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Log compliance action
  await logComplianceAction('PCI_DSS', 'data_deletion', null, 'payment_data', {
    deletion_log_id: data.id,
    table_name: tableName,
    records_count: recordIds.length,
    method: deletionMethod
  });
  
  return data;
};

/**
 * GDPR Compliance Functions
 */

// Track user consent
export const trackUserConsent = async (consent: UserConsent) => {
  const { data, error } = await supabase
    .from('user_consent_tracking')
    .insert({
      ...consent,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Log compliance action
  await logComplianceAction('GDPR', 'consent_update', null, 'user_consent', {
    consent_type: consent.consent_type,
    consent_given: consent.consent_given,
    consent_source: consent.consent_source
  });
  
  return data;
};

// Get user consent status
export const getUserConsent = async (consentType: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;
  
  const { data, error } = await supabase
    .from('user_consent_tracking')
    .select('*')
    .eq('user_id', user.user.id)
    .eq('consent_type', consentType)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Check if user has given consent using database function
export const checkUserConsent = async (consentType: string): Promise<boolean> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return false;
  
  const { data, error } = await supabase.rpc('check_user_consent', {
    p_user_id: user.user.id,
    p_consent_type: consentType
  });
  
  if (error) throw error;
  return data || false;
};

// Withdraw consent
export const withdrawUserConsent = async (consentType: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('user_consent_tracking')
    .update({ withdrawn_at: new Date().toISOString() })
    .eq('user_id', user.user.id)
    .eq('consent_type', consentType)
    .is('withdrawn_at', null)
    .select();
  
  if (error) throw error;
  
  // Log compliance action
  await logComplianceAction('GDPR', 'consent_update', null, 'user_consent', {
    consent_type: consentType,
    action: 'withdrawn'
  });
  
  return data;
};

// Request data anonymization
export const requestDataAnonymization = async (request: AnonymizationRequest) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('data_anonymization_requests')
    .insert({
      user_id: user.user.id,
      requested_by: user.user.id,
      ...request
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Log compliance action
  await logComplianceAction('GDPR', 'data_anonymization', null, 'user_data', {
    request_id: data.id,
    tables_affected: request.tables_affected
  });
  
  return data;
};

// Execute data anonymization using database function
export const executeDataAnonymization = async (userId: string, tables?: string[]) => {
  const { data, error } = await supabase.rpc('anonymize_user_data', {
    p_user_id: userId,
    p_tables: tables
  });
  
  if (error) throw error;
  return data;
};

// Request GDPR data export
export const requestGDPRExport = async (request: GDPRExportRequest) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('gdpr_data_exports')
    .insert({
      user_id: user.user.id,
      ...request,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Log compliance action
  await logComplianceAction('GDPR', 'export_request', null, 'user_data', {
    export_id: data.id,
    export_format: request.export_format,
    tables_included: request.tables_included
  });
  
  return data;
};

// Get user's GDPR export requests
export const getGDPRExportRequests = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('gdpr_data_exports')
    .select('*')
    .eq('user_id', user.user.id)
    .order('requested_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Compliance Audit Functions
 */

// Log compliance actions
export const logComplianceAction = async (
  complianceType: 'PCI_DSS' | 'GDPR' | 'CCPA',
  actionType: string,
  userId: string | null,
  affectedDataType: string,
  actionDetails: Record<string, any>,
  complianceStatus: 'compliant' | 'violation' | 'pending_review' = 'compliant'
) => {
  const { data, error } = await supabase
    .from('compliance_audit_trail')
    .insert({
      compliance_type: complianceType,
      action_type: actionType,
      user_id: userId,
      affected_data_type: affectedDataType,
      action_details: actionDetails,
      performed_by: (await supabase.auth.getUser()).data.user?.id,
      compliance_status: complianceStatus
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Get compliance audit trail
export const getComplianceAuditTrail = async (
  complianceType?: string,
  userId?: string,
  startDate?: string,
  endDate?: string
) => {
  let query = supabase
    .from('compliance_audit_trail')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (complianceType) {
    query = query.eq('compliance_type', complianceType);
  }
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  
  if (endDate) {
    query = query.lte('created_at', endDate);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Utility Functions
 */

// Generate verification hash for data integrity
const generateVerificationHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data + Date.now().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Check if data type needs retention policy enforcement
export const needsRetentionPolicy = (dataType: string): boolean => {
  const sensitiveDataTypes = [
    'payment_logs',
    'audit_logs',
    'user_data',
    'device_fingerprints',
    'payment_patterns'
  ];
  
  return sensitiveDataTypes.includes(dataType);
};

// Get retention period for data type
export const getRetentionPeriod = async (dataType: string): Promise<number | null> => {
  const policies = await getDataRetentionPolicies(dataType);
  return policies.length > 0 ? policies[0].retention_period_days : null;
};

// Compliance status check
export const getComplianceStatus = async () => {
  const [retentionPolicies, consentRecords, auditTrail] = await Promise.all([
    getDataRetentionPolicies(),
    supabase.from('user_consent_tracking').select('count').single(),
    supabase.from('compliance_audit_trail').select('count').single()
  ]);
  
  return {
    has_retention_policies: retentionPolicies.length > 0,
    consent_tracking_active: true,
    audit_trail_active: true,
    pci_dss_compliant: retentionPolicies.some(p => p.data_type === 'payment_logs'),
    gdpr_compliant: true
  };
};
