import { FeatureItem } from '../types';

/**
 * Helper function to identify dependencies between features
 */
export function identifyDependencies(features: FeatureItem[]): FeatureItem[] {
  const updatedFeatures: FeatureItem[] = [...features];
  const featureMap: Record<string, FeatureItem> = {};
  
  // First pass: create a map of features by name (lowercase for case-insensitive matching)
  features.forEach(feature => {
    featureMap[feature.name.toLowerCase()] = feature;
  });
  
  // Second pass: identify dependencies by looking for feature names in descriptions
  updatedFeatures.forEach((feature, index) => {
    const dependencies: string[] = [];
    
    // Check the description for mentions of other features
    if (feature.description) {
      Object.keys(featureMap).forEach(featureName => {
        // Avoid matching itself
        if (featureName !== feature.name.toLowerCase() && 
            feature.description!.toLowerCase().includes(featureName)) {
          dependencies.push(featureMap[featureName].id);
        }
      });
    }
    
    // Add discovered dependencies
    if (dependencies.length > 0) {
      updatedFeatures[index] = {
        ...feature,
        dependencies: [...(feature.dependencies || []), ...dependencies]
      };
    }
  });
  
  return updatedFeatures;
}

/**
 * Analyzes feature implementation dependencies to ensure proper ordering
 */
export function analyzeDependencyOrder(features: FeatureItem[]): FeatureItem[] {
  const updatedFeatures = [...features];
  const implementedFeatures = new Set<string>();
  
  // First, collect all implemented features
  features.forEach(feature => {
    if (feature.status === 'implemented') {
      implementedFeatures.add(feature.id);
    }
  });
  
  // Then check if any in-progress features depend on non-implemented features
  features.forEach((feature, index) => {
    if (feature.status === 'in_progress' && feature.dependencies) {
      const hasUnimplementedDependency = feature.dependencies.some(depId => 
        !implementedFeatures.has(depId)
      );
      
      if (hasUnimplementedDependency) {
        updatedFeatures[index] = {
          ...feature,
          statusUpdated: true,
          databaseAnalysis: "Warning: Depends on unimplemented features"
        };
      }
    }
  });
  
  return updatedFeatures;
}

/**
 * Helper function to detect database consistency issues
 */
export function detectDatabaseInconsistencies(features: FeatureItem[]): FeatureItem[] {
  const updatedFeatures = [...features];
  
  features.forEach((feature, index) => {
    if (feature.status === 'implemented' && 
        (!feature.databaseStatus || feature.databaseStatus === 'not_started')) {
      
      updatedFeatures[index] = {
        ...feature,
        statusUpdated: true,
        databaseAnalysis: "Warning: Implemented feature without database implementation"
      };
    }
  });
  
  return updatedFeatures;
}

/**
 * Parse task statuses from analysis text
 */
export function parseTaskStatuses(analysisText: string): { text: string; isCompleted: boolean }[] {
  if (!analysisText) return [];

  // Split text into lines and analyze each one
  const lines = analysisText.split('\n').filter(line => line.trim().length > 0);
  
  return lines.map(line => {
    // Check for common completion indicators in the text
    const lowerLine = line.toLowerCase();
    const isCompleted = 
      lowerLine.includes('✓') || 
      lowerLine.includes('completed') || 
      lowerLine.includes('done') || 
      lowerLine.includes('implemented') ||
      lowerLine.includes('verified');
      
    return {
      text: line,
      isCompleted
    };
  });
}

/**
 * Analyze database requirements from feature data
 */
export function analyzeDbRequirements(feature: FeatureItem): string {
  if (!feature) return '';
  
  let requirementsText = feature.dbRequirementsText || '';
  
  // If no explicit requirements text, generate from description
  if (!requirementsText && feature.description) {
    if (feature.description.toLowerCase().includes('database') || 
        feature.description.toLowerCase().includes('db') || 
        feature.description.toLowerCase().includes('data')) {
      
      // Extract DB requirements based on feature description
      requirementsText = `Database requirements identified for ${feature.name}:\n`;
      
      if (feature.databaseStatus === 'completed') {
        requirementsText += '✓ Schema design completed\n';
        requirementsText += '✓ Database models implemented\n';
        requirementsText += '✓ API endpoints implemented\n';
      } else if (feature.databaseStatus === 'in_progress') {
        requirementsText += '✓ Schema design completed\n';
        requirementsText += '✓ Database models partially implemented\n';
        requirementsText += '⏳ API endpoints in progress\n';
      } else {
        requirementsText += '⏳ Schema design pending\n';
        requirementsText += '⏳ Database models to be implemented\n';
        requirementsText += '⏳ API endpoints to be created\n';
      }
    } else {
      requirementsText = 'No database requirements identified for this feature.';
    }
  }
  
  return requirementsText;
}
