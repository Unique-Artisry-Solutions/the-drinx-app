
import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

// Audience relationship mapping features
export const isAudienceRelationshipFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'relationship', 'mapping', 'network', 'connection', 
    'influence', 'influencer', 'link', 'relation',
    'audience relationship', 'user graph', 'social network',
    'segment relationship', 'audience network'
  ]);
};

// Audience influencer features
export const isAudienceInfluencerFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'influencer', 'influential', 'impact', 'follower',
    'key user', 'leader', 'ambassador', 'advocate',
    'audience influencer', 'brand ambassador'
  ]);
};

// Cross-segment engagement features
export const isCrossSegmentEngagementFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'cross-segment', 'between segments', 'segment correlation',
    'segment engagement', 'segment interaction', 'segment overlap',
    'cross audience', 'audience crossover', 'segment bridge'
  ]);
};

// Audience visualization features
export const isAudienceVisualizationFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'visualization', 'diagram', 'graph', 'chart', 'map',
    'network view', 'audience map', 'relationship view',
    'visual analytics', 'segment visualization', 'network graph'
  ]);
};
