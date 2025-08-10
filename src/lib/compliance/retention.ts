import { supabase } from '@/integrations/supabase/client';

export async function runRetentionCleanup() {
  const { data, error } = await supabase.functions.invoke('run-retention-cleanup');
  if (error) {
    console.error('run-retention-cleanup error', error);
    return { success: false, error };
  }
  return { success: true, data };
}
