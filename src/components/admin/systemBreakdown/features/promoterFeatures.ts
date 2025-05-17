
import { FeatureItem } from '../types';
import { ticketManagement } from './promoterFeatures/ticketManagement';

// Define the promoterFeatures array
export const promoterFeatures: FeatureItem[] = [
  ticketManagement,
  // Add other promoter features here
  {
    id: 'promoter-communication',
    name: 'Promoter Communication',
    description: 'Tools for promoters to communicate with venues and customers',
    status: 'implemented',
    adminAccess: 'partial',
    establishmentAccess: 'none',
    individualAccess: 'none',
    databaseStatus: 'complete',
    userImpact: 'high',
    complexity: 'medium'
  },
  {
    id: 'promoter-analytics',
    name: 'Promoter Analytics',
    description: 'Analytics dashboard for promoters to track performance',
    status: 'implemented',
    adminAccess: 'partial',
    establishmentAccess: 'none',
    individualAccess: 'none',
    databaseStatus: 'complete',
    userImpact: 'high',
    complexity: 'high'
  }
];
