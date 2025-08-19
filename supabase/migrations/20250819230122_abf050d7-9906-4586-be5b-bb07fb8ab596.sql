-- Phase 1: SMS Notification Database Schema Setup

-- 1. Create user_phone_numbers table for SMS contact information
CREATE TABLE IF NOT EXISTS public.user_phone_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT '+1',
  is_verified BOOLEAN DEFAULT false,
  verification_code TEXT,
  verification_code_expires_at TIMESTAMPTZ,
  is_primary BOOLEAN DEFAULT false,
  sms_opt_in BOOLEAN DEFAULT false,
  sms_opt_in_date TIMESTAMPTZ,
  sms_opt_out_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create SMS template management table
CREATE TABLE IF NOT EXISTS public.sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_key TEXT UNIQUE NOT NULL,
  message_template TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create SMS delivery logs table
CREATE TABLE IF NOT EXISTS public.sms_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  message_body TEXT NOT NULL,
  provider TEXT DEFAULT 'twilio',
  provider_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  delivery_status TEXT,
  delivery_timestamp TIMESTAMPTZ,
  error_message TEXT,
  cost_amount NUMERIC(10,4),
  segments INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create SMS campaigns table
CREATE TABLE IF NOT EXISTS public.sms_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  message_template_id UUID,
  message_body TEXT NOT NULL,
  target_audience JSONB DEFAULT '{}',
  scheduled_for TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  created_by UUID NOT NULL,
  total_recipients INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  messages_delivered INTEGER DEFAULT 0,
  messages_failed INTEGER DEFAULT 0,
  campaign_cost NUMERIC(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create SMS opt-in/out tracking table
CREATE TABLE IF NOT EXISTS public.sms_consent_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  consent_type TEXT NOT NULL, -- 'opt_in', 'opt_out'
  consent_method TEXT NOT NULL, -- 'web_form', 'sms_reply', 'api'
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Add SMS delivery status to existing notifications table
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS sms_delivery_log_id UUID,
ADD COLUMN IF NOT EXISTS channels JSONB DEFAULT '[]';

-- 7. Update notification_preferences to support SMS
UPDATE public.notification_preferences 
SET channels = array_append(channels, 'sms'::text)
WHERE 'sms' != ANY(channels) AND 'sms' NOT IN (
  SELECT unnest(channels) FROM public.notification_preferences WHERE id = notification_preferences.id
);

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_phone_numbers_user_id ON public.user_phone_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_phone_numbers_phone ON public.user_phone_numbers(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_delivery_logs_user_id ON public.sms_delivery_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_delivery_logs_status ON public.sms_delivery_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_status ON public.sms_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_created_by ON public.sms_campaigns(created_by);

-- 9. Enable RLS on all SMS tables
ALTER TABLE public.user_phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.sms_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_consent_tracking ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for SMS tables

-- User phone numbers - users can manage their own
CREATE POLICY "Users can manage their phone numbers" ON public.user_phone_numbers
FOR ALL USING (auth.uid() = user_id);

-- SMS templates - admin only for creation, public read for active templates
CREATE POLICY "Admins can manage SMS templates" ON public.sms_templates
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

CREATE POLICY "Users can read active SMS templates" ON public.sms_templates
FOR SELECT USING (is_active = true);

-- SMS delivery logs - users see their own, admins see all
CREATE POLICY "Users can view their SMS delivery logs" ON public.sms_delivery_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all SMS delivery logs" ON public.sms_delivery_logs
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
);

-- SMS campaigns - creators can manage their own
CREATE POLICY "Users can manage their SMS campaigns" ON public.sms_campaigns
FOR ALL USING (auth.uid() = created_by);

-- SMS consent tracking - users can see their own
CREATE POLICY "Users can view their SMS consent history" ON public.sms_consent_tracking
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert SMS consent tracking" ON public.sms_consent_tracking
FOR INSERT WITH CHECK (true);

-- 11. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_phone_numbers_updated_at
    BEFORE UPDATE ON public.user_phone_numbers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_templates_updated_at
    BEFORE UPDATE ON public.sms_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_delivery_logs_updated_at
    BEFORE UPDATE ON public.sms_delivery_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_campaigns_updated_at
    BEFORE UPDATE ON public.sms_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Insert default SMS templates
INSERT INTO public.sms_templates (name, template_key, message_template, variables, category) VALUES
('Event Reminder', 'event_reminder', 'Hi {{name}}! Don''t forget about {{event_name}} starting at {{event_time}}. See you there!', '{"name": "string", "event_name": "string", "event_time": "string"}', 'events'),
('Ticket Confirmation', 'ticket_confirmation', 'Thanks {{name}}! Your ticket for {{event_name}} is confirmed. Ticket #{{ticket_number}}', '{"name": "string", "event_name": "string", "ticket_number": "string"}', 'tickets'),
('Last Chance Alert', 'last_chance', 'Only {{remaining_tickets}} tickets left for {{event_name}}! Get yours now: {{link}}', '{"remaining_tickets": "number", "event_name": "string", "link": "string"}', 'marketing'),
('Welcome Message', 'welcome', 'Welcome to {{app_name}}, {{name}}! Reply STOP to opt out of SMS notifications.', '{"app_name": "string", "name": "string"}', 'onboarding')
ON CONFLICT (template_key) DO NOTHING;

-- 13. Create SMS statistics view
CREATE OR REPLACE VIEW public.sms_campaign_stats AS
SELECT 
  c.id,
  c.name,
  c.status,
  c.total_recipients,
  c.messages_sent,
  c.messages_delivered,
  c.messages_failed,
  CASE 
    WHEN c.messages_sent > 0 
    THEN ROUND((c.messages_delivered::NUMERIC / c.messages_sent) * 100, 2)
    ELSE 0
  END as delivery_rate_percent,
  c.campaign_cost,
  c.created_at,
  c.scheduled_for
FROM public.sms_campaigns c;