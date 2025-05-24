
import { FeatureItem } from '../types';

export const individualFeatures: FeatureItem[] = [
  {
    id: 'ind-001',
    name: 'User Profile System',
    description: 'Personal profile management for individual users',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'read',
    individualAccess: 'full',
    databaseStatus: 'complete',
    userImpact: 'high',
    complexity: 'medium',
    implementationProgress: 100
  },
  {
    id: 'ind-002',
    name: 'Mocktail Discovery',
    description: 'Browse and discover mocktails from various establishments',
    status: 'in_progress',
    adminAccess: 'full',
    establishmentAccess: 'read',
    individualAccess: 'full',
    databaseStatus: 'in_progress',
    userImpact: 'high',
    complexity: 'high',
    implementationProgress: 65
  }
];
