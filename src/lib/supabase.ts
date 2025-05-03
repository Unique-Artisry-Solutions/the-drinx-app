
import { supabase as supabaseClient, getSessionDebug, trackAuthStateChange } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Re-export the supabase client and helper functions for backwards compatibility
export const supabase = supabaseClient;
export { getSessionDebug, trackAuthStateChange };

// Use a type-safe approach for fromTable
export function fromTable<T extends keyof Database['public']['Tables']>(tableName: T) {
  return supabase.from(tableName);
}
