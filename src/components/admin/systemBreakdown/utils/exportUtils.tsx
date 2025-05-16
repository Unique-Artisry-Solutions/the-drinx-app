
import { FeatureItem } from '../types';

/**
 * Generate CSV export of feature data
 */
export const generateCSV = (features: FeatureItem[]): string => {
  const headers = [
    'ID', 'Name', 'Description', 'Status', 'Implementation Progress', 
    'Priority', 'Complexity', 'Category', 'Tags', 'Dependencies'
  ];
  
  let csv = headers.join(',') + '\n';
  
  features.forEach(feature => {
    const row = [
      feature.id,
      `"${feature.name.replace(/"/g, '""')}"`,
      `"${feature.description.replace(/"/g, '""')}"`,
      feature.status,
      feature.implementationProgress || 0,
      feature.priority || 'medium',
      feature.complexity || 'medium',
      feature.category || '',
      feature.tags ? `"${feature.tags.join(', ').replace(/"/g, '""')}"` : '',
      feature.dependencies ? `"${feature.dependencies.join(', ').replace(/"/g, '""')}"` : ''
    ];
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

/**
 * Generate JSON export of feature data
 */
export const generateJSON = (features: FeatureItem[]): string => {
  const exportData = features.map(feature => ({
    id: feature.id,
    name: feature.name,
    description: feature.description,
    status: feature.status,
    implementationProgress: feature.implementationProgress || 0,
    priority: feature.priority || 'medium',
    complexity: feature.complexity || 'medium',
    category: feature.category || '',
    tags: feature.tags || [],
    dependencies: feature.dependencies || []
  }));
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Generate markdown report of feature data
 */
export const generateMarkdownReport = (features: FeatureItem[]): string => {
  let markdown = '# Feature Implementation Status Report\n\n';
  
  const categoryMap: Record<string, FeatureItem[]> = {};
  
  // Group features by category
  features.forEach(feature => {
    const category = feature.category || 'Uncategorized';
    if (!categoryMap[category]) {
      categoryMap[category] = [];
    }
    categoryMap[category].push(feature);
  });
  
  // Create section for each category
  Object.keys(categoryMap).forEach(category => {
    markdown += `## ${category}\n\n`;
    
    categoryMap[category].forEach(feature => {
      markdown += `### ${feature.name}\n\n`;
      markdown += `${feature.description}\n\n`;
      markdown += `- **Status:** ${feature.status}\n`;
      markdown += `- **Implementation:** ${feature.implementationProgress || 0}%\n`;
      
      if (feature.priority) {
        markdown += `- **Priority:** ${feature.priority}\n`;
      }
      
      if (feature.complexity) {
        markdown += `- **Complexity:** ${feature.complexity}\n`;
      }
      
      if (feature.tags && feature.tags.length > 0) {
        markdown += `- **Tags:** ${feature.tags.join(', ')}\n`;
      }
      
      if (feature.dependencies && feature.dependencies.length > 0) {
        markdown += `- **Dependencies:** ${feature.dependencies.join(', ')}\n`;
      }
      
      markdown += '\n';
    });
  });
  
  return markdown;
};
