-- Add public read access policy for system_settings to allow cart functionality
CREATE POLICY "Public read access for system settings" 
ON public.system_settings 
FOR SELECT 
USING (true);