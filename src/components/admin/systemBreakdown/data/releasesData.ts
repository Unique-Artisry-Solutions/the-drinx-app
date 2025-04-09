
import { Release, ReleaseFeature, ReleaseNote } from '../types/releaseTypes';

// Sample features that might be included in releases
const sampleFeatures: ReleaseFeature[] = [
  {
    id: 'feature-1',
    name: 'Mocktail recommendations',
    description: 'AI-powered mocktail recommendations based on user preferences',
    status: 'completed',
    notes: 'Implemented using OpenAI API'
  },
  {
    id: 'feature-2',
    name: 'Bar crawl route optimization',
    description: 'Algorithm to optimize bar crawl routes based on distance and venue ratings',
    status: 'in_progress',
    assignedTo: 'Sarah Kim'
  },
  {
    id: 'feature-3',
    name: 'User profile customization',
    description: 'Allow users to customize their profile with preferences and dietary restrictions',
    status: 'pending',
    improvementId: 'imp-287'
  },
  {
    id: 'feature-4',
    name: 'Establishment analytics dashboard',
    description: 'Enhanced analytics dashboard for establishment owners',
    status: 'completed'
  },
  {
    id: 'feature-5',
    name: 'Social sharing integration',
    description: 'Allow users to share their favorite mocktails on social media',
    status: 'in_progress',
    assignedTo: 'Michael Chen'
  },
  {
    id: 'feature-6',
    name: 'Offline mode support',
    description: 'Access saved bar crawls and mocktail recipes while offline',
    status: 'deferred',
    notes: 'Technical limitations with current architecture'
  }
];

// Sample release notes
const sampleReleaseNotes: { [key: string]: ReleaseNote[] } = {
  '1.2.0': [
    {
      type: 'feature',
      title: 'AI-powered mocktail recommendations',
      description: 'Personalized mocktail suggestions based on your preferences and taste profile',
      userFacing: true
    },
    {
      type: 'improvement',
      title: 'Enhanced establishment profiles',
      description: 'Added more details and customization options for establishment profiles',
      userFacing: true
    },
    {
      type: 'bugfix',
      title: 'Fixed user authentication issues',
      description: 'Resolved issues with login and session management',
      technicalDetails: 'Updated token refresh mechanism and fixed JWT validation',
      userFacing: false
    }
  ],
  '1.1.0': [
    {
      type: 'feature',
      title: 'Bar crawl management',
      description: 'Create, edit, and share bar crawl routes with friends',
      userFacing: true
    },
    {
      type: 'security',
      title: 'Enhanced data protection',
      description: 'Improved security for user data and preferences',
      technicalDetails: 'Implemented row-level security in database and encrypted sensitive data',
      userFacing: false
    }
  ],
  '1.0.0': [
    {
      type: 'feature',
      title: 'Initial release',
      description: 'First public release of Spiritless platform',
      userFacing: true
    }
  ]
};

// Generate sample releases
export const sampleReleases: Release[] = [
  {
    id: 'release-1',
    version: '1.3.0',
    name: 'Social Sharing Update',
    type: 'minor',
    status: 'in_development',
    plannedReleaseDate: '2025-05-15',
    description: 'This release focuses on social features and sharing capabilities',
    features: [sampleFeatures[4], sampleFeatures[2]],
    releaseNotes: [],
    createdAt: '2025-03-01T12:00:00Z',
    updatedAt: '2025-03-15T09:30:00Z',
    createdBy: 'Alex Johnson'
  },
  {
    id: 'release-2',
    version: '1.2.0',
    name: 'Analytics & AI Update',
    type: 'minor',
    status: 'released',
    plannedReleaseDate: '2025-02-10',
    actualReleaseDate: '2025-02-12',
    description: 'This release introduces AI-powered recommendations and analytics',
    features: [sampleFeatures[0], sampleFeatures[3]],
    releaseNotes: sampleReleaseNotes['1.2.0'],
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2025-02-12T14:45:00Z',
    createdBy: 'Taylor Smith'
  },
  {
    id: 'release-3',
    version: '1.1.0',
    name: 'Bar Crawl Update',
    type: 'minor',
    status: 'released',
    plannedReleaseDate: '2024-11-20',
    actualReleaseDate: '2024-11-22',
    description: 'This release introduces bar crawl management features',
    features: [sampleFeatures[1]],
    releaseNotes: sampleReleaseNotes['1.1.0'],
    createdAt: '2024-10-05T09:15:00Z',
    updatedAt: '2024-11-22T16:30:00Z',
    createdBy: 'Chris Wong'
  },
  {
    id: 'release-4',
    version: '1.0.0',
    name: 'Initial Release',
    type: 'major',
    status: 'released',
    plannedReleaseDate: '2024-08-01',
    actualReleaseDate: '2024-08-01',
    description: 'Initial public release of the Spiritless platform',
    features: [],
    releaseNotes: sampleReleaseNotes['1.0.0'],
    createdAt: '2024-06-10T11:20:00Z',
    updatedAt: '2024-08-01T10:00:00Z',
    createdBy: 'Jamie Lee'
  },
  {
    id: 'release-5',
    version: '1.4.0',
    name: 'Offline & Mobile Update',
    type: 'minor',
    status: 'planned',
    plannedReleaseDate: '2025-07-20',
    description: 'This release will focus on offline capabilities and mobile enhancements',
    features: [sampleFeatures[5]],
    releaseNotes: [],
    createdAt: '2025-03-20T13:45:00Z',
    updatedAt: '2025-03-20T13:45:00Z',
    createdBy: 'Sam Rivera'
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
