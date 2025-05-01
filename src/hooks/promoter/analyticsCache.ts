
import { AnalyticsCache } from './types';

// Cache duration in milliseconds (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

// In-memory analytics cache
const analyticsCache: Record<string, AnalyticsCache> = {};

/**
 * Analytics cache utility to improve performance and reduce API calls
 */
export const PromoterAnalyticsCache = {
  /**
   * Get cached data if it exists and is still valid
   */
  get: (cacheKey: string): AnalyticsCache | null => {
    if (!cacheKey) return null;
    
    const cachedData = analyticsCache[cacheKey];
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY_MS)) {
      console.log("Using cached promoter analytics data");
      return cachedData;
    }
    
    return null;
  },
  
  /**
   * Store data in the cache
   */
  set: (cacheKey: string, data: Omit<AnalyticsCache, 'timestamp'>): void => {
    if (!cacheKey) return;
    
    analyticsCache[cacheKey] = {
      ...data,
      timestamp: Date.now()
    };
  },
  
  /**
   * Remove specific entry from cache
   */
  invalidate: (cacheKey: string): void => {
    if (cacheKey && analyticsCache[cacheKey]) {
      delete analyticsCache[cacheKey];
    }
  },
  
  /**
   * Create a cache key from promoter ID and date range
   */
  createKey: (promoterId: string, startDate?: Date, endDate?: Date): string => {
    if (!promoterId) return '';
    
    const start = startDate ? startDate.toISOString().split('T')[0] : '';
    const end = endDate ? endDate.toISOString().split('T')[0] : '';
    
    return `${promoterId}-${start}-${end}`;
  }
};
