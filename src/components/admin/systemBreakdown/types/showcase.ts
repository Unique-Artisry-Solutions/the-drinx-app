
export interface FeatureShowcaseData {
  id: string;
  name: string;
  description: string;
  businessValue: 'high' | 'medium' | 'low';
  complexity: 'high' | 'medium' | 'low';
  implementationStatus: 'implemented' | 'in_progress' | 'planned' | 'blocked' | 'partial';
  showcaseCategory: string;
  isSignature: boolean;
  icon: string;
  marketingPoints?: string[];
  implementations?: number;
  avgRating?: number;
  categories: string[];
  businessValues: string[];
}
