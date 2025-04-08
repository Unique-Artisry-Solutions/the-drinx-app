
// Re-export the original types file with additions for our system settings

export type FeatureStatus = 'implemented' | 'in-progress' | 'planned' | 'not-started';

export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  adminAccess: string;
  establishmentAccess: string;
  individualAccess: string;
  databaseStatus: string;
  databaseAnalysis: string;
  testSteps: string[];
}

export interface AnalysisStep {
  featureId: string;
  featureName: string;
  status: string;
  timestamp: number;
}

export interface AnalysisProgressCallback {
  onProgress: (progress: number) => void;
  onStep: (step: AnalysisStep) => void;
}

export interface AnalysisResult {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  completedSteps: AnalysisStep[];
}

// Add system settings features
export const systemSettingsFeatureId = 'feature-system-settings';
export const systemSettingsFeatureName = 'System Settings & Configuration';
