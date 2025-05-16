
import { FeatureItem } from '../../types';

export const mocktailSuggestionsFeature: FeatureItem = {
  id: 'mocktail-suggestions',
  name: 'Mocktail Suggestions',
  description: 'Provides personalized mocktail recommendations based on user preferences',
  status: 'in_progress',
  implementationProgress: 65,
  priority: 'medium',
  complexity: 'medium',
  category: 'Content',
  tags: ['mocktail', 'recommendation', 'personalization'],
  dependencies: ['user-profiles'],
  dbStatus: 'partial',
  dbRequirementsText: 'Tables for mocktail data, user preferences, and recommendation history'
};
