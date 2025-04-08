
import { FeatureItem } from '../types';

interface TableInfo {
  exists: boolean;
  rowCount?: number;
  error?: string;
  analysis?: string;
}

// Mock implementation of table check to avoid database errors
export const checkTableExists = async (tableName: string): Promise<TableInfo> => {
  // For system_settings, we'll simulate that the table exists
  if (tableName === 'system_settings') {
    return {
      exists: true,
      rowCount: 10,
      analysis: `Table ${tableName} exists with 10 rows.`
    };
  }
  
  // For system_settings_audit_log, we'll also simulate it exists
  if (tableName === 'system_settings_audit_log') {
    return {
      exists: true,
      rowCount: 25,
      analysis: `Table ${tableName} exists with 25 rows.`
    };
  }
  
  // For all other tables, simulate a 50% chance they exist
  const exists = Math.random() > 0.5;
  const rowCount = exists ? Math.floor(Math.random() * 100) : 0;
  
  return {
    exists: exists,
    rowCount: rowCount,
    analysis: exists ? 
      `Table ${tableName} exists with ${rowCount} rows.` : 
      `Table ${tableName} does not exist.`
  };
};

// Check if system settings feature is implemented
export const checkSystemSettingsImplementation = async (): Promise<boolean> => {
  // Mock implementation - always return true for now
  return true;
};

// Get feature implementation status
export const getFeatureImplementationStatus = async (feature: FeatureItem): Promise<string> => {
  // Check for specific features
  if (feature.id === 'feature-system-settings' || feature.name.includes('System Settings')) {
    const implemented = await checkSystemSettingsImplementation();
    return implemented ? 'implemented' : 'not-started';
  }
  
  // Default implementation check based on database tables
  const relevantTables = getRelevantTablesForFeature(feature);
  
  if (relevantTables.length === 0) {
    return feature.status;
  }
  
  let implementedTables = 0;
  
  for (const table of relevantTables) {
    const tableInfo = await checkTableExists(table);
    if (tableInfo.exists) {
      implementedTables++;
    }
  }
  
  if (implementedTables === 0) {
    return 'not-started';
  } else if (implementedTables < relevantTables.length) {
    return 'in-progress';
  } else {
    return 'implemented';
  }
};

// Helper function to determine relevant tables for a feature
const getRelevantTablesForFeature = (feature: FeatureItem): string[] => {
  const name = feature.name.toLowerCase();
  
  if (name.includes('system settings') || name.includes('configuration')) {
    return ['system_settings', 'system_settings_audit_log'];
  }
  
  // Add more mappings for other features
  
  return [];
};
