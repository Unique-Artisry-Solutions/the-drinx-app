/**
 * GDPR Data Portability Manager
 * Handles user data export requests and data deletion
 */

import { supabase } from '@/integrations/supabase/client';
import { logComplianceAction } from './complianceManager';

export interface UserDataExport {
  profile: any;
  consent_records: any[];
  payment_history: any[];
  audit_logs: any[];
  device_fingerprints: any[];
  export_metadata: {
    export_date: string;
    export_format: string;
    user_id: string;
    tables_included: string[];
  };
}

/**
 * Export all user data for GDPR compliance
 */
export const exportUserData = async (
  userId: string, 
  format: 'json' | 'csv' | 'pdf' = 'json'
): Promise<UserDataExport> => {
  try {
    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') throw profileError;

    // Get user consent records
    const { data: consentRecords, error: consentError } = await supabase
      .from('user_consent_tracking')
      .select('*')
      .eq('user_id', userId);

    if (consentError) throw consentError;

    // Get payment history (anonymized)
    const { data: paymentHistory, error: paymentError } = await supabase
      .from('payment_audit_logs')
      .select('id, transaction_type, amount, currency, status, created_at')
      .eq('user_id', userId);

    if (paymentError) throw paymentError;

    // Get compliance audit logs for this user  
    const { data: auditLogs, error: auditError } = await supabase
      .from('compliance_audit_trail')
      .select('id, action_type, created_at, action_details')
      .eq('user_id', userId);

    if (auditError) throw auditError;

    // Get device fingerprints (anonymized)
    const { data: deviceFingerprints, error: deviceError } = await supabase
      .from('device_fingerprints')
      .select('id, risk_score, first_seen_at, last_seen_at, is_trusted')
      .eq('user_id', userId);

    if (deviceError) throw deviceError;

    const exportData: UserDataExport = {
      profile: profile || {},
      consent_records: consentRecords || [],
      payment_history: paymentHistory || [],
      audit_logs: auditLogs || [],
      device_fingerprints: deviceFingerprints || [],
      export_metadata: {
        export_date: new Date().toISOString(),
        export_format: format,
        user_id: userId,
        tables_included: ['profiles', 'user_consent_tracking', 'payment_audit_logs', 'security_audit_logs', 'device_fingerprints']
      }
    };

    // Log the export action
    await logComplianceAction(
      'GDPR',
      'data_export',
      userId,
      'user_data',
      {
        export_format: format,
        tables_included: exportData.export_metadata.tables_included,
        records_exported: {
          profile: profile ? 1 : 0,
          consent_records: consentRecords?.length || 0,
          payment_history: paymentHistory?.length || 0,
          audit_logs: auditLogs?.length || 0,
          device_fingerprints: deviceFingerprints?.length || 0
        }
      }
    );

    return exportData;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
};

/**
 * Convert user data to CSV format
 */
export const convertToCSV = (data: UserDataExport): string => {
  const csvSections: string[] = [];

  // Profile data
  if (data.profile && Object.keys(data.profile).length > 0) {
    csvSections.push('--- PROFILE DATA ---');
    csvSections.push(objectToCSV([data.profile]));
  }

  // Consent records
  if (data.consent_records.length > 0) {
    csvSections.push('\n--- CONSENT RECORDS ---');
    csvSections.push(objectToCSV(data.consent_records));
  }

  // Payment history
  if (data.payment_history.length > 0) {
    csvSections.push('\n--- PAYMENT HISTORY ---');
    csvSections.push(objectToCSV(data.payment_history));
  }

  // Audit logs
  if (data.audit_logs.length > 0) {
    csvSections.push('\n--- AUDIT LOGS ---');
    csvSections.push(objectToCSV(data.audit_logs));
  }

  // Device fingerprints
  if (data.device_fingerprints.length > 0) {
    csvSections.push('\n--- DEVICE FINGERPRINTS ---');
    csvSections.push(objectToCSV(data.device_fingerprints));
  }

  return csvSections.join('\n');
};

/**
 * Helper function to convert objects to CSV
 */
const objectToCSV = (objects: any[]): string => {
  if (objects.length === 0) return '';

  const headers = Object.keys(objects[0]);
  const csvRows = [headers.join(',')];

  for (const obj of objects) {
    const values = headers.map(header => {
      const value = obj[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return `"${value.toString().replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

/**
 * Delete all user data (right to be forgotten)
 */
export const deleteAllUserData = async (userId: string): Promise<void> => {
  try {
    const deletedRecords: Record<string, number> = {};

    // Delete from user_consent_tracking
    const { data: consentData, error: consentError } = await supabase
      .from('user_consent_tracking')
      .delete()
      .eq('user_id', userId)
      .select('id');
    
    if (consentError) throw consentError;
    deletedRecords.consent_records = consentData?.length || 0;

    // Anonymize payment audit logs instead of deleting (for compliance)
    const { data: paymentData, error: paymentError } = await supabase
      .from('payment_audit_logs')
      .update({
        user_id: null,
        ip_address: null,
        user_agent: 'USER_DELETED'
      })
      .eq('user_id', userId)
      .select('id');
    
    if (paymentError) throw paymentError;
    deletedRecords.payment_logs_anonymized = paymentData?.length || 0;

    // Delete security audit logs
    const { data: auditData, error: auditError } = await supabase
      .from('security_audit_logs')
      .delete()
      .eq('user_id', userId)
      .select('id');
    
    if (auditError) throw auditError;
    deletedRecords.audit_logs = auditData?.length || 0;

    // Anonymize device fingerprints
    const { data: deviceData, error: deviceError } = await supabase
      .from('device_fingerprints')
      .update({
        user_id: null,
        device_data: { deleted: true },
        fingerprint_hash: 'USER_DELETED_' + Date.now()
      })
      .eq('user_id', userId)
      .select('id');
    
    if (deviceError) throw deviceError;
    deletedRecords.device_fingerprints_anonymized = deviceData?.length || 0;

    // Delete anonymization requests
    const { data: anonymizationData, error: anonymizationError } = await supabase
      .from('data_anonymization_requests')
      .delete()
      .eq('user_id', userId)
      .select('id');
    
    if (anonymizationError) throw anonymizationError;
    deletedRecords.anonymization_requests = anonymizationData?.length || 0;

    // Delete GDPR export requests
    const { data: exportData, error: exportError } = await supabase
      .from('gdpr_data_exports')
      .delete()
      .eq('user_id', userId)
      .select('id');
    
    if (exportError) throw exportError;
    deletedRecords.export_requests = exportData?.length || 0;

    // Log the deletion action before deleting profile
    await logComplianceAction(
      'GDPR',
      'data_deletion',
      userId,
      'all_user_data',
      {
        deletion_type: 'right_to_be_forgotten',
        records_deleted: deletedRecords,
        deletion_date: new Date().toISOString()
      }
    );

    // Finally, delete the user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) throw profileError;

    console.log('User data deletion completed:', deletedRecords);
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
};

/**
 * Verify data deletion was complete
 */
export const verifyDataDeletion = async (userId: string): Promise<{ 
  is_complete: boolean; 
  remaining_data: Record<string, number> 
}> => {
  const remainingData: Record<string, number> = {};

  // Check profiles
  const { data: profileData } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId);
  remainingData.profiles = profileData?.length || 0;

  // Check consent tracking
  const { data: consentData } = await supabase
    .from('user_consent_tracking')
    .select('id')
    .eq('user_id', userId);
  remainingData.consent_records = consentData?.length || 0;

  // Check payment logs (should be anonymized, not deleted)
  const { data: paymentData } = await supabase
    .from('payment_audit_logs')
    .select('id')
    .eq('user_id', userId);
  remainingData.payment_logs_with_user_id = paymentData?.length || 0;

  // Check device fingerprints (should be anonymized)
  const { data: deviceData } = await supabase
    .from('device_fingerprints')
    .select('id')
    .eq('user_id', userId);
  remainingData.device_fingerprints_with_user_id = deviceData?.length || 0;

  // Check export requests
  const { data: exportData } = await supabase
    .from('gdpr_data_exports')
    .select('id')
    .eq('user_id', userId);
  remainingData.export_requests = exportData?.length || 0;

  const totalRemaining = Object.values(remainingData).reduce((sum, count) => sum + count, 0);
  
  return {
    is_complete: totalRemaining === 0,
    remaining_data: remainingData
  };
};

/**
 * Generate data processing report for transparency
 */
export const generateDataProcessingReport = async (userId: string) => {
  // Get all compliance actions for this user
  const { data: complianceActions, error } = await supabase
    .from('compliance_audit_trail')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Get current consent status
  const { data: currentConsent } = await supabase
    .from('user_consent_tracking')
    .select('*')
    .eq('user_id', userId)
    .is('withdrawn_at', null)
    .order('created_at', { ascending: false });

  return {
    user_id: userId,
    report_generated_at: new Date().toISOString(),
    current_consent_status: currentConsent || [],
    compliance_actions: complianceActions || [],
    data_processing_activities: {
      payment_processing: currentConsent?.some(c => c.consent_type === 'payment_processing' && c.consent_given),
      data_analytics: currentConsent?.some(c => c.consent_type === 'data_analytics' && c.consent_given),
      marketing: currentConsent?.some(c => c.consent_type === 'marketing' && c.consent_given)
    }
  };
};