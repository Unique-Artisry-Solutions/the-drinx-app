
export interface FeatureItem {
  name: string;
  description: string;
  status: 'implemented' | 'partial' | 'planned';
  adminAccess: boolean;
  establishmentAccess: boolean;
  individualAccess: boolean;
}
