
import { Release, ReleaseFeature, ReleaseNote } from '../types/releaseTypes';
import { subDays, addDays, format } from 'date-fns';

// Generate dates relative to current date for more realistic sample data
const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
const twoMonthsAgo = formatDate(subDays(today, 60));
const oneMonthAgo = formatDate(subDays(today, 30));
const twoWeeksAgo = formatDate(subDays(today, 14));
const inOneMonth = formatDate(addDays(today, 30));
const inTwoMonths = formatDate(addDays(today, 60));
const todayFormatted = formatDate(today);

// Sample features that might be included in releases
const sampleFeatures: ReleaseFeature[] = [
  {
    id: 'feature-1',
    name: 'Mocktail recommendations',
    description: 'AI-powered mocktail recommendations based on user preferences',
    status: 'completed',
    notes: 'Implemented using OpenAI API',
    startDate: twoMonthsAgo,
    completionDate: oneMonthAgo,
    percentComplete: 100
  },
  {
    id: 'feature-2',
    name: 'Bar crawl route optimization',
    description: 'Algorithm to optimize bar crawl routes based on distance and venue ratings',
    status: 'in_progress',
    assignedTo: 'Sarah Kim',
    startDate: oneMonthAgo,
    percentComplete: 75
  },
  {
    id: 'feature-3',
    name: 'User profile customization',
    description: 'Allow users to customize their profile with preferences and dietary restrictions',
    status: 'pending',
    improvementId: 'imp-287',
    startDate: todayFormatted
  },
  {
    id: 'feature-4',
    name: 'Establishment analytics dashboard',
    description: 'Enhanced analytics dashboard for establishment owners',
    status: 'completed',
    startDate: oneMonthAgo,
    completionDate: twoWeeksAgo,
    percentComplete: 100
  },
  {
    id: 'feature-5',
    name: 'Social sharing integration',
    description: 'Allow users to share their favorite mocktails on social media',
    status: 'in_progress',
    assignedTo: 'Michael Chen',
    startDate: twoWeeksAgo,
    percentComplete: 40
  },
  {
    id: 'feature-6',
    name: 'Offline mode support',
    description: 'Access saved bar crawls and mocktail recipes while offline',
    status: 'deferred',
    notes: 'Technical limitations with current architecture',
    startDate: oneMonthAgo
  },
  {
    id: 'feature-7',
    name: 'Seasonal mocktail trends',
    description: 'Showcase trending seasonal ingredients and mocktails',
    status: 'pending',
    startDate: inOneMonth
  },
  {
    id: 'feature-8',
    name: 'User reviews and ratings',
    description: 'Enhanced review system with photo uploads and detailed ratings',
    status: 'in_progress',
    assignedTo: 'Emily Johnson',
    startDate: twoWeeksAgo,
    percentComplete: 25
  }
];

// Sample release notes
const sampleReleaseNotes: { [key: string]: ReleaseNote[] } = {
  '1.2.0': [
    {
      type: 'feature',
      title: 'AI-powered mocktail recommendations',
      description: 'Personalized mocktail suggestions based on your preferences and taste profile',
      userFacing: true,
      author: 'Alex Johnson',
      createdAt: oneMonthAgo
    },
    {
      type: 'improvement',
      title: 'Enhanced establishment profiles',
      description: 'Added more details and customization options for establishment profiles',
      userFacing: true,
      author: 'Sarah Kim',
      createdAt: oneMonthAgo
    },
    {
      type: 'bugfix',
      title: 'Fixed user authentication issues',
      description: 'Resolved issues with login and session management',
      technicalDetails: 'Updated token refresh mechanism and fixed JWT validation',
      userFacing: false,
      author: 'Michael Chen',
      createdAt: oneMonthAgo
    }
  ],
  '1.1.0': [
    {
      type: 'feature',
      title: 'Bar crawl management',
      description: 'Create, edit, and share bar crawl routes with friends',
      userFacing: true,
      author: 'Emily Johnson',
      createdAt: twoMonthsAgo
    },
    {
      type: 'security',
      title: 'Enhanced data protection',
      description: 'Improved security for user data and preferences',
      technicalDetails: 'Implemented row-level security in database and encrypted sensitive data',
      userFacing: false,
      author: 'Michael Chen',
      createdAt: twoMonthsAgo
    }
  ],
  '1.0.0': [
    {
      type: 'feature',
      title: 'Initial release',
      description: 'First public release of Spiritless platform',
      userFacing: true,
      author: 'Development Team',
      createdAt: subDays(today, 90).toISOString()
    }
  ]
};

