
import { FeatureItem } from '../../types';

export const cocktailSwapsFeature: FeatureItem = {
  id: 'cocktail-swaps',
  name: 'Cocktail Swaps',
  description: 'Provides non-alcoholic alternatives to popular cocktails',
  status: 'implemented',
  implementationProgress: 90,
  priority: 'high',
  complexity: 'medium',
  category: 'Content',
  tags: ['mocktail', 'alternative', 'substitution'],
  dependencies: ['mocktail-database'],
  dbStatus: 'complete',
  dbRequirementsText: 'Tables for cocktail-mocktail pairings and ingredient substitutions'
};
