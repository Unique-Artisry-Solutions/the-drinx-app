
import { supabase } from '@/lib/supabase';

interface CacheStatus {
  is_invalidated: boolean;
  ttl_seconds: number;
  last_updated: string;
  metadata?: any;
}

export class RewardsCache {
  /**
   * Check if a cache entry is valid
   */
  static async getCacheStatus(cacheKey: string): Promise<CacheStatus | null> {
    try {
      const { data, error } = await supabase
        .from('reward_cache_control')
        .select('*')
        .eq('cache_key', cacheKey)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') { // Not found error
          return null;
        }
        console.error('Error checking cache status:', error);
        return null;
      }
      
      return {
        is_invalidated: data.is_invalidated,
        ttl_seconds: data.ttl_seconds,
        last_updated: data.last_updated,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Exception in getCacheStatus:', error);
      return null;
    }
  }
  
  /**
   * Update or create a cache entry
   */
  static async updateCache(cacheKey: string, ttl: number, cached_data: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reward_cache_control')
        .upsert({
          cache_key: cacheKey,
          ttl_seconds: ttl,
          last_updated: new Date().toISOString(),
          is_invalidated: false,
          metadata: { cached_data: JSON.stringify(cached_data) }
        });
        
      if (error) {
        console.error('Error updating cache:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception in updateCache:', error);
      return false;
    }
  }
  
  /**
   * Invalidate a cache entry
   */
  static async invalidateCache(cacheKey: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reward_cache_control')
        .update({ is_invalidated: true })
        .eq('cache_key', cacheKey);
        
      if (error) {
        console.error('Error invalidating cache:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception in invalidateCache:', error);
      return false;
    }
  }
  
  /**
   * Check if a cache entry is stale based on TTL
   */
  static isCacheStale(status: CacheStatus): boolean {
    if (!status || status.is_invalidated) {
      return true;
    }
    
    const lastUpdated = new Date(status.last_updated).getTime();
    const now = new Date().getTime();
    const ttlMs = status.ttl_seconds * 1000;
    
    return (now - lastUpdated) > ttlMs;
  }
}
