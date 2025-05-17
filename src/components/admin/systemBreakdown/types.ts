
// Base feature types
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

// System breakdown feature item interface
export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: 'implemented' | 'in_progress' | 'planned' | 'partial' | 'blocked';
  originalStatus?: string;
  statusUpdated?: boolean;
  complexity?: 'low' | 'medium' | 'high';
  category?: string;
  adminAccess?: string;
  establishmentAccess?: string;
  individualAccess?: string;
  databaseStatus?: string;
  dbStatus?: string;
  userImpact?: string;
  components?: {
    name: string;
    type: string;
    status: string;
  }[];
  implementationProgress?: number;
  lastUpdated?: string;
  assignedTo?: string;
  dependencies?: string[];
  databaseAnalysis?: string;
  testSteps?: string[];
  scheduledFor?: string;
  tags?: string[];
  businessValue?: string;
  isSignature?: boolean;
  showcaseCategory?: string;
  phases?: {
    name: string;
    status: string;
    description?: string;
    percentage?: number;
  }[];
  integrations?: string[];
  // Adding missing properties from errors
  dbRequirementsText?: string;
  dependsOn?: string[];
  dbCompleted?: number;
}

export type FeatureStatus = 'implemented' | 'in_progress' | 'planned' | 'partial' | 'blocked';

export type DatabaseStatus = 'completed' | 'in_progress' | 'not_started' | 'planned' | 'blocked';

// Progress tracking types
export interface MonthlyProgressData {
  month: string;
  totalImplemented: number;
  adminImplemented: number;
  establishmentImplemented: number;
  individualImplemented: number;
  promoterImplemented: number;
  // Add frontend and backend for TimelineTab
  frontend: number;
  backend: number;
}

// Adding alias for compatibility with ProgressData
export type ProgressData = MonthlyProgressData;

export interface ProgressSnapshot {
  date: string;
  overallProgress: number;
  frontendProgress: number;
  backendProgress: number;
  adminProgress: {
    overall: number;
    frontend: number;
    backend: number;
  };
  establishmentProgress: {
    overall: number;
    frontend: number;
    backend: number;
  };
  individualProgress: {
    overall: number;
    frontend: number;
    backend: number;
  };
  promoterProgress: {
    overall: number;
    frontend: number;
    backend: number;
  };
  implementedFeatures: number;
  totalFeatures: number;
  // Adding missing property
  dbComplete?: number;
}

// Analysis process types
export interface AnalysisStep {
  id?: string;
  name: string;
  description: string;
  progressPercentage: number;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  message?: string;
  // Adding missing property
  completed?: boolean;
  details?: string;
}

// Improvement tracking types
export interface ImprovementItem {
  id: string;
  title: string;
  description: string;
  category: string;
  effort: number;
  impact: number;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  statusUpdated?: boolean;
  originalStatus?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  votes?: number;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  implementationDetails?: string;
  benefits?: string[];
  risks?: string[];
  dependencies?: string[];
  estimatedDevelopmentTime?: string;
  estimatedCompletionDate?: string;
  tags?: string[];
  // Adding properties referenced in errors
  lovableCompatible?: boolean;
  technicalRequirements?: string;
  type?: 'new-feature' | 'enhancement';
  submittedDate?: string;
  affectedAreas?: ('admin' | 'individual' | 'establishment')[];
  implementationSteps?: string[];
  estimatedEffort?: string;
  businessImpact?: string;
  currentStatus?: string;
  submittedBy?: string;
}

export type SortField = 
  | 'title'
  | 'category'
  | 'effort'
  | 'impact'
  | 'status'
  | 'priority'
  | 'votes'
  | 'createdAt'
  // Adding additional sort fields referenced in errors
  | 'name'
  | 'type'
  | 'submittedDate'
  | 'lovableCompatible';

export type SortOrder = 'asc' | 'desc';

// Feature showcase types
export interface FeatureShowcaseData {
  id: string;
  name: string;
  description: string;
  showcaseCategory: string;
  implementationStatus: string;
  businessValue: string;
  isSignature: boolean;
  keyBenefits?: string[];
  technicalDetails?: string;
  // Adding missing properties from errors
  icon?: string;
  marketingPoints?: string[];
  implementations?: number;
  avgRating?: number;
  complexity?: string;
  categories?: string[];
  businessValues?: string[];
}

export type FeatureShowcaseCategoryType = 
  | 'user_experience' 
  | 'analytics' 
  | 'rewards' 
  | 'marketing' 
  | 'operations' 
  | 'communication' 
  | 'security';

export type FeatureBusinessValueType = 'high' | 'medium' | 'low';

export interface FeatureBusinessValueObject {
  value: string;
  label: string;
  name: string;
  description: string;
  color: string;
  features: FeatureItem[];
  implementationRate: number;
  featureCount: number;
}

// Adding release types directly to avoid circular references
export type ReleaseStatus = 'planned' | 'in_development' | 'ready_for_qa' | 'in_qa' | 'ready_for_release' | 'released';

export type ReleaseType = 'major' | 'minor' | 'patch';

export type ReleaseFeatureStatus = 'pending' | 'in_progress' | 'completed' | 'deferred';

export interface ReleaseFeature {
  id: string;
  name: string;
  description: string;
  status: ReleaseFeatureStatus;
  improvementId?: string;
  assignedTo?: string;
  notes?: string;
  startDate?: string;
  completionDate?: string;
  percentComplete?: number;
}

export interface ReleaseNote {
  type: 'feature' | 'improvement' | 'bugfix' | 'security' | 'other';
  title: string;
  description: string;
  technicalDetails?: string;
  userFacing: boolean;
  author?: string;
  createdAt?: string;
}

export interface Release {
  id: string;
  version: string;
  name: string;
  type: ReleaseType;
  status: ReleaseStatus;
  plannedReleaseDate?: string;
  actualReleaseDate?: string;
  description: string;
  features: ReleaseFeature[];
  releaseNotes: ReleaseNote[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  team?: string[];
  tags?: string[];
  previousVersion?: string;
  nextVersion?: string;
  releaseBranch?: string;
}

export interface ReleaseProgress {
  totalFeatures: number;
  completedFeatures: number;
  inProgressFeatures: number;
  pendingFeatures: number;
  deferredFeatures: number;
  percentComplete: number;
}

export type ReleaseSortField = 'version' | 'name' | 'status' | 'plannedReleaseDate';
export type ReleaseSortOrder = 'asc' | 'desc';
