// Only keeping the FeatureFlag interface which is used by FeatureTogglesTab
export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}
