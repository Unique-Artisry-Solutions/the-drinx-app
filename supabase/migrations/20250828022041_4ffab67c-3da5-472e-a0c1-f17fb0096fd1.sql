-- Create webhook_events table for idempotency tracking
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL,
  livemode BOOLEAN NOT NULL DEFAULT false,
  api_version TEXT,
  CONSTRAINT unique_event_id UNIQUE (event_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events (event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON public.webhook_events (processed_at);

-- Enable RLS
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Only system/service can manage webhook events
CREATE POLICY "Service role can manage webhook events" ON public.webhook_events
FOR ALL USING (true);

-- Clean up old webhook events (older than 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_webhook_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.webhook_events 
  WHERE processed_at < now() - interval '30 days';
END;
$$;