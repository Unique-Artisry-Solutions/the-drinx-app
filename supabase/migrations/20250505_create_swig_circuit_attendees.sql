
-- Create the swig_circuit_attendees table
CREATE TABLE IF NOT EXISTS public.swig_circuit_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swig_circuit_id UUID REFERENCES public.swig_circuits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ticket_type_id UUID REFERENCES public.swig_circuit_ticket_tiers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  quantity INTEGER NOT NULL DEFAULT 1,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.swig_circuit_attendees ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own attendance records
CREATE POLICY "Users can view their own attendance records"
  ON public.swig_circuit_attendees
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow circuit owners to view attendee records for their circuits
CREATE POLICY "Circuit owners can view their attendees"
  ON public.swig_circuit_attendees
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.swig_circuits 
      WHERE id = swig_circuit_id
    )
  );

-- Allow the edge functions to insert new attendees with service role
CREATE POLICY "Service can insert new attendees"
  ON public.swig_circuit_attendees
  FOR INSERT
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS swig_circuit_attendees_circuit_id_idx 
  ON public.swig_circuit_attendees(swig_circuit_id);

CREATE INDEX IF NOT EXISTS swig_circuit_attendees_user_id_idx 
  ON public.swig_circuit_attendees(user_id);
