
// Re-export the original types file with additions for our system settings

export type FeatureStatus = 'implemented' | 'in-progress' | 'planned' | 'not-started' | 'partial';

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
  statusUpdated?: boolean;
  originalStatus?: string;
}

export type DatabaseStatus = 'complete' | 'in_progress' | 'not_started';
export type AccessLevel = 'full' | 'partial' | 'none' | 'planned';

export interface AnalysisStep {
  featureId: string;
  featureName: string;
  status: string;
  timestamp: number;
  name?: string;
  completed?: boolean;
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

// Add types needed for improvements tab
export type ImprovementPriority = 'high' | 'medium' | 'low';
export type ImprovementType = 'enhancement' | 'new-feature';
export type ImprovementArea = 'admin' | 'establishment' | 'individual';

export interface ImprovementItem {
  name: string;
  description: string;
  type: ImprovementType;
  priority: ImprovementPriority;
  affectedAreas: ImprovementArea[];
  implementationSteps: string[];
  estimatedEffort: string;
  businessImpact: string;
  technicalRequirements?: string;
}

export type FeatureCategory = 'Admin' | 'Establishment' | 'Individual';
