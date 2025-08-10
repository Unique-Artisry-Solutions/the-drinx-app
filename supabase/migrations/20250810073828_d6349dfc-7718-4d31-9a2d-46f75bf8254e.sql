-- Grant execute to authenticated for reward point update RPCs required by redemption flows
GRANT EXECUTE ON FUNCTION public.update_user_points(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.batch_update_user_points(jsonb) TO authenticated;