
import { supabase } from '@/lib/supabase';

export class RewardsCache {
  static async getCacheStatus(key: string) {
    const { data, error } = await supabase
      .from('reward_cache_control')
      .select()
      .eq('cache_key', key)
      .single();

    if (error) {
      console.error('Error checking cache status:', error);
      return null;
    }

    return data;
  }

  static async invalidateCache(key: string) {
    const { error } = await supabase
      .from('reward_cache_control')
      .upsert({
        cache_key: key,
        last_updated: new Date().toISOString(),
        is_invalidated: true
      });

    if (error) {
      console.error('Error invalidating cache:', error);
    }
  }

  static async updateCache(key: string, ttlSeconds?: number, cachedData?: any) {
    const metadata = cachedData ? { cached_data: JSON.stringify(cachedData) } : undefined;
    
    const { error } = await supabase
      .from('reward_cache_control')
      .upsert({
        cache_key: key,
        last_updated: new Date().toISOString(),
        is_invalidated: false,
        ttl_seconds: ttlSeconds || 300,
        metadata: metadata
      });

    if (error) {
      console.error('Error updating cache:', error);
    }
  }
}
