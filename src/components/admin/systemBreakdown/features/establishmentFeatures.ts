
import { FeatureItem } from '../types';

export const establishmentFeatures: FeatureItem[] = [
  {
    id: 'est-001',
    name: 'Establishment Profile Management',
    description: 'Comprehensive profile management for establishments including hours, photos, and contact info',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'full',
    individualAccess: 'read',
    databaseStatus: 'complete',
    userImpact: 'high',
    complexity: 'medium',
    implementationProgress: 95
  },
  {
    id: 'est-002',
    name: 'Menu Management System',
    description: 'Digital menu creation and management for mocktails and beverages',
    status: 'in_progress',
    adminAccess: 'full',
    establishmentAccess: 'full',
    individualAccess: 'read',
    databaseStatus: 'in_progress',
    userImpact: 'high',
    complexity: 'high',
    implementationProgress: 70
  }
];
