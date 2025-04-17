
import { Feature, FeatureItem } from '../../types';
import { matchesAnyKeyword } from './index';

export const isSwigCircuitFeature = (feature: FeatureItem): boolean => {
  const keywords = [
    'swig', 'circuit', 'bar crawl', 'bar-crawl', 'swigcircuit', 
    'drink route', 'booze tour', 'pub crawl', 'bar tour',
    'swig experience', 'circuits', 'multi venue'
  ];
  
  return matchesAnyKeyword(feature, keywords);
};

export const isBarCrawlFeature = (feature: FeatureItem): boolean => {
  const keywords = [
    'bar crawl', 'bar-crawl', 'pub crawl', 'crawl', 'venues', 
    'route', 'tour', 'multi-venue', 'establishment tour'
  ];
  
  return matchesAnyKeyword(feature, keywords);
};

export const isVipFeature = (feature: FeatureItem): boolean => {
  const keywords = [
    'vip', 'premium', 'exclusive', 'package', 'special access',
    'priority', 'skip line', 'priority seating', 'meet and greet',
    'merchandise', 'free drinks', 'complimentary', 'special perks',
    'vip wizard', 'vip experience', 'tier'
  ];
  
  return matchesAnyKeyword(feature, keywords);
};
