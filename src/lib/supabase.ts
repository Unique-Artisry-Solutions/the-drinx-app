
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Re-export the supabase client for backwards compatibility
export const supabase = supabaseClient;

// Use a type-safe approach for fromTable
export function fromTable<T extends keyof Database['public']['Tables']>(tableName: T) {
  return supabase.from(tableName);
}
