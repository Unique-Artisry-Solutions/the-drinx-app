
import { isTaskCompleted } from './taskDetection';
import { supabase } from '@/lib/supabase';

/**
 * Parse task statuses from a database analysis text
 */
export const parseTaskStatuses = (analysisText: string) => {
  if (!analysisText) return [];
  
  // Split by new lines and filter out empty lines
  const lines = analysisText.split('\n').filter(line => line.trim().length > 0);
  
  // Process each line as a potential task
  return lines.map(line => {
    const text = line.trim();
    const isCompleted = isTaskCompleted(text);
    
    return {
      text,
      isCompleted
    };
  });
};

/**
 * Analyze database requirements for a feature
 */
export const analyzeDbRequirements = async (feature: string) => {
  // This will eventually connect to the database to analyze schema and requirements
  // For now, we'll return dummy data
  
  const baseRequirements = [
    "✅ Create main table schema",
    "✅ Set up proper indexes",
    "✅ Configure RLS policies",
    "Implement audit logging",
    "Add validation triggers"
  ];
  
  // Add feature-specific requirements
  if (feature.toLowerCase().includes('system') && feature.toLowerCase().includes('settings')) {
    return [
      ...baseRequirements,
      "✅ Create settings schema",
      "✅ Add settings categories",
      "✅ Implement settings validation",
      "Add settings cache invalidation"
    ];
  }
  
  // Check if there are system settings tables in the database
  try {
    const { data } = await supabase
      .from('system_settings')
      .select('count()', { count: 'exact', head: true });
    
    const hasSystemSettings = data && data.count > 0;
    
    if (hasSystemSettings && feature.toLowerCase().includes('config')) {
      return [
        ...baseRequirements,
        "✅ Create system_settings table",
        "✅ Add initial configuration values",
        "✅ Set up RLS policies for admin access",
        "✅ Implement audit logging for changes"
      ];
    }
  } catch (error) {
    console.error("Error checking system settings:", error);
  }
  
  return baseRequirements;
};
