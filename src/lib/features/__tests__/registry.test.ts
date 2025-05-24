
import { describe, it, expect } from 'vitest';
import { FEATURES, getFeature, getFeaturesForTier, getFeaturesForCategory, featuresByTier } from '../registry';

describe('Feature Registry', () => {
  it('should export feature constants', () => {
    expect(FEATURES).toBeDefined();
    expect(Object.keys(FEATURES).length).toBeGreaterThan(0);
  });

  it('should be able to get features by ID', () => {
    const advancedAnalytics = getFeature(FEATURES.ADVANCED_ANALYTICS);
    expect(advancedAnalytics).toBeDefined();
    expect(advancedAnalytics?.name).toBe('Advanced Analytics');
    expect(advancedAnalytics?.category).toBe('analytics');
  });

  it('should return undefined for unknown feature IDs', () => {
    const unknownFeature = getFeature('UNKNOWN_FEATURE' as any);
    expect(unknownFeature).toBeUndefined();
  });

  it('should get features for specific tier', () => {
    const basicFeatures = getFeaturesForTier('basic');
    expect(basicFeatures).toBeInstanceOf(Array);
    expect(basicFeatures.length).toBeGreaterThan(0);
    
    // Check that all features in the basic tier have appropriate properties
    basicFeatures.forEach(feature => {
      expect(feature.id).toBeDefined();
      expect(feature.name).toBeDefined();
      expect(feature.description).toBeDefined();
    });
  });

  it('should get features for a specific category', () => {
    const analyticsFeatures = getFeaturesForCategory('analytics');
    expect(analyticsFeatures).toBeInstanceOf(Array);
    
    // All features in this category should have the correct category
    analyticsFeatures.forEach(feature => {
      expect(feature.category).toBe('analytics');
    });
  });

  it('should have consistent tier mappings', () => {
    // Premium tier should include all basic tier features
    const basicFeatureIds = featuresByTier['basic'];
    const premiumFeatureIds = featuresByTier['premium'];
    
    basicFeatureIds.forEach(featureId => {
      expect(premiumFeatureIds).toContain(featureId);
    });
    
    // VIP tier should include all premium tier features
    const vipFeatureIds = featuresByTier['vip'];
    premiumFeatureIds.forEach(featureId => {
      expect(vipFeatureIds).toContain(featureId);
    });
  });
});
