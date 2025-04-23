
export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: 'implemented' | 'in_progress' | 'planned' | 'blocked' | 'partial';
  adminAccess: 'full' | 'partial' | 'read' | 'none';
  establishmentAccess: 'full' | 'partial' | 'read' | 'none';
  individualAccess: 'full' | 'partial' | 'read' | 'none';
  databaseStatus: 'complete' | 'in_progress' | 'not_started';
  dbStatus?: string;
  userImpact: 'high' | 'medium' | 'low';
  complexity: 'high' | 'medium' | 'low';
  databaseAnalysis?: string;
  statusUpdated?: boolean;
  implementationProgress?: number;
  dbCompleted?: number;
  testSteps?: string[];
  subFeatures?: SubFeature[];
  // Additional properties needed by various components
  originalStatus?: string;
  tags?: string[];
  dbRequirementsText?: string;
  dependsOn?: string[];
  scheduledFor?: string;
}

export interface SubFeature {
  name: string;
  status: 'implemented' | 'in_progress' | 'planned' | 'blocked' | 'partial';
  description: string;
  progress: number;
  phases?: Phase[];
}

export interface Phase {
  name: string;
  status: 'implemented' | 'in_progress' | 'planned' | 'blocked';
  tasks: string[];
}

export interface ProgressSnapshot {
  timestamp: string;
  date: string;
  totalFeatures: number;
  implementedFeatures: number;
  inProgressFeatures: number;
  plannedFeatures: number;
  blockedFeatures: number;
  averageImplementationProgress: number;
  frontendProgress: number;
  backendProgress: number;
  adminFeatureCount: number;
  establishmentFeatureCount: number;
  individualFeatureCount: number;
  promoterFeatureCount: number;
  adminImplementationRate: number;
  establishmentImplementationRate: number;
  individualImplementationRate: number;
  promoterImplementationRate: number;
  overallProgress: number;
  dbComplete: number;
  confidenceScore: number;
}

export interface MonthlyProgressData {
  month: string;
  frontend: number;
  backend: number;
}

// Add missing type interfaces for showcase and improvements data
export interface FeatureShowcaseData {
  id: string;
  name: string;
  description: string;
  businessValue: FeatureBusinessValueType;
  complexity: 'high' | 'medium' | 'low';
  implementationStatus: string;
  showcaseCategory: string;
  isSignature: boolean;
  icon: string;
  implementations?: number;
  avgRating?: number;
  marketingPoints?: string[];
  categories: string[];
  businessValues: string[];
}

export type FeatureShowcaseCategoryType = string;
export type FeatureBusinessValueType = 'high' | 'medium' | 'low';

export interface FeatureBusinessValueObject {
  value: FeatureBusinessValueType;
  label: string;
  description: string;
  color: string;
}

export interface ImprovementItem {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  priority: number;
  category: string;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  targetDate?: string;
  assignedTo?: string;
  relatedFeatures?: string[];
}

export type SortField = 'priority' | 'impact' | 'effort' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface AnalysisStep {
  name: string;
  completed: boolean;
  details?: string;
}