// Generate sample releases with realistic dates
export const sampleReleases: Release[] = [
  {
    id: 'release-1',
    version: '1.3.0',
    name: 'Social Sharing Update',
    type: 'minor',
    status: 'in_development',
    plannedReleaseDate: inOneMonth,
    description: 'This release focuses on social features and sharing capabilities',
    features: [sampleFeatures[4], sampleFeatures[2]],
    releaseNotes: [],
    createdAt: twoWeeksAgo + 'T12:00:00Z',
    updatedAt: todayFormatted + 'T09:30:00Z',
    createdBy: 'Alex Johnson',
    team: ['Sarah Kim', 'Michael Chen', 'Emily Johnson'],
    tags: ['social', 'sharing', 'user-experience'],
    releaseBranch: 'release/1.3.0'
  },
  {
    id: 'release-2',
    version: '1.2.0',
    name: 'Analytics & AI Update',
    type: 'minor',
    status: 'released',
    plannedReleaseDate: oneMonthAgo,
    actualReleaseDate: oneMonthAgo,
    description: 'This release introduces AI-powered recommendations and analytics',
    features: [sampleFeatures[0], sampleFeatures[3]],
    releaseNotes: sampleReleaseNotes['1.2.0'],
    createdAt: subDays(today, 75).toISOString(),
    updatedAt: oneMonthAgo + 'T14:45:00Z',
    createdBy: 'Taylor Smith',
    team: ['Alex Johnson', 'Sarah Kim', 'Michael Chen'],
    tags: ['analytics', 'ai', 'recommendations'],
    releaseBranch: 'release/1.2.0',
    previousVersion: '1.1.0'
  },
  {
    id: 'release-3',
    version: '1.1.0',
    name: 'Bar Crawl Update',
    type: 'minor',
    status: 'released',
    plannedReleaseDate: twoMonthsAgo,
    actualReleaseDate: twoMonthsAgo,
    description: 'This release introduces bar crawl management features',
    features: [sampleFeatures[1]],
    releaseNotes: sampleReleaseNotes['1.1.0'],
    createdAt: subDays(today, 100).toISOString(),
    updatedAt: twoMonthsAgo + 'T16:30:00Z',
    createdBy: 'Chris Wong',
    team: ['Emily Johnson', 'Michael Chen'],
    tags: ['swig-circuit', 'routes', 'planning'],
    releaseBranch: 'release/1.1.0',
    previousVersion: '1.0.0',
    nextVersion: '1.2.0'
  },
  {
    id: 'release-4',
    version: '1.0.0',
    name: 'Initial Release',
    type: 'major',
    status: 'released',
    plannedReleaseDate: subDays(today, 90).toISOString().split('T')[0],
    actualReleaseDate: subDays(today, 90).toISOString().split('T')[0],
    description: 'Initial public release of the Spiritless platform',
    features: [],
    releaseNotes: sampleReleaseNotes['1.0.0'],
    createdAt: subDays(today, 120).toISOString(),
    updatedAt: subDays(today, 90).toISOString(),
    createdBy: 'Jamie Lee',
    team: ['Alex Johnson', 'Sarah Kim', 'Michael Chen', 'Emily Johnson'],
    tags: ['initial-release', 'launch'],
    releaseBranch: 'release/1.0.0',
    nextVersion: '1.1.0'
  },
  {
    id: 'release-5',
    version: '1.4.0',
    name: 'Offline & Mobile Update',
    type: 'minor',
    status: 'planned',
    plannedReleaseDate: inTwoMonths,
    description: 'This release will focus on offline capabilities and mobile enhancements',
    features: [sampleFeatures[5], sampleFeatures[6], sampleFeatures[7]],
    releaseNotes: [],
    createdAt: todayFormatted + 'T13:45:00Z',
    updatedAt: todayFormatted + 'T13:45:00Z',
    createdBy: 'Sam Rivera',
    team: ['Alex Johnson', 'Emily Johnson'],
    tags: ['offline', 'mobile', 'performance'],
    releaseBranch: 'develop'
  }
];

// Helper function to get release by ID
export const getReleaseById = (id: string): Release | undefined => {
  return sampleReleases.find(release => release.id === id);
};

// Helper function to get release by version
export const getReleaseByVersion = (version: string): Release | undefined => {
  return sampleReleases.find(release => release.version === version);
};
