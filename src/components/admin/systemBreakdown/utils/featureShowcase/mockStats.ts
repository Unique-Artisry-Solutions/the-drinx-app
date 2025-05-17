
import { FeatureItem } from '../../types';
import { determineComplexity } from './featureTransformation';

/**
 * Generates mock implementation statistics for a feature
 */
export function generateMockImplementationStats(feature: FeatureItem) {
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
}
