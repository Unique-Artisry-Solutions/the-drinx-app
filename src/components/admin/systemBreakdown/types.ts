
import { LucideIcon } from "lucide-react";

// Status types
export type FeatureStatus = 'planned' | 'in_progress' | 'implemented' | 'blocked';
export type DatabaseStatus = 'not_started' | 'in_progress' | 'implemented';
export type FeatureComplexity = 'low' | 'medium' | 'high';
export type FeatureImpact = 'low' | 'medium' | 'high';

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
  dbRequirementsText?: string; // Free text describing DB requirements
  tags?: string[]; // Used to categorize features
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
}

// Used for the historical progress chart
export interface MonthlyProgressData {
  month: string;
  frontend: number;
  backend: number;
  snapshots?: number; // Used only internally for calculation
}

// Data for the feature showcase
export interface FeatureShowcaseCategory {
  name: string;
  description: string;
  featureCount: number;
  implementationRate: number;
  icon?: LucideIcon;
  features: FeatureItem[];
}

export interface FeatureBusinessValue {
  name: string;
  description: string;
  featureCount: number;
  implementationRate: number;
  features: FeatureItem[];
}

export interface FeatureShowcaseData {
  categories: FeatureShowcaseCategory[];
  businessValues: FeatureBusinessValue[];
}
