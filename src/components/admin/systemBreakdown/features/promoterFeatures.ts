
import { FeatureItem } from '../types';
import { getDateMonthsFromNow } from '../utils';

export const promoterFeatures: FeatureItem[] = [
  // Ticket Management Module
  {
    id: '6001',
    name: 'Ticket Tier Management',
    description: 'Allow promoters to create and manage different ticket tiers for events',
    status: 'implemented',
    userImpact: 'high',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(1),
    dependsOn: [],
    implementationProgress: 100,
    dbStatus: 'complete',
    tags: ['promoter', 'ticket-management']
  },
  {
    id: '6002',
    name: 'Ticket Sales Tracking',
    description: 'Track ticket sales, commissions, and monitor event capacity in real-time',
    status: 'planned',
    userImpact: 'high',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(1),
    dependsOn: ['6001'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'ticket-management', 'analytics']
  },
  {
    id: '6003',
    name: 'Integrated Payment Processing',
    description: 'Process ticket payments seamlessly with multiple payment gateways',
    status: 'planned',
    userImpact: 'high',
    complexity: 'high',
    scheduledFor: getDateMonthsFromNow(2),
    dependsOn: ['6001', '6002'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'ticket-management', 'payment']
  },
  
  // Sponsorship Management
  {
    id: '6004',
    name: 'Brand Connection Platform',
    description: 'Platform for promoters to connect with brands for sponsorship opportunities',
    status: 'planned',
    userImpact: 'high',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(2),
    dependsOn: [],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'sponsorship']
  },
  {
    id: '6005',
    name: 'Branded Marketing Materials',
    description: 'Tools for creating branded flyers, social media templates, and promotional assets',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(3),
    dependsOn: ['6004'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'sponsorship', 'marketing']
  },
  {
    id: '6006',
    name: 'Sponsor ROI Analytics',
    description: 'Track and report on sponsor ROI through impressions and conversion metrics',
    status: 'planned',
    userImpact: 'high',
    complexity: 'high',
    scheduledFor: getDateMonthsFromNow(3),
    dependsOn: ['6004', '6005'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'sponsorship', 'analytics']
  },
  
  // Venue Partnership Tools
  {
    id: '6007',
    name: 'Revenue Sharing Agreements',
    description: 'Set up and manage revenue sharing or flat-fee structures with venues',
    status: 'planned',
    userImpact: 'high',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(2),
    dependsOn: [],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'venue-partnership']
  },
  {
    id: '6008',
    name: 'Promoter-Venue Communication',
    description: 'Dedicated communication channels between promoters and venues',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'low',
    scheduledFor: getDateMonthsFromNow(1),
    dependsOn: [],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'venue-partnership', 'communication']
  },
  {
    id: '6009',
    name: 'Venue Search and Booking',
    description: 'Search and book venues based on capacity, location, and amenities',
    status: 'planned',
    userImpact: 'high',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(2),
    dependsOn: ['6008'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'venue-partnership']
  },
  
  // Merchandise Integration
  {
    id: '6010',
    name: 'Merchandise E-commerce',
    description: 'Sell branded merchandise directly through the platform',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'high',
    scheduledFor: getDateMonthsFromNow(4),
    dependsOn: [],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'merchandise']
  },
  {
    id: '6011',
    name: 'Merchandise Design Tools',
    description: 'Customize and design merchandise for events and promotions',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(4),
    dependsOn: ['6010'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'merchandise']
  },
  {
    id: '6012',
    name: 'Merchandise Fulfillment Partner Integration',
    description: 'Partner with local print shops and suppliers for merchandise fulfillment',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'high',
    scheduledFor: getDateMonthsFromNow(5),
    dependsOn: ['6010', '6011'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'merchandise', 'integration']
  },
  
  // Performance Analytics Dashboard
  {
    id: '6013',
    name: 'Event Performance Analytics',
    description: 'Track attendance, sales, bar revenue, and customer feedback',
    status: 'in_progress',
    userImpact: 'high',
    complexity: 'high',
    scheduledFor: getDateMonthsFromNow(2),
    dependsOn: [],
    implementationProgress: 70,
    dbStatus: 'in_progress',
    tags: ['promoter', 'analytics', 'signature']
  },
  {
    id: '6014',
    name: 'Future Event Projections',
    description: 'AI-powered projections for future events based on historical data',
    status: 'implemented',
    userImpact: 'high',
    complexity: 'high',
    scheduledFor: getDateMonthsFromNow(3),
    dependsOn: ['6013'],
    implementationProgress: 100,
    dbStatus: 'complete',
    tags: ['promoter', 'analytics', 'AI']
  },
  {
    id: '6015',
    name: 'Live Event Tracking',
    description: 'Real-time monitoring of event metrics during live events',
    status: 'planned',
    userImpact: 'high',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(3),
    dependsOn: ['6013'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'analytics', 'real-time']
  },
  
  // Advertising Tools
  {
    id: '6016',
    name: 'In-App Ad Placements',
    description: 'Options for placing ads within the app like banners or promoted events',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(3),
    dependsOn: [],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'advertising']
  },
  {
    id: '6017',
    name: 'Ad Performance Analytics',
    description: 'Track reach and engagement metrics for advertising campaigns',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(3),
    dependsOn: ['6016'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'advertising', 'analytics']
  },
  {
    id: '6018',
    name: 'Advertising Marketplace',
    description: 'Marketplace connecting promoters with businesses for advertising opportunities',
    status: 'planned',
    userImpact: 'high',
    complexity: 'high',
    scheduledFor: getDateMonthsFromNow(4),
    dependsOn: ['6016', '6017'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'advertising', 'marketplace']
  },
  
  // VIP Upsell Features
  {
    id: '6019',
    name: 'VIP Package Designer',
    description: 'Create and customize VIP packages with exclusive perks and benefits',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(2),
    dependsOn: ['6001'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'vip']
  },
  {
    id: '6020',
    name: 'VIP Sales Analytics',
    description: 'Track VIP package sales and customer satisfaction metrics',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(2),
    dependsOn: ['6019'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'vip', 'analytics']
  },
  
  // Customer Feedback and Ratings
  {
    id: '6021',
    name: 'Post-Event Surveys',
    description: 'Create and distribute surveys after events to gather participant feedback',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'low',
    scheduledFor: getDateMonthsFromNow(1),
    dependsOn: [],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'feedback']
  },
  {
    id: '6022',
    name: 'Feedback Insights Dashboard',
    description: 'Actionable insights from participant feedback and ratings',
    status: 'planned',
    userImpact: 'high',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(2),
    dependsOn: ['6021'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'feedback', 'analytics']
  },
  {
    id: '6023',
    name: 'Promoter Rating System',
    description: 'Profile ratings and leaderboard for promoters based on customer feedback',
    status: 'planned',
    userImpact: 'medium',
    complexity: 'medium',
    scheduledFor: getDateMonthsFromNow(2),
    dependsOn: ['6021', '6022'],
    implementationProgress: 0,
    dbStatus: 'not_started',
    tags: ['promoter', 'feedback', 'social']
  }
];
