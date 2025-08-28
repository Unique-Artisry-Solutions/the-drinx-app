-- Create notification deduplication log table for idempotency
CREATE TABLE public.notification_dedup_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idempotency_key text NOT NULL UNIQUE,
  notification_id uuid,
  operation_type text NOT NULL,
  request_hash text NOT NULL,
  trace_id text NOT NULL,
  status text NOT NULL DEFAULT 'processing',
  response_data jsonb,
  error_details jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days')
);

-- Enable RLS
ALTER TABLE public.notification_dedup_log ENABLE ROW LEVEL SECURITY;

-- Create policies for the dedup log
CREATE POLICY "Service can manage dedup log"
ON public.notification_dedup_log
FOR ALL
USING (true);

-- Create index for fast lookups
CREATE INDEX idx_notification_dedup_key ON public.notification_dedup_log(idempotency_key);
CREATE INDEX idx_notification_dedup_expires ON public.notification_dedup_log(expires_at) WHERE status = 'completed';

-- Add cleanup function for expired records
CREATE OR REPLACE FUNCTION public.cleanup_notification_dedup_log()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.notification_dedup_log 
  WHERE expires_at < now() AND status = 'completed';
END;
$$;