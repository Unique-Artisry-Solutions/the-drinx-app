
import { DocFeature, DocSection } from './types';

const mockFeatures: DocFeature[] = [
  {
    id: 'user-auth',
    title: 'User Authentication',
    description: 'Complete authentication system with login, signup, and verification',
    category: 'Authentication',
    status: 'implemented',
    implementationTips: ['Use Supabase Auth', 'Implement proper error handling'],
    testingSteps: ['Test login flow', 'Test signup flow', 'Test password reset'],
    bestPractices: ['Always validate user input', 'Use secure session management'],
    troubleshooting: ['Check network connectivity', 'Verify API endpoints'],
    relatedFeatures: ['user-profile', 'session-management']
  }
];

export const docSections: DocSection[] = [
  {
    id: 'authentication',
    title: 'Authentication System',
    content: 'Complete authentication implementation guide',
    category: 'Core Features',
    tags: ['auth', 'security', 'users'],
    description: 'Comprehensive authentication system with user management',
    features: mockFeatures
  },
  {
    id: 'rewards',
    title: 'Rewards System',
    content: 'Rewards and loyalty program implementation',
    category: 'Business Logic',
    tags: ['rewards', 'loyalty', 'points'],
    description: 'Complete rewards and loyalty program system',
    features: []
  },
  {
    id: 'events',
    title: 'Event Management',
    content: 'Event creation and management system',
    category: 'Core Features',
    tags: ['events', 'management', 'calendar'],
    description: 'Event creation, management, and ticketing system',
    features: []
  },
  {
    id: 'establishments',
    title: 'Establishment Management',
    content: 'Venue and establishment management features',
    category: 'Business Logic',
    tags: ['venues', 'establishments', 'management'],
    description: 'Complete establishment and venue management system',
    features: []
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    content: 'Analytics and reporting functionality',
    category: 'Analytics',
    tags: ['analytics', 'reports', 'dashboard'],
    description: 'Comprehensive analytics and reporting dashboard',
    features: []
  },
  {
    id: 'promotions',
    title: 'Promotional System',
    content: 'Discount codes and promotional campaigns',
    category: 'Marketing',
    tags: ['promotions', 'discounts', 'marketing'],
    description: 'Promotional campaigns and discount code system',
    features: []
  },
  {
    id: 'notifications',
    title: 'Notification System',
    content: 'Push notifications and email alerts',
    category: 'Communication',
    tags: ['notifications', 'alerts', 'communication'],
    description: 'Complete notification and alert system',
    features: []
  },
  {
    id: 'payments',
    title: 'Payment Processing',
    content: 'Payment integration and transaction handling',
    category: 'Commerce',
    tags: ['payments', 'transactions', 'commerce'],
    description: 'Payment processing and transaction management',
    features: []
  },
  {
    id: 'social',
    title: 'Social Features',
    content: 'Social sharing and community features',
    category: 'Social',
    tags: ['social', 'sharing', 'community'],
    description: 'Social features and community engagement tools',
    features: []
  }
];

export const getDocSectionById = (id: string): DocSection | undefined => {
  return docSections.find(section => section.id === id);
};

export const getDocFeaturesByCategory = (category: string): DocFeature[] => {
  return docSections.flatMap(section => section.features).filter(feature => feature.category === category);
};

export const getAllDocFeatures = (): DocFeature[] => {
  return docSections.flatMap(section => section.features);
};
