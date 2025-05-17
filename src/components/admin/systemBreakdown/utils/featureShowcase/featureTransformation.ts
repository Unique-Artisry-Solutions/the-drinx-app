
import { FeatureItem, FeatureBusinessValueType, FeatureComplexity } from '../../types';

/**
 * Determines the business value of a feature based on its name, description, and status
 */
export const determineBusinessValue = (feature: FeatureItem): FeatureBusinessValueType => {
  // Example: Check for keywords that might indicate high business value
  const highValueKeywords = ['revenue', 'monetization', 'conversion', 'retention', 'acquisition', 'critical'];
  const mediumValueKeywords = ['engagement', 'improvement', 'enhance', 'streamline'];

  const text = `${feature.name} ${feature.description}`.toLowerCase();

  // Check if any high-value keywords are present
  for (const keyword of highValueKeywords) {
    if (text.includes(keyword)) {
      return 'high';
    }
  }

  // Check if any medium-value keywords are present
  for (const keyword of mediumValueKeywords) {
    if (text.includes(keyword)) {
      return 'medium';
    }
  }

  // Default to 'low'
  return 'low';
};

/**
 * Determines the complexity level of a feature based on its description and other attributes
 */
export const determineComplexity = (feature: FeatureItem): FeatureComplexity => {
  // If the feature already has a complexity property, use that
  if (feature.complexity) {
    return feature.complexity;
  }

  // Example: Check for keywords that might indicate high complexity
  const highComplexityKeywords = ['integration', 'algorithm', 'machine learning', 'ai', 'realtime', 'real-time'];
  const lowComplexityKeywords = ['simple', 'basic', 'straightforward'];

  const text = `${feature.name} ${feature.description}`.toLowerCase();

  // Count dependencies as a complexity factor
  const dependenciesCount = feature.dependencies ? feature.dependencies.length : 0;

  // Check if any high-complexity keywords are present
  for (const keyword of highComplexityKeywords) {
    if (text.includes(keyword)) {
      return 'high';
    }
  }

  // Check if any low-complexity keywords are present
  for (const keyword of lowComplexityKeywords) {
    if (text.includes(keyword)) {
      return 'low';
    }
  }

  // Consider dependencies
  if (dependenciesCount > 2) {
    return 'high';
  } else if (dependenciesCount > 0) {
    return 'medium';
  }

  // Default to 'medium'
  return 'medium';
};

/**
 * Determines if a feature should be marked as a signature feature
 */
export const isSignatureFeature = (feature: FeatureItem): boolean => {
  // Example: Signature features might be indicated by special tags
  if (feature.tags && (feature.tags.includes('signature') || feature.tags.includes('flagship'))) {
    return true;
  }

  // Check for keywords that might indicate a signature feature
  const signatureKeywords = ['unique', 'differentiate', 'standout', 'exclusive', 'signature'];
  const text = `${feature.name} ${feature.description}`.toLowerCase();

  for (const keyword of signatureKeywords) {
    if (text.includes(keyword)) {
      return true;
    }
  }

  // Default to false
  return false;
};

/**
 * Creates mock implementation statistics for the feature showcase
 */
export const createMockImplementationStats = (feature: FeatureItem) => {
  // Base the mock stats on feature complexity
  const complexity = determineComplexity(feature);
  let timeToImplement: string;
  let componentsCount: number;
  let apiEndpoints: number;
  let testCoverage: number;

  switch (complexity) {
    case 'high':
      timeToImplement = '3-4 weeks';
      componentsCount = Math.floor(Math.random() * 6) + 10; // 10-15
      apiEndpoints = Math.floor(Math.random() * 6) + 5; // 5-10
      testCoverage = Math.floor(Math.random() * 16) + 75; // 75-90%
      break;
    case 'medium':
      timeToImplement = '1-2 weeks';
      componentsCount = Math.floor(Math.random() * 6) + 5; // 5-10
      apiEndpoints = Math.floor(Math.random() * 3) + 3; // 3-5
      testCoverage = Math.floor(Math.random() * 11) + 80; // 80-90%
      break;
    default: // 'low'
      timeToImplement = '3-5 days';
      componentsCount = Math.floor(Math.random() * 3) + 2; // 2-4
      apiEndpoints = Math.floor(Math.random() * 2) + 1; // 1-2
      testCoverage = Math.floor(Math.random() * 11) + 85; // 85-95%
  }

  return {
    timeToImplement,
    componentsCount,
    apiEndpoints,
    testCoverage
  };
};
