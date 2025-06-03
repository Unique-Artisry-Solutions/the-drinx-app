
import { FeatureItem } from '../types';

export interface FeatureStatistics {
  totalFeatures: number;
  implementedFeatures: number;
  inProgressFeatures: number;
  plannedFeatures: number;
  blockedFeatures: number;
  implementationRate: number;
  averageImplementation: number;
  dbCompleted: number;
  dbCompletionRate: number;
  frontendImplementationRate: number;
  confidenceScore: number;
}

export function calculateFeatureStatistics(features: FeatureItem[]): FeatureStatistics {
  const totalFeatures = features.length;
  
  if (totalFeatures === 0) {
    return {
      totalFeatures: 0,
      implementedFeatures: 0,
      inProgressFeatures: 0,
      plannedFeatures: 0,
      blockedFeatures: 0,
      implementationRate: 0,
      averageImplementation: 0,
      dbCompleted: 0,
      dbCompletionRate: 0,
      frontendImplementationRate: 0,
      confidenceScore: 0
    };
  }

  const implementedFeatures = features.filter(f => f.status === 'implemented').length;
  const inProgressFeatures = features.filter(f => f.status === 'in_progress').length;
  const plannedFeatures = features.filter(f => f.status === 'planned').length;
  const blockedFeatures = features.filter(f => f.status === 'blocked').length;

  const dbCompleted = features.filter(f => 
    f.databaseStatus === 'complete'
  ).length;

  const implementationRate = (implementedFeatures / totalFeatures) * 100;
  const dbCompletionRate = (dbCompleted / totalFeatures) * 100;
  
  // Calculate average implementation progress
  const totalProgress = features.reduce((sum, feature) => {
    return sum + (feature.implementationProgress || 0);
  }, 0);
  const averageImplementation = totalProgress / totalFeatures;

  // Frontend implementation rate (assuming implemented features have frontend)
  const frontendImplementationRate = implementationRate;

  // Calculate confidence score based on various factors
  const confidenceScore = Math.min(100, Math.round(
    (implementationRate * 0.4) + 
    (dbCompletionRate * 0.3) + 
    (averageImplementation * 0.3)
  ));

  return {
    totalFeatures,
    implementedFeatures,
    inProgressFeatures,
    plannedFeatures,
    blockedFeatures,
    implementationRate,
    averageImplementation,
    dbCompleted,
    dbCompletionRate,
    frontendImplementationRate,
    confidenceScore
  };
}

export interface CategoryProgress {
  overall: number;
  frontend: number;
  backend: number;
  implemented: number;
  inProgress: number;
  planned: number;
  blocked: number;
}

export function calculateCategoryProgress(features: FeatureItem[]): CategoryProgress {
  const stats = calculateFeatureStatistics(features);
  
  return {
    overall: stats.implementationRate,
    frontend: stats.frontendImplementationRate,
    backend: stats.dbCompletionRate,
    implemented: stats.implementedFeatures,
    inProgress: stats.inProgressFeatures,
    planned: stats.plannedFeatures,
    blocked: stats.blockedFeatures
  };
}

export function groupFeaturesByCategory(features: FeatureItem[]): Record<string, FeatureItem[]> {
  return features.reduce((groups, feature) => {
    const category = feature.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(feature);
    return groups;
  }, {} as Record<string, FeatureItem[]>);
}
