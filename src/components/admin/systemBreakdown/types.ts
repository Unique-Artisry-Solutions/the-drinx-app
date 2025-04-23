export type FeatureStatus = 'implemented' | 'in_progress' | 'planned' | 'blocked' | 'partial';
export type DatabaseStatus = 'complete' | 'in_progress' | 'not_started' | 'implemented';
export type AccessLevel = 'full' | 'partial' | 'read' | 'none' | 'write';
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

export interface Phase {
  name: string;
  status: FeatureStatus;
  tasks: string[];
}

export interface SubFeature {
  name: string;
  status: FeatureStatus;
  description: string;
  progress: number;
  phases?: Phase[];
}

export type FeatureShowcaseCategoryType = string;
export type FeatureBusinessValueType = 'high' | 'medium' | 'low';

export interface FeatureBusinessValueObject {
  value: FeatureBusinessValueType;
  label: string;
  description: string;
  color: string;
  name: string;
  features: FeatureItem[];
  implementationRate: number;
  featureCount?: number;
}

export interface FeatureShowcaseData {
  id: string;
  name: string;
  description: string;
  businessValue: FeatureBusinessValueType;
  complexity: FeatureComplexity;
  implementationStatus: FeatureStatus;
  showcaseCategory: string;
  isSignature: boolean;
  icon: string;
  implementations?: number;
  avgRating?: number;
  marketingPoints?: string[];
  categories: string[];
  businessValues: string[];
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
  type: 'enhancement' | 'new-feature';
  votes: number;
  submittedDate: string;
  submittedBy: string;
  lovableCompatible?: boolean;
  technicalRequirements?: string;
  implementationSteps: string[];
  estimatedEffort: string;
  businessImpact: string;
  currentStatus?: string;
  affectedAreas: ('admin' | 'establishment' | 'individual')[];
}

export type SortField = 'priority' | 'impact' | 'effort' | 'title' | 'name' | 'status' | 'type' | 'lovableCompatible' | 'submittedDate' | 'votes';
export type SortOrder = 'asc' | 'desc';

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

export interface AnalysisStep {
  name: string;
  completed: boolean;
  details?: string;
}
