
import { supabase } from '@/integrations/supabase/client';

export async function createRewardRPC() {
  await supabase.rpc('create_reward_function', {
    function_name: 'update_user_points',
    function_code: `
    CREATE OR REPLACE FUNCTION update_user_points(p_user_id UUID, p_points INTEGER)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      -- Update points balance
      UPDATE user_rewards
      SET 
        points = GREATEST(0, points + p_points),
        lifetime_points = CASE WHEN p_points > 0 THEN lifetime_points + p_points ELSE lifetime_points END,
        updated_at = now()
      WHERE user_id = p_user_id;

      -- If no record exists, create one
      IF NOT FOUND THEN
        INSERT INTO user_rewards (user_id, points, lifetime_points)
        VALUES (p_user_id, GREATEST(0, p_points), CASE WHEN p_points > 0 THEN p_points ELSE 0 END);
      END IF;
    END;
    $$;
    `
  });
}
