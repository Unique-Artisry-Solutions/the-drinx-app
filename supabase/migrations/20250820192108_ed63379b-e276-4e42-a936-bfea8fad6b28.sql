-- Fix the check_thread_participants function to use the role system instead of user_type
CREATE OR REPLACE FUNCTION public.check_thread_participants()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Check if promoter exists and has active promoter role
  IF NOT public.has_active_role(NEW.promoter_id, 'promoter') THEN
    RAISE EXCEPTION 'Invalid promoter_id: User must be a promoter';
  END IF;

  -- Check if venue exists
  IF NOT EXISTS (
    SELECT 1 FROM establishments 
    WHERE id = NEW.venue_id
  ) THEN
    RAISE EXCEPTION 'Invalid venue_id: Establishment must exist';
  END IF;

  RETURN NEW;
END;
$function$;