
export interface Task {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  description?: string;
  effort?: number;
  impact?: number;
}

export interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  implementation_status: 'planned' | 'in_progress' | 'completed' | 'blocked';
  tasks: Task[];
  dependencies?: string[];
  ui_components?: string[];
  api_endpoints?: string[];
  technical_details?: string;
  business_value?: string[];
}

// Define the possible values for feature status
export type FeatureStatus = 'planned' | 'in_progress' | 'partial' | 'implemented' | 'blocked';

// Define the possible values for database status
export type DatabaseStatus = 'not_started' | 'in_progress' | 'partial' | 'completed' | 'implemented';

// Define access levels
export type AccessLevel = 'none' | 'partial' | 'full';

// Define FeatureComplexity type
export type FeatureComplexity = 'low' | 'medium' | 'high';

// Extended feature item interface for the enhanced system breakdown
export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  statusUpdated?: boolean;
  originalStatus?: FeatureStatus;
  category?: string;
  complexity?: FeatureComplexity;
  adminAccess?: AccessLevel;
  establishmentAccess?: AccessLevel;
  individualAccess?: AccessLevel;
  promoterAccess?: AccessLevel;
  databaseStatus?: DatabaseStatus;
  userImpact?: 'low' | 'medium' | 'high';
  components?: {
    name: string;
    type: string;
    status: string;
  }[];
  lastUpdated?: string;
  assignedTo?: string;
  dependencies?: string[];
  implementationProgress?: number;
  tags?: string[];
  databaseAnalysis?: string;
  testSteps?: string[];
  scheduledFor?: string;
  dependsOn?: string[];
  dbRequirementsText?: string;
  integrations?: string[];
}

// Analytics step for feature analysis process
export interface AnalysisStep {
  name: string;
  description: string;
  progressPercentage: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  details?: string;
}

// Monthly progress data for charts
export interface MonthlyProgressData {
  month: string;
  totalImplemented: number;
  adminImplemented: number;
  establishmentImplemented: number;
  individualImplemented: number;
  promoterImplemented: number;
  // For backward compatibility with existing components
  frontend: number;
  backend: number;
}

// Progress snapshot for system state
export interface ProgressSnapshot {
  date: string;
  timestamp?: string;
  totalFeatures: number;
  implementedFeatures: number;
  inProgressFeatures: number;
  plannedFeatures: number;
  blockedFeatures?: number;
  implementationPercentage?: number;
  adminProgress: number;
  establishmentProgress: number;
  individualProgress: number;
  promoterProgress: number;
  // For backward compatibility
  frontendProgress?: number;
  backendProgress?: number;
  averageImplementationProgress?: number;
  overallProgress?: number;
  adminFeatureCount?: number;
  establishmentFeatureCount?: number;
  individualFeatureCount?: number;
  promoterFeatureCount?: number;
  adminImplementationRate?: number;
  establishmentImplementationRate?: number;
  individualImplementationRate?: number;
  promoterImplementationRate?: number;
  dbComplete?: number;
  confidenceScore?: number;
}

// Progress data for historical tracking
export interface ProgressData {
  date: string;
  implementationRate: number;
  features: {
    implemented: number;
    inProgress: number;
    planned: number;
    blocked: number;
    total: number;
  };
}

// Release progress tracking
export interface ReleaseProgress {
  id: string;
  version: string;
  implementationRate: number;
  features: {
    completed: number;
    inProgress: number;
    planned: number;
    blocked: number;
    total: number;
  };
}

// Feature showcase data types
export interface FeatureShowcaseData {
  id: string;
  name: string;
  description: string;
  showcaseCategory: string;
  complexityLevel: FeatureComplexity;
  businessValue: FeatureBusinessValueType;
  implementationStatus: FeatureStatus;
  marketingPoints: string[];
  iconName: string;
  isSignature: boolean;
  userType: 'admin' | 'establishment' | 'individual' | 'promoter';
  implementationPercentage?: number;
  mockImplementationStats?: {
    timeToImplement: string;
    componentsCount: number;
    apiEndpoints: number;
    testCoverage: number;
  };
}

export type FeatureBusinessValueType = 'high' | 'medium' | 'low';

export interface FeatureShowcaseCategoryType {
  name: string;
  description: string;
  features: FeatureShowcaseData[];
  implementationRate: number;
  featureCount: number;
}

export interface FeatureBusinessValueObject {
  value: FeatureBusinessValueType;
  label: string;
  name: string;
  description: string;
  color: string;
  features: FeatureItem[];
  implementationRate: number;
  featureCount: number;
}

// Improvement item types
export interface ImprovementItem {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  priority: number;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  category: string;
  votes: number;
  submittedBy: string;
  submittedDate: string;
  type: 'new-feature' | 'enhancement' | 'bug-fix' | 'refactor';
  lovableCompatible: boolean;
  technicalRequirements: string;
  implementationSteps: string[];
  estimatedEffort: string;
  businessImpact: string;
  currentStatus: string;
  affectedAreas: string[];
}

// Sorting options for improvements
export type SortField = 
  | 'title' 
  | 'impact' 
  | 'effort' 
  | 'priority' 
  | 'votes' 
  | 'submittedDate' 
  | 'status'  // Added additional sort fields
  | 'type'
  | 'lovableCompatible'
  | 'name';

export type SortOrder = 'asc' | 'desc';
