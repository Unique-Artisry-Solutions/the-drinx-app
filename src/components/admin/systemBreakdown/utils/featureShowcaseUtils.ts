
import { FeatureItem, FeatureShowcaseData } from '../types';
import { 
  isAIFeature,
  isAnalyticsFeature,
  isMapFeature,
  isSignatureFeature,
  isDashboardFeature,
  isSystemBreakdownFeature
} from './featureDetection';

export const transformFeatureToShowcase = (feature: FeatureItem): FeatureShowcaseData => {
  return {
    id: feature.id,
    name: feature.name,
    description: feature.description,
    businessValue: feature.userImpact || 'medium',
    complexity: feature.complexity || 'medium',
    implementationStatus: feature.status,
    showcaseCategory: determineCategory(feature),
    isSignature: isSignatureFeature(feature),
    icon: determineIcon(feature),
    marketingPoints: generateMarketingPoints(feature),
    implementations: 0,
    avgRating: 0,
    categories: feature.tags || [],
    businessValues: [feature.userImpact || 'medium']
  };
};

const determineCategory = (feature: FeatureItem): string => {
  if (isAIFeature(feature)) return 'AI & Machine Learning';
  if (isAnalyticsFeature(feature)) return 'Analytics & Reporting';
  if (isMapFeature(feature)) return 'Location Services';
  if (isDashboardFeature(feature)) return 'Dashboards';
  if (isSystemBreakdownFeature(feature)) return 'System Management';
  return 'General Features';
};

const determineIcon = (feature: FeatureItem): string => {
  if (isAIFeature(feature)) return 'Brain';
  if (isAnalyticsFeature(feature)) return 'BarChart';
  if (isMapFeature(feature)) return 'Map';
  if (isDashboardFeature(feature)) return 'Layout';
  if (isSystemBreakdownFeature(feature)) return 'Settings';
  return 'Star';
};

const generateMarketingPoints = (feature: FeatureItem): string[] => {
  const points: string[] = [];
  
  if (feature.description) {
    points.push(feature.description);
  }
  
  if (feature.userImpact === 'high') {
    points.push('High business impact feature');
  }
  
  if (isSignatureFeature(feature)) {
    points.push('Signature platform capability');
  }
  
  return points;
};

export const prepareFeatureShowcaseData = (features: FeatureItem[]): FeatureShowcaseData[] => {
  return features.map(transformFeatureToShowcase);
};
