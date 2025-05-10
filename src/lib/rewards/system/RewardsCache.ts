
import { supabase } from '@/lib/supabase';

interface CacheStatus {
  cache_key: string;
  last_updated: string;
  expires_at: string | null;
  is_invalidated: boolean;
  ttl_seconds: number;
  metadata?: {
    cached_data?: string;
    [key: string]: any;
  };
}

export class RewardsCache {
  /**
   * Get the status of a cached item
   * @param cacheKey - Unique identifier for the cached item
   * @returns Cache status object or null if not found
   */
  static async getCacheStatus(cacheKey: string): Promise<CacheStatus | null> {
    try {
      const { data, error } = await supabase
        .from('reward_cache_control')
        .select('*')
        .eq('cache_key', cacheKey)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching cache status:', error);
        return null;
      }
      
      return data as CacheStatus | null;
    } catch (error) {
      console.error('Unexpected error in getCacheStatus:', error);
      return null;
    }
  }
  
  /**
   * Update or create a cached item
   * @param cacheKey - Unique identifier for the cached item
   * @param ttlSeconds - Time to live in seconds
   * @param data - Data to cache
   * @returns true if successful
   */
  static async updateCache(
    cacheKey: string, 
    ttlSeconds: number = 300, 
    data: any
  ): Promise<boolean> {
    try {
      // Calculate expiration time
      const now = new Date();
      const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
      
      // Check if cache entry exists
      const { data: existing, error: checkError } = await supabase
        .from('reward_cache_control')
        .select('id')
        .eq('cache_key', cacheKey)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') { // Not found is okay
        console.error('Error checking existing cache:', checkError);
        return false;
      }
      
      const cacheData = {
        last_updated: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_invalidated: false,
        ttl_seconds: ttlSeconds,
        metadata: {
          cached_data: JSON.stringify(data)
        }
      };
      
      if (existing) {
        // Update existing cache
        const { error: updateError } = await supabase
          .from('reward_cache_control')
          .update(cacheData)
          .eq('id', existing.id);
          
        if (updateError) {
          console.error('Error updating cache:', updateError);
          return false;
        }
      } else {
        // Insert new cache entry
        const { error: insertError } = await supabase
          .from('reward_cache_control')
          .insert({
            cache_key: cacheKey,
            ...cacheData
          });
          
        if (insertError) {
          console.error('Error inserting cache:', insertError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error in updateCache:', error);
      return false;
    }
  }
  
  /**
   * Invalidate a cached item
   * @param cacheKey - Unique identifier for the cached item
   * @returns true if successful
   */
  static async invalidate(cacheKey: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reward_cache_control')
        .update({
          is_invalidated: true,
          last_updated: new Date().toISOString()
        })
        .eq('cache_key', cacheKey);
        
      if (error) {
        console.error('Error invalidating cache:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error in invalidateCache:', error);
      return false;
    }
  }
  
  /**
   * Clear expired cache entries
   * @returns Number of entries cleared
   */
  static async clearExpired(): Promise<number> {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('reward_cache_control')
        .delete()
        .lt('expires_at', now)
        .select('id');
        
      if (error) {
        console.error('Error clearing expired cache:', error);
        return 0;
      }
      
      return data?.length || 0;
    } catch (error) {
      console.error('Unexpected error in clearExpiredCache:', error);
      return 0;
    }
  }
}
