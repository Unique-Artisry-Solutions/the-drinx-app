
import { FeatureId } from './registry';

// In-memory cache for feature access results
const featureAccessCache: Record<string, {
  result: boolean;
  timestamp: number;
}> = {};

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Store feature access result in cache
export function cacheFeatureAccess(featureId: FeatureId, hasAccess: boolean): void {
  featureAccessCache[featureId] = {
    result: hasAccess,
    timestamp: Date.now()
  };
}

// Get cached feature access result (if still valid)
export function getCachedFeatureAccess(featureId: FeatureId): boolean | null {
  const cached = featureAccessCache[featureId];
  
  // Return null if not cached or cache expired
  if (!cached || Date.now() - cached.timestamp > CACHE_TTL) {
    return null;
  }
  
  return cached.result;
}

// Clear all cached feature access results
export function clearFeatureAccessCache(): void {
  Object.keys(featureAccessCache).forEach(key => {
    delete featureAccessCache[key];
  });
}
