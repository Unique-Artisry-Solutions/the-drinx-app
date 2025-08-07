-- Level 3: Advanced Security Measures

-- 1. Device Fingerprinting for Fraud Detection
CREATE TABLE public.device_fingerprints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fingerprint_hash TEXT NOT NULL,
  device_data JSONB NOT NULL DEFAULT '{}',
  risk_score NUMERIC DEFAULT 0,
  is_trusted BOOLEAN DEFAULT false,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;

-- Create policies for device fingerprints
CREATE POLICY "Users can view their own device fingerprints" 
ON public.device_fingerprints 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert device fingerprints" 
ON public.device_fingerprints 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update device fingerprints" 
ON public.device_fingerprints 
FOR UPDATE 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_device_fingerprints_hash ON public.device_fingerprints(fingerprint_hash);
CREATE INDEX idx_device_fingerprints_user ON public.device_fingerprints(user_id);
CREATE INDEX idx_device_fingerprints_risk ON public.device_fingerprints(risk_score);

-- 2. Payment Pattern Analysis
CREATE TABLE public.payment_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_fingerprint_id UUID REFERENCES public.device_fingerprints(id) ON DELETE SET NULL,
  pattern_type TEXT NOT NULL,
  pattern_data JSONB NOT NULL DEFAULT '{}',
  anomaly_score NUMERIC DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  detection_rules JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_patterns ENABLE ROW LEVEL SECURITY;

-- Create policies for payment patterns
CREATE POLICY "Admins can view all payment patterns" 
ON public.payment_patterns 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

CREATE POLICY "System can insert payment patterns" 
ON public.payment_patterns 
FOR INSERT 
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_payment_patterns_user ON public.payment_patterns(user_id);
CREATE INDEX idx_payment_patterns_device ON public.payment_patterns(device_fingerprint_id);
CREATE INDEX idx_payment_patterns_flagged ON public.payment_patterns(is_flagged);

-- 3. Enhanced Secret Key Management
CREATE TABLE public.api_key_rotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  old_key_hash TEXT,
  new_key_hash TEXT NOT NULL,
  rotation_reason TEXT,
  rotated_by UUID REFERENCES auth.users(id),
  rotation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_rotation_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.api_key_rotations ENABLE ROW LEVEL SECURITY;

-- Create policies for key rotations
CREATE POLICY "Admins can manage key rotations" 
ON public.api_key_rotations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- 4. BIN (Bank Identification Number) Database
CREATE TABLE public.bin_database (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bin_range TEXT NOT NULL,
  card_brand TEXT,
  card_type TEXT,
  issuing_bank TEXT,
  country_code TEXT,
  country_name TEXT,
  is_restricted BOOLEAN DEFAULT false,
  risk_level TEXT DEFAULT 'low',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bin_database ENABLE ROW LEVEL SECURITY;

-- Create policies for BIN database
CREATE POLICY "System can read BIN data" 
ON public.bin_database 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage BIN data" 
ON public.bin_database 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- Create indexes for BIN lookups
CREATE INDEX idx_bin_database_range ON public.bin_database(bin_range);
CREATE INDEX idx_bin_database_country ON public.bin_database(country_code);

-- 5. Country Restrictions
CREATE TABLE public.payment_country_restrictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  restriction_type TEXT NOT NULL, -- 'blocked', 'restricted', 'allowed'
  restriction_reason TEXT,
  effective_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_country_restrictions ENABLE ROW LEVEL SECURITY;

-- Create policies for country restrictions
CREATE POLICY "System can read country restrictions" 
ON public.payment_country_restrictions 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage country restrictions" 
ON public.payment_country_restrictions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- Create unique constraint
ALTER TABLE public.payment_country_restrictions 
ADD CONSTRAINT unique_country_restriction 
UNIQUE (country_code);

-- 6. Fraud Detection Rules
CREATE TABLE public.fraud_detection_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL, -- 'velocity', 'pattern', 'amount', 'geo'
  conditions JSONB NOT NULL,
  action TEXT NOT NULL, -- 'flag', 'block', 'review'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fraud_detection_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for fraud detection rules
CREATE POLICY "Admins can manage fraud detection rules" 
ON public.fraud_detection_rules 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- Insert some default fraud detection rules
INSERT INTO public.fraud_detection_rules (rule_name, rule_type, conditions, action, severity) VALUES
('High Velocity Transactions', 'velocity', '{"max_transactions": 5, "time_window_minutes": 10}', 'flag', 'high'),
('Large Amount Transaction', 'amount', '{"threshold": 1000, "currency": "usd"}', 'review', 'medium'),
('Geographic Anomaly', 'geo', '{"max_distance_km": 1000, "time_window_hours": 1}', 'flag', 'medium'),
('Multiple Failed Attempts', 'pattern', '{"max_failures": 3, "time_window_minutes": 15}', 'block', 'high');

-- 7. Update payment audit logs with device fingerprint reference
ALTER TABLE public.payment_audit_logs 
ADD COLUMN device_fingerprint_id UUID REFERENCES public.device_fingerprints(id);

-- 8. Create function to calculate device risk score
CREATE OR REPLACE FUNCTION public.calculate_device_risk_score(
  fingerprint_data JSONB,
  user_history JSONB DEFAULT '{}'
) RETURNS NUMERIC AS $$
DECLARE
  risk_score NUMERIC := 0;
  device_age_days NUMERIC;
  failed_attempts INTEGER;
BEGIN
  -- Base risk factors
  
  -- New device penalty
  IF (fingerprint_data->>'first_seen_at')::timestamp > (now() - interval '24 hours') THEN
    risk_score := risk_score + 20;
  END IF;
  
  -- Check for suspicious user agent patterns
  IF fingerprint_data->>'user_agent' ~* '(bot|crawler|spider|headless)' THEN
    risk_score := risk_score + 50;
  END IF;
  
  -- VPN/Proxy detection (basic)
  IF fingerprint_data->>'is_vpn' = 'true' THEN
    risk_score := risk_score + 30;
  END IF;
  
  -- Failed attempts
  failed_attempts := COALESCE((user_history->>'failed_attempts')::integer, 0);
  risk_score := risk_score + (failed_attempts * 10);
  
  -- Geographic anomalies
  IF user_history->>'geo_anomaly' = 'true' THEN
    risk_score := risk_score + 25;
  END IF;
  
  -- Cap risk score at 100
  RETURN LEAST(100, risk_score);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;