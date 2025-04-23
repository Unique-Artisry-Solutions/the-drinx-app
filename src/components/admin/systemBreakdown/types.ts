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
