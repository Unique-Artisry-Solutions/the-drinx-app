
import { FeatureItem } from '../types';

/**
 * Parse task statuses from analysis text
 * @param text The database analysis text
 */
export const parseTaskStatuses = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const tasks = lines.map(line => {
    const isCompleted = line.includes('[x]') || line.includes('✓') || line.includes('completed');
    const cleanedText = line
      .replace(/\[\s*x\s*\]/gi, '')
      .replace(/\[\s*\]/gi, '')
      .replace(/✓/g, '')
      .trim();
      
    return {
      text: cleanedText,
      isCompleted
    };
  });
  
  return tasks;
};

/**
 * Analyze database requirements for a feature
 * @param feature The feature to analyze
 */
export const analyzeDbRequirements = (feature: FeatureItem) => {
  const requirements: { table: string; fields: string[]; relationships: string[] }[] = [];
  
  if (!feature.dbRequirementsText) {
    return requirements;
  }
  
  const text = feature.dbRequirementsText;
  
  // Basic parsing of table requirements from the text
  const tableMatches = text.match(/table[s]?\s+for\s+([^,\.]+)/gi);
  if (tableMatches) {
    tableMatches.forEach(match => {
      const tableName = match.replace(/table[s]?\s+for\s+/i, '').trim();
      requirements.push({
        table: tableName,
        fields: [],
        relationships: []
      });
    });
  }
  
  return requirements;
};
