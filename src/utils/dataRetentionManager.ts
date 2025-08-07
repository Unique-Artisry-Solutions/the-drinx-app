/**
 * Data Retention Manager
 * Handles automated data cleanup based on retention policies
 */

import { supabase } from '@/integrations/supabase/client';
import { sanitizeForPCIDSS, executeSecureDeletion, logComplianceAction } from './complianceManager';

interface RetentionJob {
  id: string;
  table_name: string;
  retention_days: number;
  deletion_method: 'hard_delete' | 'anonymize' | 'archive';
  last_run?: string;
}

/**
 * Check and execute data retention policies
 */
export const runRetentionCleanup = async (): Promise<void> => {
  try {
    // Get all active retention policies
    const { data: policies, error } = await supabase
      .from('data_retention_policies')
      .select('*')
      .eq('is_active', true)
      .eq('auto_deletion_enabled', true);

    if (error) throw error;

    for (const policy of policies) {
      await executeRetentionPolicy(policy);
    }

    console.log('Retention cleanup completed successfully');
  } catch (error) {
    console.error('Error running retention cleanup:', error);
    throw error;
  }
};

/**
 * Execute a specific retention policy
 */
const executeRetentionPolicy = async (policy: any): Promise<void> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - policy.retention_period_days);
  
  let recordsToDelete: string[] = [];
  
  // Get records that exceed retention period based on data type
  switch (policy.data_type) {
    case 'payment_logs':
      recordsToDelete = await getExpiredRecords('payment_audit_logs', cutoffDate);
      break;
    case 'audit_logs':
      recordsToDelete = await getExpiredRecords('security_audit_logs', cutoffDate);
      break;
    case 'user_data':
      recordsToDelete = await getExpiredUserData(cutoffDate);
      break;
    case 'device_fingerprints':
      recordsToDelete = await getExpiredRecords('device_fingerprints', cutoffDate);
      break;
    case 'payment_patterns':
      recordsToDelete = await getExpiredRecords('payment_patterns', cutoffDate);
      break;
    default:
      console.warn(`Unknown data type for retention: ${policy.data_type}`);
      return;
  }

  if (recordsToDelete.length > 0) {
    if (policy.deletion_method === 'anonymize') {
      await anonymizeExpiredRecords(policy.data_type, recordsToDelete);
    } else if (policy.deletion_method === 'hard_delete') {
      await hardDeleteExpiredRecords(policy.data_type, recordsToDelete);
    } else if (policy.deletion_method === 'archive') {
      await archiveExpiredRecords(policy.data_type, recordsToDelete);
    }

    // Log the retention action
    await executeSecureDeletion(
      getTableName(policy.data_type),
      recordsToDelete,
      'scheduled',
      policy.deletion_method,
      `Retention policy: ${policy.retention_period_days} days`
    );

    // Update last cleanup timestamp
    await supabase
      .from('data_retention_policies')
      .update({ last_cleanup_at: new Date().toISOString() })
      .eq('id', policy.id);
  }
};

/**
 * Get expired records for a specific table
 */
const getExpiredRecords = async (tableName: string, cutoffDate: Date): Promise<string[]> => {
  try {
    // Use direct table names that exist in the database
    if (tableName === 'payment_audit_logs') {
      const { data, error } = await supabase
        .from('payment_audit_logs')
        .select('id')
        .lt('created_at', cutoffDate.toISOString());
      if (error) throw error;
      return data?.map(record => record.id) || [];
    } else if (tableName === 'device_fingerprints') {
      const { data, error } = await supabase
        .from('device_fingerprints')
        .select('id')
        .lt('created_at', cutoffDate.toISOString());
      if (error) throw error;
      return data?.map(record => record.id) || [];
    } else if (tableName === 'payment_patterns') {
      const { data, error } = await supabase
        .from('payment_patterns')
        .select('id')
        .lt('created_at', cutoffDate.toISOString());
      if (error) throw error;
      return data?.map(record => record.id) || [];
    }
    return [];
  } catch (error) {
    console.error(`Error getting expired records from ${tableName}:`, error);
    return [];
  }
};

/**
 * Get expired user data that should be anonymized/deleted
 */
const getExpiredUserData = async (cutoffDate: Date): Promise<string[]> => {
  // This would typically check for inactive users or users who have requested deletion
  const { data, error } = await supabase
    .from('data_anonymization_requests')
    .select('user_id')
    .eq('status', 'pending')
    .lt('created_at', cutoffDate.toISOString());

  if (error) throw error;
  return data.map(record => record.user_id);
};

/**
 * Anonymize expired records
 */
const anonymizeExpiredRecords = async (dataType: string, recordIds: string[]): Promise<void> => {
  const tableName = getTableName(dataType);
  
  switch (dataType) {
    case 'payment_logs':
      await supabase
        .from('payment_audit_logs')
        .update({
          user_id: null,
          ip_address: null,
          user_agent: 'ANONYMIZED'
        })
        .in('id', recordIds);
      break;
      
    case 'device_fingerprints':
      await supabase
        .from('device_fingerprints')
        .update({
          user_id: null,
          device_data: { anonymized: true },
          fingerprint_hash: 'ANONYMIZED_' + Date.now()
        })
        .in('id', recordIds);
      break;
      
    case 'payment_patterns':
      await supabase
        .from('payment_patterns')
        .update({
          user_id: null,
          pattern_data: { anonymized: true }
        })
        .in('id', recordIds);
      break;
  }

  await logComplianceAction(
    'PCI_DSS',
    'data_anonymization',
    null,
    dataType,
    {
      method: 'retention_policy',
      records_anonymized: recordIds.length,
      table_name: tableName
    }
  );
};

