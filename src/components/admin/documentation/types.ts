
export interface DocStep {
  title: string;
  description: string;
  screenshot?: string;
}

export interface DocTroubleshooting {
  problem: string;
  solution: string;
}

export interface DocFaq {
  question: string;
  answer: string;
}

export interface DocFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'implemented' | 'partial' | 'planned';
  path?: string;
  screenshot?: string;
  screenshotCaption?: string;
  steps?: DocStep[];
  quickTips?: string[];
  bestPractices?: string[];
  troubleshooting?: DocTroubleshooting[];
  faq?: DocFaq[];
  relatedFeatures?: string[];
  externalUrl?: string;
}

export interface DocSection {
  id: string;
  title: string;
  description: string;
  category: 'overview' | 'users' | 'content' | 'analytics' | 'settings' | 'tools' | 'promotions';
  features: DocFeature[];
}

export interface PromotionType {
  name: string;
  description: string;
  exampleUse: string;
  bestFor: string[];
}

export interface PromotionStrategy {
  name: string;
  description: string;
  implementation: string[];
  metrics: string[];
}

export interface PromotionDoc extends DocFeature {
  promotionTypes?: PromotionType[];
  strategies?: PromotionStrategy[];
  integrations?: string[];
  securityMeasures?: string[];
  analyticsCapabilities?: string[];
}
