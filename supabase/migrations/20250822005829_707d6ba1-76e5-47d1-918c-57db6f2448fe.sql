-- Create a partial unique index instead of a full constraint
-- This only prevents duplicates for active threads (is_archived = false)
CREATE UNIQUE INDEX unique_active_promoter_venue_thread_idx 
ON promoter_venue_threads (promoter_id, venue_id) 
WHERE is_archived = false;

-- Create the improved get_or_create_thread function
CREATE OR REPLACE FUNCTION get_or_create_thread(
  p_promoter_id UUID,
  p_venue_id UUID
) 
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  thread_id UUID;
BEGIN
  -- Try to find existing active thread
  SELECT id INTO thread_id
  FROM promoter_venue_threads
  WHERE promoter_id = p_promoter_id 
    AND venue_id = p_venue_id 
    AND is_archived = false;
  
  -- If found, return it
  IF thread_id IS NOT NULL THEN
    RETURN thread_id;
  END IF;
  
  -- Try to create new thread
  BEGIN
    INSERT INTO promoter_venue_threads (promoter_id, venue_id, is_archived)
    VALUES (p_promoter_id, p_venue_id, false)
    RETURNING id INTO thread_id;
    
    RETURN thread_id;
  EXCEPTION 
    WHEN unique_violation THEN
      -- If constraint violation (another thread was created concurrently),
      -- query again for the existing thread
      SELECT id INTO thread_id
      FROM promoter_venue_threads
      WHERE promoter_id = p_promoter_id 
        AND venue_id = p_venue_id 
        AND is_archived = false;
      
      RETURN thread_id;
  END;
END;
$$;