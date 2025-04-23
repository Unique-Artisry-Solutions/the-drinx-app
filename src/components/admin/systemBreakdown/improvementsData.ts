import { ImprovementItem } from './types';

export const improvementsData: ImprovementItem[] = [
  {
    id: 'imp-001',
    title: 'Advanced AI Recommendations',
    description: 'Implement an AI-based recommendation engine for mocktails based on user preferences and past selections.',
    impact: 'high',
    effort: 'high',
    priority: 1,
    status: 'proposed',
    category: 'AI',
    votes: 42,
    submittedBy: 'Alex Johnson',
    submittedDate: '2023-04-15',
    type: 'new-feature',
    name: 'Advanced AI Recommendations',
    lovableCompatible: true,
    technicalRequirements: 'ML model training, user preference database schema updates',
    implementationSteps: [
      'Design recommendation algorithm',
      'Collect and normalize user preference data',
      'Train initial model',
      'Implement frontend components for suggestions',
      'Deploy and monitor'
    ],
    estimatedEffort: '3 sprints',
    businessImpact: 'Increases user engagement by 35% in test markets',
    currentStatus: 'Awaiting technical review',
    affectedAreas: ['admin', 'individual']
  },
  {
    id: 'imp-002',
    title: 'Social Sharing Integration',
    description: 'Add capability for users to share their favorite mocktails, bar crawls, and custom routes on social media platforms.',
    impact: 'medium',
    effort: 'low',
    status: 'in_progress',
    category: 'Social',
    votes: 38,
    submittedBy: 'Morgan Taylor',
    submittedDate: '2023-04-18',
    type: 'enhancement',
    name: 'Social Sharing Integration',
    priority: 2,
    lovableCompatible: true,
    technicalRequirements: 'Social API integration, image generation services',
    implementationSteps: [
      'Integrate social media APIs',
      'Create shareable cards for mocktails and routes',
      'Implement sharing actions in UI',
      'Add analytics for shared content'
    ],
    estimatedEffort: '1 sprint',
    businessImpact: 'Expected to increase user acquisition by 12%',
    currentStatus: 'Sprint 3 implementation',
    affectedAreas: ['individual']
  },
  {
    id: 'imp-003',
    title: 'Establishment Analytics Dashboard',
    description: 'Create a comprehensive analytics dashboard for establishment owners to track popularity of their offerings, customer demographics, and busy periods.',
    impact: 'high',
    effort: 'medium',
    status: 'approved',
    category: 'Analytics',
    votes: 35,
    submittedBy: 'Jamie Williams',
    submittedDate: '2023-04-22',
    type: 'new-feature',
    name: 'Establishment Analytics Dashboard',
    priority: 3,
    lovableCompatible: true,
    technicalRequirements: 'Data visualization library, event tracking system',
    implementationSteps: [
      'Design analytics models',
      'Implement data collection points',
      'Build visualization components',
      'Create establishment-specific filters',
      'Deploy phase 1 with basic metrics'
    ],
    estimatedEffort: '2 sprints',
    businessImpact: 'Enables establishments to optimize menu and staffing',
    currentStatus: 'Scheduled for next sprint',
    affectedAreas: ['establishment', 'admin']
  },
  {
    id: 'imp-004',
    title: 'Ingredient Inventory Management',
    description: 'Add inventory management features for establishments to track mocktail ingredient levels and receive alerts for restocking.',
    impact: 'medium',
    effort: 'medium',
    status: 'proposed',
    category: 'Management',
    votes: 29,
    submittedBy: 'Riley Smith',
    submittedDate: '2023-04-25',
    type: 'new-feature',
    name: 'Ingredient Inventory Management',
    priority: 4,
    lovableCompatible: false,
    technicalRequirements: 'Inventory database schema, alert system',
    implementationSteps: [
      'Design inventory data model',
      'Create inventory management UI',
      'Implement automated alerts',
      'Connect with POS systems (Phase 2)'
    ],
    estimatedEffort: '2 sprints',
    businessImpact: 'Reduces waste and improves establishment efficiency',
    currentStatus: 'Pending technical evaluation',
    affectedAreas: ['establishment']
  },
  {
    id: 'imp-005',
    title: 'Personalized Bar Crawl Planner',
    description: 'Enhance the bar crawl feature to generate personalized routes based on user preferences, time constraints, and preferred establishments.',
    impact: 'high',
    effort: 'high',
    status: 'proposed',
    category: 'Personalization',
    votes: 27,
    submittedBy: 'Jordan Lee',
    submittedDate: '2023-04-30',
    type: 'enhancement',
    name: 'Personalized Bar Crawl Planner',
    priority: 5,
    lovableCompatible: true,
    technicalRequirements: 'Route optimization algorithm, user preference system',
    implementationSteps: [
      'Develop preference collection mechanism',
      'Create route optimization algorithm',
      'Build interactive route customization UI',
      'Implement route sharing and saving'
    ],
    estimatedEffort: '3 sprints',
    businessImpact: 'Increases multi-establishment visits by 45% in test markets',
    currentStatus: 'Scheduled for roadmap review',
    affectedAreas: ['individual']
  }
];

// Alias for backward compatibility
export const proposedImprovements = improvementsData;
