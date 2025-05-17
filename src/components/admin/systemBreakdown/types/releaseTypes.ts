
export type ReleaseType = 'major' | 'minor' | 'patch' | 'hotfix';
export type ReleaseStatus = 'planned' | 'in_development' | 'ready_for_qa' | 'in_qa' | 'ready_for_release' | 'released';
export type ReleaseSortField = 'name' | 'version' | 'status' | 'plannedReleaseDate' | 'createdAt';
export type ReleaseSortOrder = 'asc' | 'desc';

// Simplify to a basic string type to avoid complex object issues
export type ReleaseNote = string;
export type ReleaseFeatureStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'deferred';

// Basic progress tracking type that doesn't reference complex objects
export interface ReleaseProgress {
  releaseId: string;
  completion: number;
  featuresCompleted: number;
  totalFeatures: number;
  percentComplete: number;
}

// Add the missing Release type
export interface Release {
  id: string;
  name: string;
  version: string;
  status: ReleaseStatus;
  plannedReleaseDate?: string;
  releaseDate?: string;
  notes?: ReleaseNote[];
  features?: ReleaseFeature[];
  createdAt: string;
  updatedAt: string;
}

// Add the missing ReleaseFeature type
export interface ReleaseFeature {
  id: string;
  releaseId: string;
  featureId: string;
  status: ReleaseFeatureStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Add the missing FeatureFlag type
export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}
