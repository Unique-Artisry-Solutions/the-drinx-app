// Only keeping the FeatureFlag interface which is used by FeatureTogglesTab
export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Define the minimal types needed for releaseUtils.tsx
export type ReleaseFeatureStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'deferred';
export type ReleaseStatus = 'planned' | 'in_development' | 'ready_for_qa' | 'in_qa' | 'ready_for_release' | 'released';
