-- Add RLS policy to allow promoters to view establishment owner profiles
-- This enables contact fetching functionality while maintaining security

CREATE POLICY "Promoters can view establishment owner profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow promoters to view profiles of establishment owners
  EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'promoter' 
    AND ur.is_active = true
  )
  AND EXISTS (
    SELECT 1 
    FROM public.establishments e
    WHERE e.owner_id = profiles.id
  )
);