-- Phase 5: Final Tables Needing RLS Policies

-- Ticket Inventory (public read, organizers manage)
ALTER TABLE public.ticket_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view ticket inventory" 
ON public.ticket_inventory FOR SELECT 
USING (true);
CREATE POLICY "Event organizers can manage inventory" 
ON public.ticket_inventory FOR ALL 
USING (auth.uid() IN (
  SELECT events.created_by FROM public.events WHERE events.id = ticket_inventory.event_id
  UNION
  SELECT swig_circuits.user_id FROM public.swig_circuits WHERE swig_circuits.id = ticket_inventory.swig_circuit_id
) OR public.is_admin(auth.uid()));

-- Swig Circuit Check-ins (circuit owners and establishments can view)
ALTER TABLE public.swig_circuit_check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Circuit owners can view check-ins" 
ON public.swig_circuit_check_ins FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.swig_circuits sc 
  WHERE sc.id = swig_circuit_check_ins.swig_circuit_id 
  AND (sc.user_id = auth.uid() OR public.is_admin(auth.uid()))
));
CREATE POLICY "Establishments can view their check-ins" 
ON public.swig_circuit_check_ins FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.establishments e 
  WHERE e.id = swig_circuit_check_ins.establishment_id 
  AND (e.owner_id = auth.uid() OR public.is_admin(auth.uid()))
));

-- Swig Circuit Attendees (circuit owners and users can view their own)
ALTER TABLE public.swig_circuit_attendees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Circuit owners can view attendees" 
ON public.swig_circuit_attendees FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.swig_circuits sc 
  WHERE sc.id = swig_circuit_attendees.swig_circuit_id 
  AND (sc.user_id = auth.uid() OR public.is_admin(auth.uid()))
));
CREATE POLICY "Users can view their own attendance" 
ON public.swig_circuit_attendees FOR SELECT 
USING (auth.uid() = user_id);
CREATE POLICY "System can insert attendees" 
ON public.swig_circuit_attendees FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Promoter Subscriptions (promoters can manage their own)
ALTER TABLE public.promoter_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promoters can view their subscriptions" 
ON public.promoter_subscriptions FOR SELECT 
USING (auth.uid() = promoter_id);
CREATE POLICY "Promoters can update their subscriptions" 
ON public.promoter_subscriptions FOR UPDATE 
USING (auth.uid() = promoter_id);
CREATE POLICY "System can manage promoter subscriptions" 
ON public.promoter_subscriptions FOR ALL 
USING (auth.role() = 'service_role');