
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
}

// Progress tracking types
export interface MonthlyProgressData {
  month: string;
  totalImplemented: number;
  adminImplemented: number;
  establishmentImplemented: number;
  individualImplemented: number;
  promoterImplemented: number;
}

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
}

// Analysis process types
export interface AnalysisStep {
  id: string;
  name: string;
  description: string;
  progressPercentage: number;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  message?: string;
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
}

export type SortField = 
  | 'title'
  | 'category'
  | 'effort'
  | 'impact'
  | 'status'
  | 'priority'
  | 'votes'
  | 'createdAt';

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
