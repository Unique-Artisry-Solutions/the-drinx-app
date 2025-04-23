
export type FeatureStatus = 'implemented' | 'in_progress' | 'planned' | 'blocked' | 'partial';
export type DatabaseStatus = 'complete' | 'in_progress' | 'not_started' | 'implemented';
export type AccessLevel = 'full' | 'partial' | 'read' | 'none';
export type FeatureComplexity = 'high' | 'medium' | 'low';
export type FeatureCategory = string;

export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  adminAccess: AccessLevel;
  establishmentAccess: AccessLevel;
  individualAccess: AccessLevel;
  databaseStatus: DatabaseStatus;
  dbStatus?: DatabaseStatus;
  userImpact: 'high' | 'medium' | 'low';
  complexity: FeatureComplexity;
  databaseAnalysis?: string;
  statusUpdated?: boolean;
  implementationProgress?: number;
  dbCompleted?: number;
  testSteps?: string[];
  subFeatures?: SubFeature[];
  originalStatus?: string;
  tags?: string[];
  dbRequirementsText?: string;
  dependsOn?: string[];
  scheduledFor?: string;
}

export interface SubFeature {
  name: string;
  status: FeatureStatus;
  description: string;
  progress: number;
  phases?: Phase[];
}

export interface Phase {
  name: string;
  status: FeatureStatus;
  tasks: string[];
}
