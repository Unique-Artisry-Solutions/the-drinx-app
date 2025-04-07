
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

export interface ImprovementItem {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'enhancement' | 'new-feature';
  affectedAreas: ('admin' | 'establishment' | 'individual')[];
  implementationSteps: string[];
  estimatedEffort: string;
  businessImpact: string;
  technicalRequirements?: string;
}
