
import { supabase } from '@/integrations/supabase/client';

export async function createRewardRPC() {
  const { error } = await supabase.rpc('update_user_points', {
    p_user_id: '00000000-0000-0000-0000-000000000000', // Dummy call to ensure function exists
    p_points: 0
  });

  if (error) {
    console.error('Error verifying reward RPC function:', error);
  }
}
