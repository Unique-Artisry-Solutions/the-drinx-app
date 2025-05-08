
/**
 * Feature access caching layer
 * 
 * This module provides client-side caching for feature access checks
 * to reduce the number of API calls and improve performance.
 */

import { FeatureId } from './registry';

interface CacheEntry {
  value: boolean;
  timestamp: number;
}

/**
 * In-memory cache for feature access results
 */
const featureAccessCache = new Map<string, CacheEntry>();

/**
 * TTL in milliseconds for feature access cache (5 minutes)
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Get a cached feature access result
 */
export function getCachedFeatureAccess(userId: string, featureId: FeatureId): boolean | null {
  if (!userId) return null;
  
  const cacheKey = `${userId}:${featureId}`;
  const cacheEntry = featureAccessCache.get(cacheKey);
  
  if (!cacheEntry) return null;
  
  // Check if cache entry has expired
  if (Date.now() - cacheEntry.timestamp > CACHE_TTL) {
    featureAccessCache.delete(cacheKey);
    return null;
  }
  
  return cacheEntry.value;
}

/**
 * Store feature access result in cache
 */
export function cacheFeatureAccess(userId: string, featureId: FeatureId, hasAccess: boolean): void {
  if (!userId) return;
  
  const cacheKey = `${userId}:${featureId}`;
  featureAccessCache.set(cacheKey, {
    value: hasAccess,
    timestamp: Date.now(),
  });
}

/**
 * Clear the feature access cache for a specific user
 */
export function clearFeatureAccessCache(userId?: string): void {
  if (userId) {
    // Remove all entries for this userId
    for (const key of featureAccessCache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        featureAccessCache.delete(key);
      }
    }
  } else {
    // Clear entire cache
    featureAccessCache.clear();
  }
}

/**
 * Clear the feature access cache for a specific feature
 */
export function clearFeatureCache(featureId: FeatureId): void {
  for (const key of featureAccessCache.keys()) {
    if (key.endsWith(`:${featureId}`)) {
      featureAccessCache.delete(key);
    }
  }
}
