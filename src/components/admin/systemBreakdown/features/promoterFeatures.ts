
import { FeatureItem } from '../types';
import { promotionalTools } from './promoterFeatures/promotionalTools';
import { ticketManagement } from './promoterFeatures/ticketManagement';

// Combine all promoter features
export const promoterFeatures: FeatureItem[] = [
  ...ticketManagement,
  // Add promotional tools if they exist
  ...(promotionalTools || [])
];

export default promoterFeatures;
