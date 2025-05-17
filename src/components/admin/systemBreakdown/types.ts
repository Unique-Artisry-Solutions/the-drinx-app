
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

// Extended feature item interface for the enhanced system breakdown
export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  statusUpdated?: boolean;
  category?: string;
  complexity?: 'low' | 'medium' | 'high';
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
  status: 'pending' | 'running' | 'complete' | 'error';
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
  frontend?: number;
  backend?: number;
}

// Progress snapshot for system state
export interface ProgressSnapshot {
  date: string;
  totalFeatures: number;
  implementedFeatures: number;
  inProgressFeatures: number;
  plannedFeatures: number;
  implementationPercentage: number;
  adminProgress: number;
  establishmentProgress: number;
  individualProgress: number;
  promoterProgress: number;
}