/**
 * Hard delete expired records
 */
const hardDeleteExpiredRecords = async (dataType: string, recordIds: string[]): Promise<void> => {
  const tableName = getTableName(dataType);
  
  // Use specific table calls based on data type
  switch (dataType) {
    case 'payment_logs':
      const { error: paymentError } = await supabase
        .from('payment_audit_logs')
        .delete()
        .in('id', recordIds);
      if (paymentError) throw paymentError;
      break;
      
    case 'device_fingerprints':
      const { error: deviceError } = await supabase
        .from('device_fingerprints')
        .delete()
        .in('id', recordIds);
      if (deviceError) throw deviceError;
      break;
      
    case 'payment_patterns':
      const { error: patternError } = await supabase
        .from('payment_patterns')
        .delete()
        .in('id', recordIds);
      if (patternError) throw patternError;
      break;
      
    default:
      console.warn(`Unsupported data type for hard deletion: ${dataType}`);
      return;
  }

  await logComplianceAction(
    'PCI_DSS',
    'data_deletion',
    null,
    dataType,
    {
      method: 'retention_policy',
      records_deleted: recordIds.length,
      table_name: tableName
    }
  );
};

/**
 * Archive expired records
 */
const archiveExpiredRecords = async (dataType: string, recordIds: string[]): Promise<void> => {
  const tableName = getTableName(dataType);
  
  // Use specific table calls based on data type
  switch (dataType) {
    case 'payment_logs':
      // For payment_audit_logs, we'll mark as archived by updating user_agent field
      const { error: paymentError } = await supabase
        .from('payment_audit_logs')
        .update({ 
          user_agent: 'ARCHIVED_' + new Date().toISOString()
        })
        .in('id', recordIds);
      if (paymentError) throw paymentError;
      break;
      
    case 'device_fingerprints':
      const { error: deviceError } = await supabase
        .from('device_fingerprints')
        .update({ 
          device_data: { archived: true, archived_at: new Date().toISOString() }
        })
        .in('id', recordIds);
      if (deviceError) throw deviceError;
      break;
      
    case 'payment_patterns':
      const { error: patternError } = await supabase
        .from('payment_patterns')
        .update({ 
          pattern_data: { archived: true, archived_at: new Date().toISOString() }
        })
        .in('id', recordIds);
      if (patternError) throw patternError;
      break;
      
    default:
      console.warn(`Unsupported data type for archiving: ${dataType}`);
      return;
  }

  await logComplianceAction(
    'PCI_DSS',
    'data_archival',
    null,
    dataType,
    {
      method: 'retention_policy',
      records_archived: recordIds.length,
      table_name: tableName
    }
  );
};

/**
 * Get table name from data type
 */
const getTableName = (dataType: string): string => {
  const tableMap: Record<string, string> = {
    'payment_logs': 'payment_audit_logs',
    'audit_logs': 'security_audit_logs',
    'user_data': 'profiles',
    'device_fingerprints': 'device_fingerprints',
    'payment_patterns': 'payment_patterns'
  };
  
  return tableMap[dataType] || dataType;
};

/**
 * Create default retention policies
 */
export const createDefaultRetentionPolicies = async (): Promise<void> => {
  const defaultPolicies = [
    {
      data_type: 'payment_logs',
      retention_period_days: 2555, // 7 years for PCI DSS compliance
      auto_deletion_enabled: true,
      deletion_method: 'anonymize' as const,
      is_active: true
    },
    {
      data_type: 'audit_logs',
      retention_period_days: 1095, // 3 years
      auto_deletion_enabled: true,
      deletion_method: 'archive' as const,
      is_active: true
    },
    {
      data_type: 'device_fingerprints',
      retention_period_days: 365, // 1 year
      auto_deletion_enabled: true,
      deletion_method: 'anonymize' as const,
      is_active: true
    },
    {
      data_type: 'payment_patterns',
      retention_period_days: 730, // 2 years
      auto_deletion_enabled: true,
      deletion_method: 'anonymize' as const,
      is_active: true
    }
  ];

  for (const policy of defaultPolicies) {
    const { error } = await supabase
      .from('data_retention_policies')
      .upsert(policy);
    
    if (error) throw error;
  }

  console.log('Default retention policies created');
};

/**
 * Validate retention policy before creation
 */
export const validateRetentionPolicy = (policy: any): string[] => {
  const errors: string[] = [];
  
  if (!policy.data_type) {
    errors.push('Data type is required');
  }
  
  if (!policy.retention_period_days || policy.retention_period_days < 1) {
    errors.push('Retention period must be at least 1 day');
  }
  
  if (policy.data_type === 'payment_logs' && policy.retention_period_days < 2555) {
    errors.push('Payment logs must be retained for at least 7 years for PCI DSS compliance');
  }
  
  if (!['hard_delete', 'anonymize', 'archive'].includes(policy.deletion_method)) {
    errors.push('Invalid deletion method');
  }
  
  return errors;
};

/**
 * Get retention policy statistics
 */
export const getRetentionStats = async () => {
  const { data: policies, error: policiesError } = await supabase
    .from('data_retention_policies')
    .select('*');
    
  const { data: deletionLogs, error: logsError } = await supabase
    .from('secure_deletion_logs')
    .select('*')
    .gte('executed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

  if (policiesError || logsError) {
    throw policiesError || logsError;
  }

  return {
    total_policies: policies.length,
    active_policies: policies.filter(p => p.is_active).length,
    recent_deletions: deletionLogs.length,
    total_records_processed: deletionLogs.reduce((sum, log) => sum + log.records_count, 0)
  };
};