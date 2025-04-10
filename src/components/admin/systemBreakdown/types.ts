
import { LucideIcon } from "lucide-react";

// Status types
export type FeatureStatus = 'planned' | 'in_progress' | 'implemented' | 'blocked' | 'partial';
export type DatabaseStatus = 'not_started' | 'in_progress' | 'implemented' | 'complete';
export type FeatureComplexity = 'low' | 'medium' | 'high';
export type FeatureImpact = 'low' | 'medium' | 'high';
export type AccessLevel = 'none' | 'read' | 'write' | 'full';
export type FeatureCategory = 'admin' | 'establishment' | 'individual' | 'promoter';

// Main feature item definition
export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  userImpact: FeatureImpact;
  complexity: FeatureComplexity;
  scheduledFor?: string;
  dependsOn?: string[];
  implementationProgress?: number; // 0-100
  statusUpdated?: boolean; // Used to mark when status has been updated
  dbStatus?: DatabaseStatus;
  databaseStatus?: DatabaseStatus; // Legacy property, use dbStatus instead
  originalStatus?: FeatureStatus;
  dbRequirementsText?: string; // Free text describing DB requirements
  tags?: string[]; // Used to categorize features
  
  // Additional properties
  adminAccess?: AccessLevel;
  establishmentAccess?: AccessLevel;
  individualAccess?: AccessLevel;
  databaseAnalysis?: string; // Analysis text for database status
  testSteps?: string[]; // Steps to test the feature
}

// Analysis and progress tracking
export interface AnalysisStep {
  name: string;
  completed: boolean;
  details?: string;
}

export interface ProgressSnapshot {
  timestamp: string;
  totalFeatures: number;
  implementedFeatures: number;
  inProgressFeatures: number;
  plannedFeatures: number;
  blockedFeatures: number;
  averageImplementationProgress: number;
  frontendProgress: number;
  backendProgress: number;
  
  // Feature counts by user type
  adminFeatureCount: number;
  establishmentFeatureCount: number;
  individualFeatureCount: number;
  promoterFeatureCount: number;
  
  // Implementation rates by user type
  adminImplementationRate: number;
  establishmentImplementationRate: number;
  individualImplementationRate: number;
  promoterImplementationRate: number;
  
  // Additional properties
  date?: string;
  dbComplete?: number;
  overallProgress?: number;
  confidenceScore?: number;
  adminProgress?: number;
  establishmentProgress?: number;
  individualProgress?: number;
}

// Used for the historical progress chart
export interface MonthlyProgressData {
  month: string;
  frontend: number;
  backend: number;
  snapshots?: number; // Used only internally for calculation
}

// Feature showcase category object
export interface FeatureShowcaseCategoryObject {
  name: string;
  description: string;
  featureCount: number;
  implementationRate: number;
  icon?: LucideIcon | { name: string };
  features: FeatureItem[];
}

// Feature business value object
export interface FeatureBusinessValueObject {
  name: string;
  description: string;
  featureCount: number;
  implementationRate: number;
  features: FeatureItem[];
}

// Feature showcase types
export type FeatureShowcaseCategoryType = 'AI & Recommendations' | 'Social Experience' | 'Business Analytics' | 'User Engagement' | 'Management Tools' | 'Customization' | 'Loyalty & Rewards';
export type FeatureBusinessValueType = 'low' | 'medium' | 'high';

// Feature showcase data type
export interface FeatureShowcaseData {
  id: string;
  name: string;
  description: string;
  businessValue: FeatureBusinessValueType;
  complexity: FeatureComplexity;
  implementationStatus: FeatureStatus;
  showcaseCategory: FeatureShowcaseCategoryType;
  marketingPoints?: string[];
  isSignature: boolean;
  implementations?: number;
  avgRating?: number;
  icon?: string;
  categories?: FeatureShowcaseCategoryObject[];
  businessValues?: FeatureBusinessValueObject[];
}

// For improvements tab
export interface ImprovementItem {
  id: string;
  title: string;
  description: string;
  impact: FeatureImpact;
  effort: FeatureComplexity;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  category: string;
  votes: number;
  submittedBy: string;
  submittedDate: string;
  
  // Additional properties
  type: 'enhancement' | 'new-feature';
  name?: string; // Alias for title for compatibility
  priority?: FeatureImpact; // Alias for impact for compatibility
  lovableCompatible?: boolean;
  technicalRequirements?: string;
  implementationSteps: string[];
  estimatedEffort: string;
  businessImpact: string;
  currentStatus?: string;
  affectedAreas: ('admin' | 'establishment' | 'individual')[];
}

export type SortField = 'title' | 'impact' | 'effort' | 'status' | 'votes' | 'submittedDate' | 'name' | 'priority' | 'type' | 'lovableCompatible';
export type SortOrder = 'asc' | 'desc';
