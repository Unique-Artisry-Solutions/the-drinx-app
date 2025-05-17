
export type ReleaseStatus = 'planned' | 'in_development' | 'ready_for_qa' | 'in_qa' | 'ready_for_release' | 'released';

export type ReleaseType = 'major' | 'minor' | 'patch';

export type ReleaseFeatureStatus = 'pending' | 'in_progress' | 'completed' | 'deferred';

export interface ReleaseFeature {
  id: string;
  name: string;
  description: string;
  status: ReleaseFeatureStatus;
  improvementId?: string; // Reference to existing improvement items
  assignedTo?: string;
  notes?: string;
  startDate?: string;
  completionDate?: string;
  percentComplete?: number;
}

export interface ReleaseNote {
  id: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'security' | 'other';
  title: string;
  description: string;
  technicalDetails?: string;
  userFacing: boolean;
  author?: string;
  createdAt?: string;
}

export interface Release {
  id: string;
  version: string;
  name: string;
  type: ReleaseType;
  status: ReleaseStatus;
  plannedReleaseDate?: string;
  actualReleaseDate?: string;
  description: string;
  features: ReleaseFeature[];
  releaseNotes: ReleaseNote[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  team?: string[];
  tags?: string[];
  previousVersion?: string;
  nextVersion?: string;
  releaseBranch?: string;
}

export interface ReleaseProgress {
  totalFeatures: number;
  completedFeatures: number;
  inProgressFeatures: number;
  pendingFeatures: number;
  deferredFeatures: number;
  percentComplete: number;
}

export type ReleaseSortField = 'version' | 'name' | 'status' | 'plannedReleaseDate';
export type ReleaseSortOrder = 'asc' | 'desc';
