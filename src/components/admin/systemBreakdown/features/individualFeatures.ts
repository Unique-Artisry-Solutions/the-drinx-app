
import { FeatureItem } from '../types';
import { rewardProgramFeature } from './rewardSystem/rewardFeature';
import { mocktailSuggestionsFeature } from './individualFeatures/mocktailSuggestions';
import { cocktailSwapsFeature } from './individualFeatures/cocktailSwaps';
import { socialFeatureItem } from './individualFeatures/socialFeature';
import { visitTrackingFeature } from './individualFeatures/visitTracking';
import { mapIntegrationFeature } from './individualFeatures/mapIntegration';
import { mobileViewFeature } from './individualFeatures/mobileView';
import { userSearchFeature } from './individualFeatures/userSearch';
import { achievementSystemFeature } from './individualFeatures/achievementSystem';
import { swigCircuitsFeature } from './individualFeatures/swigCircuits';

export const individualFeatures: FeatureItem[] = [
  rewardProgramFeature,
  mocktailSuggestionsFeature,
  cocktailSwapsFeature,
  socialFeatureItem,
  visitTrackingFeature,
  mapIntegrationFeature,
  mobileViewFeature,
  userSearchFeature,
  achievementSystemFeature,
  swigCircuitsFeature
];
