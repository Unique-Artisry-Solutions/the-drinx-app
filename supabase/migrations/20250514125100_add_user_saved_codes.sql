
-- Create the user_saved_codes table
CREATE TABLE IF NOT EXISTS public.user_saved_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_id UUID NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, code_id)
);

-- Add RLS policies for user_saved_codes
ALTER TABLE public.user_saved_codes ENABLE ROW LEVEL SECURITY;

-- Allow users to select only their own saved codes
CREATE POLICY "Users can view their own saved codes" 
  ON public.user_saved_codes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own saved codes
CREATE POLICY "Users can add their own saved codes" 
  ON public.user_saved_codes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own saved codes
CREATE POLICY "Users can delete their own saved codes" 
  ON public.user_saved_codes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS user_saved_codes_user_id_idx ON public.user_saved_codes (user_id);
CREATE INDEX IF NOT EXISTS user_saved_codes_code_id_idx ON public.user_saved_codes (code_id);
