
import { FeatureItem } from './core';

export interface AnalysisStep {
  name: string;
  completed: boolean;
  details?: string;
}

export interface AnalysisResult {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
  completedSteps: AnalysisStep[];
  promoterCategories?: Record<string, FeatureItem[]>;
}
