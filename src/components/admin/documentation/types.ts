
export interface DocSection {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  description: string;
  features: DocFeature[];
}

export interface DocFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'implemented' | 'partial' | 'planned';
  implementationTips?: string[];
  testingSteps?: string[];
  bestPractices?: string[];
  troubleshooting?: string[];
  relatedFeatures?: string[];
}
