
import { FeatureItem } from '../types';

export const promoterFeatures: FeatureItem[] = [
  {
    id: 'prom-001',
    name: 'Event Creation System',
    description: 'Create and manage promotional events and circuits',
    status: 'in_progress',
    adminAccess: 'full',
    establishmentAccess: 'read',
    individualAccess: 'read',
    promoterAccess: 'full',
    databaseStatus: 'in_progress',
    userImpact: 'high',
    complexity: 'high',
    implementationProgress: 45
  },
  {
    id: 'prom-002',
    name: 'Promotion Analytics',
    description: 'Analytics dashboard for tracking promotion performance',
    status: 'planned',
    adminAccess: 'full',
    establishmentAccess: 'read',
    individualAccess: 'none',
    promoterAccess: 'full',
    databaseStatus: 'not_started',
    userImpact: 'medium',
    complexity: 'high',
    implementationProgress: 15
  }
];
