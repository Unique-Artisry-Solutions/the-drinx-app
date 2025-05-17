
export type ReleaseType = 'major' | 'minor' | 'patch' | 'hotfix';
export type ReleaseStatus = 'planned' | 'in_development' | 'ready_for_qa' | 'in_qa' | 'ready_for_release' | 'released';
export type ReleaseSortField = 'name' | 'version' | 'status' | 'plannedReleaseDate' | 'createdAt';
export type ReleaseSortOrder = 'asc' | 'desc';

// Simplify to a basic string type to avoid complex object issues
export type ReleaseNote = string;
export type ReleaseFeatureStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'deferred';

export interface ReleaseFeature {
  id: string;
  name: string;
  status: ReleaseFeatureStatus;
  description?: string;
  percentComplete?: number;
  startDate?: string;
  completionDate?: string;
  notes?: string;
  assignedTo?: string;
  improvementId?: string;
}

// Basic release structure for compatibility
export interface Release {
  id: string;
  version: string;
  name: string;
  type: ReleaseType;
  status: ReleaseStatus;
  description: string;
  features: ReleaseFeature[];
  releaseNotes: string[];
  createdAt: string;
  updatedAt: string;
  plannedReleaseDate: string;
  actualReleaseDate?: string;
  team: string[];
  tags: string[];
  releaseBranch: string;
  createdBy?: string;
  previousVersion?: string;
  nextVersion?: string;
}

// Simplified progress tracking
export interface ReleaseProgress {
  releaseId: string;
  completion: number;
  featuresCompleted: number;
  totalFeatures: number;
  percentComplete: number;
}
