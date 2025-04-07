
export interface FeatureItem {
  name: string;
  description: string;
  status: 'implemented' | 'partial' | 'planned';
  adminAccess: boolean;
  establishmentAccess: boolean;
  individualAccess: boolean;
  testSteps?: string[];
  databaseStatus?: 'completed' | 'in-progress' | 'not-started';
  databaseAnalysis?: string;
  statusUpdated?: boolean; // Track if status was updated during analysis
  originalStatus?: 'implemented' | 'partial' | 'planned'; // Keep track of original status
}
