
-- Create event notification schedules table
CREATE TABLE IF NOT EXISTS public.event_notification_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority notification_priority NOT NULL DEFAULT 'medium',
  scheduled_for TIMESTAMPTZ NOT NULL,
  location_based BOOLEAN NOT NULL DEFAULT false,
  coordinates JSONB,
  target_radius INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.event_notification_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event creators can manage their event notifications"
  ON public.event_notification_schedules
  USING (auth.uid() IN (
    SELECT created_by FROM public.events WHERE id = event_id
  ));

-- Add trigger for updated_at
CREATE TRIGGER set_timestamp_event_notification_schedules
  BEFORE UPDATE ON public.event_notification_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
