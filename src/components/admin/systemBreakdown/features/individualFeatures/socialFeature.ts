
import { FeatureItem } from '../../types';

export const socialFeatureItem: FeatureItem = {
  id: 'social-features',
  name: 'Social Features',
  description: 'Allows users to connect, share experiences, and engage with others',
  status: 'in_progress',
  implementationProgress: 60,
  priority: 'high',
  complexity: 'high',
  category: 'Social',
  tags: ['social', 'community', 'sharing'],
  dependencies: ['user-profiles', 'content-sharing'],
  dbStatus: 'partial',
  dbRequirementsText: 'Tables for user connections, shared content, and activity feeds'
};
