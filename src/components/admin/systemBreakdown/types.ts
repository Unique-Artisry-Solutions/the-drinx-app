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
