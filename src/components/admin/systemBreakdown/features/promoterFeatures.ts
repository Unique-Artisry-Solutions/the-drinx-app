
import { FeatureItem } from '../types';
import { comprehensivePromoterSuite } from './promoterFeatures/comprehensivePromoterSuite';
import { ticketManagement } from './promoterFeatures/ticketManagement';
import { promotionalTools } from './promoterFeatures/promotionalTools';

export const promoterFeatures: FeatureItem[] = [
  comprehensivePromoterSuite,
  ticketManagement,
  promotionalTools,
  {
    id: 'prom-001',
    name: 'Event Creation & Management',
    description: 'Create and manage events with detailed information and customization',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'read',
    individualAccess: 'read',
    promoterAccess: 'full',
    databaseStatus: 'complete',
    userImpact: 'high',
    complexity: 'high',
    implementationProgress: 95,
    category: 'business_operations'
  },
  {
    id: 'prom-002',
    name: 'Audience Analytics',
    description: 'Analyze event attendance, demographics, and engagement metrics',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    promoterAccess: 'full',
    databaseStatus: 'complete',
    userImpact: 'high',
    complexity: 'high',
    implementationProgress: 88,
    category: 'system_intelligence'
  },
  {
    id: 'prom-003',
    name: 'Revenue Management',
    description: 'Track revenue, manage pricing, and view financial analytics',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    promoterAccess: 'full',
    databaseStatus: 'complete',
    userImpact: 'high',
    complexity: 'medium',
    implementationProgress: 92,
    category: 'business_operations'
  },
  {
    id: 'prom-004',
    name: 'Venue Communication',
    description: 'Communicate with venue owners and coordinate event details',
    status: 'implemented',
    adminAccess: 'moderate',
    establishmentAccess: 'full',
    individualAccess: 'none',
    promoterAccess: 'full',
    databaseStatus: 'complete',
    userImpact: 'medium',
    complexity: 'medium',
    implementationProgress: 85,
    category: 'user_experience'
  },
  {
    id: 'prom-005',
    name: 'Social Media Integration',
    description: 'Share events across social platforms and track engagement',
    status: 'in_progress',
    adminAccess: 'read',
    establishmentAccess: 'none',
    individualAccess: 'none',
    promoterAccess: 'full',
    databaseStatus: 'in_progress',
    userImpact: 'medium',
    complexity: 'high',
    implementationProgress: 60,
    category: 'business_operations'
  }
];
