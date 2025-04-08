
import { supabase } from '@/lib/supabase';
import { FeatureItem } from '../types';

interface TableInfo {
  exists: boolean;
  rowCount?: number;
  error?: string;
  analysis?: string;
}

// Check if a table exists and get row count
export const checkTableExists = async (tableName: string): Promise<TableInfo> => {
  try {
    // First check if the table exists in the database schema
    const { data: schemas, error: schemaError } = await supabase
      .rpc('check_table_exists', { table_name: tableName });
    
    if (schemaError || !schemas) {
      // If the RPC call fails, try a different approach
      try {
        // Try to query the table directly
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
        
        // If there's no error, the table exists
        if (!error) {
          // Try to get row count
          const { count, error: countError } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (!countError) {
            return {
              exists: true,
              rowCount: count || 0,
              analysis: `Table ${tableName} exists with ${count} rows.`
            };
          } else {
            return {
              exists: true,
              analysis: `Table ${tableName} exists but couldn't count rows.`
            };
          }
        } else {
          return {
            exists: false,
            error: error.message,
            analysis: `Table ${tableName} does not exist.`
          };
        }
      } catch (err) {
        return {
          exists: false,
          error: 'Error checking table',
          analysis: `Failed to check if ${tableName} exists.`
        };
      }
    }
    
    const tableExists = schemas.length > 0;
    
    if (tableExists) {
      // Try to get row count if table exists
      try {
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (!countError) {
          return {
            exists: true,
            rowCount: count || 0,
            analysis: `Table ${tableName} exists with ${count} rows.`
          };
        } else {
          return {
            exists: true,
            analysis: `Table ${tableName} exists but couldn't count rows.`
          };
        }
      } catch (err) {
        return {
          exists: true,
          analysis: `Table ${tableName} exists but couldn't count rows.`
        };
      }
    }
    
    return {
      exists: tableExists,
      analysis: tableExists ? `Table ${tableName} exists.` : `Table ${tableName} does not exist.`
    };
  } catch (error) {
    console.error(`Error checking table ${tableName}:`, error);
    return {
      exists: false,
      error: 'Error checking table',
      analysis: `Failed to check if ${tableName} exists due to an error.`
    };
  }
};

// Check if system settings feature is implemented
export const checkSystemSettingsImplementation = async (): Promise<boolean> => {
  try {
    // Try querying the system_settings table
    const { data, error } = await supabase.rpc('check_table_exists', { table_name: 'system_settings' });
    
    if (!error && data && data.length > 0) {
      return true;
    }
    
    // Try an alternative approach
    try {
      const { count } = await supabase
        .from('system_settings')
        .select('*', { count: 'exact', head: true });
      
      return count !== null;
    } catch (e) {
      return false;
    }
  } catch (error) {
    console.error('Error checking system settings implementation:', error);
    return false;
  }
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
