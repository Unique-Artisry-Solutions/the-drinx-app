
export interface SystemBreakdownProps {
  activeTab: string;
}

export type FeatureStatus = 'planned' | 'in-development' | 'completed' | 'implemented' | 'in-progress' | 'testing' | 'on-hold';
export type FeaturePriority = 'low' | 'medium' | 'high' | 'critical';
export type FeatureCategory = 'core' | 'audience' | 'advertisement' | 'stats' | 'ui' | 'promoter' | 'application' | 'user' | 'venue';

export interface FeatureComponent {
  name: string;
  status: FeatureStatus;
  implementation: number; // 0-1
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
  date: string;
  overallProgress: number;
  categoryProgress: {
    [key: string]: number;
  };
}

export interface SystemProgress {
  currentProgress: ProgressStatistics;
  categoryProgress: CategoryProgress[];
  timeline: ProgressSnapshot[];
}
