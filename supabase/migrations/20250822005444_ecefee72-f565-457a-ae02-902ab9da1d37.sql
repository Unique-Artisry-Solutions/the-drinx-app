-- Phase 1: Add unique constraint to prevent duplicate threads
-- First, create a function to merge duplicate threads before adding the constraint
CREATE OR REPLACE FUNCTION merge_duplicate_threads()
RETURNS TABLE(merged_count INTEGER, deleted_threads UUID[])
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  duplicate_record RECORD;
  primary_thread_id UUID;
  secondary_thread_ids UUID[];
  merged_total INTEGER := 0;
  all_deleted_threads UUID[] := ARRAY[]::UUID[];
BEGIN
  -- Find and merge duplicate threads
  FOR duplicate_record IN
    SELECT promoter_id, venue_id, array_agg(id ORDER BY created_at ASC) as thread_ids
    FROM promoter_venue_threads 
    WHERE is_archived = false
    GROUP BY promoter_id, venue_id 
    HAVING COUNT(*) > 1
  LOOP
    -- Take the first (oldest) thread as primary
    primary_thread_id := duplicate_record.thread_ids[1];
    secondary_thread_ids := duplicate_record.thread_ids[2:];
    
    -- Move all messages from secondary threads to primary thread
    UPDATE promoter_venue_messages 
    SET thread_id = primary_thread_id 
    WHERE thread_id = ANY(secondary_thread_ids);
    
    -- Archive secondary threads instead of deleting to preserve history
    UPDATE promoter_venue_threads 
    SET is_archived = true, updated_at = now()
    WHERE id = ANY(secondary_thread_ids);
    
    merged_total := merged_total + array_length(secondary_thread_ids, 1);
    all_deleted_threads := all_deleted_threads || secondary_thread_ids;
  END LOOP;
  
  RETURN QUERY SELECT merged_total, all_deleted_threads;
END;
$$;

-- Run the deduplication
SELECT * FROM merge_duplicate_threads();

-- Phase 2: Add unique constraint to prevent future duplicates
-- This constraint ensures only one active thread per promoter-venue pair
ALTER TABLE promoter_venue_threads 
ADD CONSTRAINT unique_active_promoter_venue_thread 
UNIQUE (promoter_id, venue_id, is_archived) 
DEFERRABLE INITIALLY DEFERRED;

-- Phase 3: Create function to safely get or create thread
CREATE OR REPLACE FUNCTION get_or_create_thread(
  p_promoter_id UUID,
  p_venue_id UUID
) 
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
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