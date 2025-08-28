-- Lock down PII in public.profiles table
-- Users should only see their own full profile; public view exposes sanitized data only

-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create admin check helper function with security definer to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin(p_uid uuid)
RETURNS boolean 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT user_type = 'admin' FROM public.profiles WHERE id = p_uid), false)
$$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS profiles_select_self ON public.profiles;
DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;

-- Create new restrictive policies
-- SELECT: Users can only see their own profile (or admins can see all)
CREATE POLICY profiles_select_self ON public.profiles
  FOR SELECT 
  USING (id = auth.uid() OR public.is_admin(auth.uid()));

-- UPDATE: Users can only update their own profile (or admins can update any)
CREATE POLICY profiles_update_self ON public.profiles
  FOR UPDATE 
  USING (id = auth.uid() OR public.is_admin(auth.uid()));

-- INSERT: Users can only insert their own profile
CREATE POLICY profiles_insert_self ON public.profiles
  FOR INSERT 
  WITH CHECK (id = auth.uid());

-- Lock direct table access from anon/authenticated roles
-- (service_role still has access via JWT bypass)
REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;

-- Create public-safe view exposing only non-sensitive data
DROP VIEW IF EXISTS public.profiles_public_v;
CREATE VIEW public.profiles_public_v
  WITH (security_invoker = true) AS
SELECT 
  id,
  display_name,
  username,
  bio,
  created_at,
  user_type
FROM public.profiles
WHERE id IS NOT NULL; -- Basic filter to ensure valid records

-- Grant select access on the public view
GRANT SELECT ON public.profiles_public_v TO anon, authenticated;

-- Create index for performance on the profiles table if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;

-- Add comment for documentation
COMMENT ON VIEW public.profiles_public_v IS 'Public-safe view of user profiles excluding PII data like phone numbers, private settings, etc.';
COMMENT ON POLICY profiles_select_self ON public.profiles IS 'Users can only view their own profile or admins can view any profile';
COMMENT ON POLICY profiles_update_self ON public.profiles IS 'Users can only update their own profile or admins can update any profile';
COMMENT ON POLICY profiles_insert_self ON public.profiles IS 'Users can only create their own profile record';