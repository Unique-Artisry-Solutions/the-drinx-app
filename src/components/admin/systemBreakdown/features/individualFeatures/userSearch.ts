
import { FeatureItem } from '../../types';

export const userSearchFeature: FeatureItem = {
  id: 'user-search',
  name: 'User Search',
  description: 'Allows users to search for other users and establishments',
  status: 'in_progress',
  implementationProgress: 70,
  priority: 'medium',
  complexity: 'medium',
  category: 'Search',
  tags: ['search', 'discovery', 'users'],
  dependencies: ['user-profiles', 'establishment-database'],
  dbStatus: 'partial',
  dbRequirementsText: 'Search indexes for users and establishments'
};
