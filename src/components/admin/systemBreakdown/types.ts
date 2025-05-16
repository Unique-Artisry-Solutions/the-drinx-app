/**
 * System Breakdown Feature Types
 */

export interface SystemBreakdownProps {
  activeTab: string;
}

export type FeatureStatus = 'planned' | 'in_progress' | 'testing' | 'on-hold' | 'blocked' | 'partial' | 'implemented' | 'completed';
export type FeaturePriority = 'low' | 'medium' | 'high' | 'critical';
export type FeatureCategory = 'core' | 'audience' | 'advertisement' | 'stats' | 'ui' | 'promoter' | 'application' | 'user' | 'venue' | 'system';
export type FeatureComplexity = 'low' | 'medium' | 'high';
export type DatabaseStatus = 'complete' | 'in_progress' | 'partial' | 'blocked' | 'not_started';
export type AccessLevel = 'none' | 'read' | 'write' | 'full' | 'partial';

export interface FeatureComponent {
  name: string;
  status: FeatureStatus;
  implementation: number; // 0-1
  type?: string; // Add this to support the admin features index
}

export interface Task {
  id: string;
  title: string;
  status: 'planned' | 'in-progress' | 'completed';
  assignedTo?: string;
  dueDate?: string;
}

export interface SystemFeature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  implementation: number; // 0-1
  priority: FeaturePriority;
  components: FeatureComponent[];
  dependencies: string[];
  tasks: Task[];
  businessCase?: BusinessCase;
  mainFeature?: boolean;
  comingSoon?: boolean;
  beta?: boolean;
  icon?: string;
}

export interface BusinessCase {
  title: string;
  value: string[];
  impact: string;
}

export interface CategoryData {
  name: string;
  description: string;
  features: SystemFeature[];
  implementation: number; // 0-1
  status: FeatureStatus;
  icon?: string;
}

export interface ReleaseVersion {
  version: string;
  name: string;
  description: string;
  features: string[];
  releaseDate: string;
  status: 'planned' | 'in-development' | 'released';
}

export interface ProgressStatistics {
  totalFeatures: number;
  completedFeatures: number;
  inProgressFeatures: number;
  plannedFeatures: number;
  overallProgress: number;
}

export interface CategoryProgress {
  category: string;
  progress: number;
  features: number;
  completedFeatures: number;
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

export type FeatureBusinessValueType = 'low' | 'medium' | 'high' | 'critical';

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

export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  category?: string;
  implementationProgress?: number;
  frontendStatus?: string;
  backendStatus?: string;
  databaseStatus?: DatabaseStatus | string;  // Include both DatabaseStatus type and string for flexibility
  dbStatus?: DatabaseStatus;
  priority?: string;
  complexity?: FeatureComplexity;
  effort?: FeatureComplexity;
  impact?: FeatureBusinessValueType;
  tags?: string[];
  uiTasks?: string[];
  dbTasks?: string[];
  testingTasks?: string[];
  dependencies?: string[];
  dependsOn?: string[];
  scheduledFor?: string;
  statusUpdated?: boolean;
  icon?: React.ReactNode;
  testSteps?: string[];
  dbRequirementsText?: string;
  databaseAnalysis?: string;
  originalStatus?: string;
  adminAccess?: AccessLevel;
  establishmentAccess?: AccessLevel;
  individualAccess?: AccessLevel;
  promoterAccess?: AccessLevel;
  userImpact?: FeatureBusinessValueType;
  dbCompleted?: boolean;
  implementation?: number;
  components?: FeatureComponent[];
  tasks?: Task[];
  integrations?: any;
  responsible?: string;
  completionCriteria?: string[];
  notes?: string;
}

export type FeatureShowcaseCategoryType = 
  | 'User Experience'
  | 'Analytics'
  | 'Content Management'
  | 'Social Features'
  | 'Promotional Tools'
  | 'Security'
  | 'Administration'
  | 'Core Features'
  | 'Venue Management'
  | 'Ticketing'
  | 'Reward System'
  | 'Management Tools'
  | 'AI & Recommendations'
  | 'Social Experience'
  | 'Business Analytics'
  | 'User Engagement'
  | 'Customization'
  | 'Loyalty & Rewards'
  | 'Location Services'
  | 'General Features';

export interface FeatureShowcaseData {
  id: string;
  name: string;
  description: string;
  showcaseCategory: FeatureShowcaseCategoryType;
  implementationStatus: string;
  implementationPercentage: number;
  businessValue: FeatureBusinessValueType;
  marketingPoints: string[];
  isSignature: boolean;
  icon?: string;
  complexity?: string;
  userImpact?: string;
  originalFeature?: FeatureItem;
  implementations?: number;
  avgRating?: number;
  categories?: string[];
}

export interface AnalysisStep {
  id: string;
  name: string;
  description: string;
  isComplete: boolean;
  progress: number;
  tasks?: string[];
  details?: string;
}

export interface ImprovementItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  difficulty: 'easy' | 'medium' | 'hard' | 'complex';
  effort: number; // 1-5 scale
  impact: number; // 1-5 scale
  category: string;
  status: 'proposed' | 'planned' | 'in-progress' | 'implemented' | 'rejected';
  assignedTo?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  relatedFeatures?: string[];
  // Additional properties needed to fix type issues
  votes?: number;
  submittedBy?: string;
  submittedDate?: string;
  type?: 'new-feature' | 'enhancement';
  lovableCompatible?: boolean;
  technicalRequirements?: string;
  implementationSteps?: string[];
  estimatedEffort?: string;
  businessImpact?: string;
  currentStatus?: string;
  affectedAreas?: ('admin' | 'individual' | 'establishment')[];
}

export type SortField = 'priority' | 'difficulty' | 'effort' | 'impact' | 'title' | 'status' | 'category' | 'votes' | 'submittedDate' | 'type' | 'lovableCompatible' | 'name';
export type SortOrder = 'asc' | 'desc';

export interface DiscountCodeType {
  discountType: 'fixed' | 'percentage' | 'free_item';
}
