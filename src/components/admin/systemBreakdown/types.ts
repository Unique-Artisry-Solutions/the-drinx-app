
export type FeatureStatus = 'implemented' | 'partial' | 'planned' | 'not_started';
export type DatabaseStatus = 'complete' | 'in_progress' | 'not_started';
export type AccessLevel = 'full' | 'partial' | 'none' | 'planned';
export type FeatureCategory = 'Admin' | 'Establishment' | 'Individual';

export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  originalStatus?: FeatureStatus;
  statusUpdated?: boolean;
  databaseStatus: DatabaseStatus;
  adminAccess: AccessLevel;
  establishmentAccess: AccessLevel;
  individualAccess: AccessLevel;
  testSteps?: string[];
  databaseAnalysis?: string;
}

export interface ImprovementItem {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'enhancement' | 'new-feature';
  affectedAreas: ('admin' | 'establishment' | 'individual')[];
  implementationSteps: string[];
  estimatedEffort: string;
  businessImpact: string;
  technicalRequirements: string;
  currentStatus?: string;
  lovableCompatible?: boolean;
}

export type SortField = 'name' | 'priority' | 'type' | 'lovableCompatible';
export type SortOrder = 'asc' | 'desc';

export interface AnalysisStep {
  name: string;
  completed: boolean;
}

// New types for progress tracking
export interface ProgressSnapshot {
  date: string;
  overallProgress: number;
  frontendProgress: number;
  backendProgress: number;
  adminProgress: CategoryProgress;
  establishmentProgress: CategoryProgress;
  individualProgress: CategoryProgress;
  implementedFeatures: number;
  partialFeatures: number;
  plannedFeatures: number;
  dbComplete: number;
  dbInProgress: number;
  dbNotStarted: number;
  confidenceScore: number;
}

export interface CategoryProgress {
  frontend: number;
  backend: number;
  overall: number;
}

export interface MonthlyProgressData {
  month: string;
  frontend: number;
  backend: number;
}
