
import { SystemFeature, FeatureItem } from '../types';
import { ticketManagement } from './promoterFeatures/ticketManagement';
import { promotionalToolsFeature } from './promoterFeatures/promotionalTools';

export const promoterFeatures: FeatureItem[] = [
  promotionalToolsFeature as FeatureItem,
  ticketManagement as FeatureItem,
  {
    id: 'follower-management',
    name: 'Follower Management',
    description: 'Tools for promoters to manage followers, build an audience, and engage with their community.',
    category: 'promoter',
    status: 'in_progress',
    implementation: 0.7,
    priority: 'high',
    components: [
      {
        name: 'Follower Database',
        status: 'implemented',
        implementation: 0.9
      },
      {
        name: 'Communication Tools',
        status: 'in_progress',
        implementation: 0.6
      },
      {
        name: 'Analytics',
        status: 'in_progress',
        implementation: 0.6
      },
      {
        name: 'Engagement Features',
        status: 'planned',
        implementation: 0.3
      }
    ],
    dependencies: ['core-authentication', 'notification-system'],
    tasks: [
      { id: 'fm-1', title: 'Build follower database structure', status: 'completed' },
      { id: 'fm-2', title: 'Create follower management interface', status: 'completed' },
      { id: 'fm-3', title: 'Implement follower insights', status: 'in-progress' },
      { id: 'fm-4', title: 'Add communication features', status: 'in-progress' },
      { id: 'fm-5', title: 'Develop engagement tracking', status: 'planned' }
    ]
  },
  {
    id: 'venue-relationship-management',
    name: 'Venue Relationship Management',
    description: 'Interface for promoters to connect with venues, manage relationships, and coordinate events.',
    category: 'promoter',
    status: 'in_progress',
    implementation: 0.5,
    priority: 'medium',
    components: [
      {
        name: 'Venue Directory',
        status: 'implemented',
        implementation: 0.95
      },
      {
        name: 'Communication Channel',
        status: 'in_progress',
        implementation: 0.6
      },
      {
        name: 'Booking Management',
        status: 'planned',
        implementation: 0.1
      }
    ],
    dependencies: ['core-authentication', 'venue-management'],
    tasks: [
      { id: 'vrm-1', title: 'Create venue discovery interface', status: 'completed' },
      { id: 'vrm-2', title: 'Build promoter-venue messaging system', status: 'in-progress' },
      { id: 'vrm-3', title: 'Implement relationship tracking', status: 'in-progress' },
      { id: 'vrm-4', title: 'Develop booking and availability system', status: 'planned' }
    ]
  }
];
