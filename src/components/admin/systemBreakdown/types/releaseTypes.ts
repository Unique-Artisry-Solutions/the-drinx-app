
export type ReleaseType = 'major' | 'minor' | 'patch' | 'hotfix';
export type ReleaseStatus = 'planned' | 'in_development' | 'ready_for_qa' | 'in_qa' | 'ready_for_release' | 'released';
export type ReleaseSortField = 'name' | 'version' | 'status' | 'plannedReleaseDate' | 'createdAt';
export type ReleaseSortOrder = 'asc' | 'desc';

export type ReleaseNote = string;

export interface ReleaseFeature {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  description?: string;
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
