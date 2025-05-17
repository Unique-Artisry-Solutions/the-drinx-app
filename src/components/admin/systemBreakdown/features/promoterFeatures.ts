import { Feature } from '../types';
import { promoCodeManagement } from './promoterFeatures/promotionalTools';

// Export all promoter features
const promoterFeatures: Feature[] = [
  promoCodeManagement,
  // Add other promoter features here as they are created
];

export default promoterFeatures;
