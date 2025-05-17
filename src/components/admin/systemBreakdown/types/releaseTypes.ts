export type ReleaseType = 'major' | 'minor' | 'patch' | 'hotfix';
export type ReleaseStatus = 'planned' | 'in_development' | 'ready_for_qa' | 'in_qa' | 'ready_for_release' | 'released';
export type ReleaseSortField = 'name' | 'version' | 'status' | 'plannedReleaseDate' | 'createdAt';
export type ReleaseSortOrder = 'asc' | 'desc';

// Simplified to string to avoid complex object type issues
export type ReleaseNote = string;

// Keep the type definition but simplify to avoid conflicts
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

export interface Release {
  id: string;
  version: string;
  name: string;
  type: ReleaseType;
  status: ReleaseStatus;
  description: string;
  features: ReleaseFeature[];
  releaseNotes: ReleaseNote[];
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

export interface ReleaseProgress {
  releaseId: string;
  completion: number;
  featuresCompleted: number;
  totalFeatures: number;
}

export interface AnalysisStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}
