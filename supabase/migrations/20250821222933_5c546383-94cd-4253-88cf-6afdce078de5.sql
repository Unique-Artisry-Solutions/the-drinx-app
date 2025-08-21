-- Create promoter_subscriptions table that's referenced by the check_feature_access function
CREATE TABLE IF NOT EXISTS public.promoter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promoter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier text NOT NULL DEFAULT 'free',
  is_active boolean NOT NULL DEFAULT false,
  started_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  billing_cycle_days integer DEFAULT 30,
  features jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promoter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for promoter_subscriptions
CREATE POLICY "Promoters can view their own subscriptions"
  ON public.promoter_subscriptions FOR SELECT
  USING (auth.uid() = promoter_id);

CREATE POLICY "Promoters can update their own subscriptions"
  ON public.promoter_subscriptions FOR UPDATE
  USING (auth.uid() = promoter_id);

-- System can manage subscriptions for service operations
CREATE POLICY "System can manage promoter subscriptions"
  ON public.promoter_subscriptions FOR ALL
  USING (true);

-- Create check_feature_access RPC function
CREATE OR REPLACE FUNCTION public.check_feature_access(
  p_feature_name text,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_type text;
  has_subscription boolean := false;
  subscription_tier text := 'free';
BEGIN
  -- Return false if no user ID provided
  IF p_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Get user type from profiles
  SELECT p.user_type INTO user_type
  FROM public.profiles p
  WHERE p.id = p_user_id;

  -- If no profile found, return false
  IF user_type IS NULL THEN
    RETURN false;
  END IF;

  -- Check for active subscription if user is a promoter
  IF user_type = 'promoter' THEN
    SELECT 
      CASE WHEN ps.is_active AND (ps.expires_at IS NULL OR ps.expires_at > now()) THEN true ELSE false END,
      COALESCE(ps.subscription_tier, 'free')
    INTO has_subscription, subscription_tier
    FROM public.promoter_subscriptions ps
    WHERE ps.promoter_id = p_user_id
    ORDER BY ps.created_at DESC
    LIMIT 1;
  END IF;

  -- Feature access logic based on user type and subscription
  CASE p_feature_name
    WHEN 'ADVANCED_ANALYTICS' THEN
      RETURN (user_type = 'admin') OR 
             (user_type = 'promoter' AND subscription_tier IN ('premium', 'pro')) OR
             (user_type = 'establishment');
    
    WHEN 'BULK_MESSAGING' THEN
      RETURN (user_type = 'admin') OR 
             (user_type = 'promoter' AND subscription_tier IN ('premium', 'pro'));
    
    WHEN 'PRIORITY_SUPPORT' THEN
      RETURN (user_type = 'admin') OR 
             (subscription_tier IN ('premium', 'pro'));
    
    WHEN 'API_ACCESS' THEN
      RETURN (user_type = 'admin') OR 
             (user_type = 'promoter' AND subscription_tier = 'pro');
    
    WHEN 'CUSTOM_BRANDING' THEN
      RETURN (user_type = 'admin') OR 
             (subscription_tier = 'pro');
    
    -- Admin-only features
    WHEN 'SYSTEM_ADMIN' THEN
      RETURN (user_type = 'admin');
    
    -- Basic features available to all authenticated users
    ELSE
      RETURN true;
  END CASE;
END;
$$;