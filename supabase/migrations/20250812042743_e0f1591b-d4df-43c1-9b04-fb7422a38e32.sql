-- Phase 2 support: ensure event_notification_schedules table and dependencies exist
-- Create enum type for notification priority if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'notification_priority' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.notification_priority AS ENUM ('low','medium','high','urgent');
  END IF;
END $$;

-- Create/update helper function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create event_notification_schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.event_notification_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority public.notification_priority NOT NULL DEFAULT 'medium',
  scheduled_for TIMESTAMPTZ NOT NULL,
  location_based BOOLEAN NOT NULL DEFAULT false,
  coordinates JSONB,
  target_radius INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_notification_schedules ENABLE ROW LEVEL SECURITY;

-- Create policy (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'event_notification_schedules'
      AND policyname = 'Event creators can manage their event notifications'
  ) THEN
    CREATE POLICY "Event creators can manage their event notifications"
      ON public.event_notification_schedules
      USING (
        auth.uid() IN (
          SELECT created_by FROM public.events WHERE id = event_id
        )
      );
  END IF;
END $$;

-- Create trigger to maintain updated_at (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_event_notification_schedules'
  ) THEN
    CREATE TRIGGER set_timestamp_event_notification_schedules
      BEFORE UPDATE ON public.event_notification_schedules
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
