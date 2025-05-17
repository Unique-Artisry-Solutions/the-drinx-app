
import { FeatureItem } from '../types';
import { promoCodeManagement } from './promoterFeatures/promotionalTools';
import { ticketManagement } from './promoterFeatures/ticketManagement';

// Export all promoter features
const promoterFeatures: FeatureItem[] = [
  promoCodeManagement,
  ticketManagement
  // Add other promoter features here as they are created
];

export default promoterFeatures;
