-- Step 1: Create helper function to check active roles
CREATE OR REPLACE FUNCTION public.has_active_role(p_user_id uuid, p_role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = p_user_id
      AND role::text = p_role
      AND is_active = true
  );
$$;

-- Step 2: Drop and recreate the problematic RLS policy for promoter_venue_threads
DROP POLICY IF EXISTS "Promoters can create threads" ON public.promoter_venue_threads;

CREATE POLICY "Promoters can create threads"
ON public.promoter_venue_threads
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = promoter_id) AND 
  public.has_active_role(auth.uid(), 'promoter')
);

-- Step 3: Check and update any other policies that might reference profiles.user_type
-- Update promoter_venue_messages policies if they exist and have similar issues
DROP POLICY IF EXISTS "Promoters can send messages" ON public.promoter_venue_messages;

CREATE POLICY "Promoters can send messages"
ON public.promoter_venue_messages
FOR INSERT
TO authenticated
WITH CHECK (
  is_from_promoter = true AND
  EXISTS (
    SELECT 1 FROM public.promoter_venue_threads t 
    WHERE t.id = thread_id AND t.promoter_id = auth.uid()
  )
);

-- Ensure venues can also send messages (reply)
DROP POLICY IF EXISTS "Venues can send messages" ON public.promoter_venue_messages;

CREATE POLICY "Venues can send messages"
ON public.promoter_venue_messages
FOR INSERT
TO authenticated
WITH CHECK (
  is_from_promoter = false AND
  EXISTS (
    SELECT 1 FROM public.promoter_venue_threads t 
    JOIN public.establishments e ON e.id = t.venue_id
    WHERE t.id = thread_id AND e.owner_id = auth.uid()
  )
);