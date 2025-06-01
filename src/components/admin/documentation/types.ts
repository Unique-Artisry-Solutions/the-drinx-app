
// Base type for documentation features
export interface DocFeature {
  id: string;
  title: string;
  description: string;
  status: 'implemented' | 'in-progress' | 'planned' | 'partial';
  statusText?: string;
  documentation?: string;
  icon?: string;
  category: string;
  tags?: string[];
  relatedFeatures?: string[];
  apis?: ApiDocumentation[];
  components?: ComponentDocumentation[];
  hooks?: HookDocumentation[];
  tables?: TableDocumentation[];
  flows?: FlowDocumentation[];
  promotionTypes?: PromotionTypeDoc[]; // For promotion specific documentation
  
  // Additional fields needed for DocFeatureDetails
  path?: string;
  externalUrl?: string;
  screenshot?: string;
  screenshotCaption?: string;
  steps?: { title: string; description: string; screenshot?: string }[];
  quickTips?: string[];
  bestPractices?: string[];
  troubleshooting?: { problem: string; solution: string }[];
  faq?: { question: string; answer: string }[];
}

// Section containing multiple features
export interface DocSection {
  id: string;
  title: string;
  description: string;
  category: string;
  features: DocFeature[];
}

// API Documentation
export interface ApiDocumentation {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters?: ParameterDoc[];
  responses?: ResponseDoc[];
  authentication?: string;
  examples?: string[];
}

// Parameter Documentation
export interface ParameterDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

// Response Documentation
export interface ResponseDoc {
  status: number;
  description: string;
  schema?: string;
  example?: string;
}

// Component Documentation
export interface ComponentDocumentation {
  id: string;
  name: string;
  description: string;
  props?: PropDoc[];
  notes?: string;
  usage?: string;
}

// Prop Documentation
export interface PropDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

// Hook Documentation
export interface HookDocumentation {
  id: string;
  name: string;
  description: string;
  parameters?: ParameterDoc[];
  returns?: ReturnDoc[];
  usage?: string;
}

// Return Documentation
export interface ReturnDoc {
  name: string;
  type: string;
  description: string;
}

// Table Documentation
export interface TableDocumentation {
  id: string;
  name: string;
  description: string;
  columns?: ColumnDoc[];
  relationships?: RelationshipDoc[];
  notes?: string;
}

// Column Documentation
export interface ColumnDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

// Relationship Documentation
export interface RelationshipDoc {
  name: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  relatedTable: string;
  description: string;
}

// Flow Documentation
export interface FlowDocumentation {
  id: string;
  name: string;
  description: string;
  steps: FlowStepDoc[];
}

// Flow Step Documentation
export interface FlowStepDoc {
  id: string;
  name: string;
  description: string;
  notes?: string;
}

// Promotion specific documentation types
export interface PromotionDoc extends DocFeature {
  promotionTypes: PromotionTypeDoc[];
}

export interface PromotionTypeDoc {
  id?: string;
  name: string;
  description: string;
  discountType?: string;
  constraints?: string[];
  implementation?: string;
  example?: string;
  bestFor?: string[];
  exampleUse?: string;
}

// System configuration documentation
export interface SystemConfigDoc extends DocFeature {
  configCategories: ConfigCategoryDoc[];
}

export interface ConfigCategoryDoc {
  id: string;
  name: string;
  description: string;
  settings: ConfigSettingDoc[];
}

export interface ConfigSettingDoc {
  id: string;
  key: string;
  valueType: string;
  description: string;
  isProtected: boolean;
  defaultValue?: string;
  validationRules?: string[];
}
