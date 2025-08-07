-- Level 4: Compliance Features
-- PCI DSS Compliance and GDPR/Privacy Compliance

-- Data retention policies for PCI DSS compliance
CREATE TABLE public.data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type TEXT NOT NULL, -- 'payment_logs', 'audit_logs', 'user_data', etc.
  retention_period_days INTEGER NOT NULL,
  auto_deletion_enabled BOOLEAN NOT NULL DEFAULT true,
  deletion_method TEXT NOT NULL DEFAULT 'hard_delete', -- 'hard_delete', 'anonymize', 'archive'
  last_cleanup_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Secure data deletion logs
CREATE TABLE public.secure_deletion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_ids JSONB NOT NULL, -- Array of deleted record IDs
  deletion_type TEXT NOT NULL, -- 'scheduled', 'manual', 'user_request'
  deletion_method TEXT NOT NULL, -- 'hard_delete', 'anonymize'
  reason TEXT,
  records_count INTEGER NOT NULL DEFAULT 0,
  executed_by UUID REFERENCES auth.users(id),
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verification_hash TEXT, -- Hash to verify deletion integrity
  metadata JSONB DEFAULT '{}'
);

-- User consent tracking for GDPR compliance
CREATE TABLE public.user_consent_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'payment_processing', 'data_analytics', 'marketing'
  consent_given BOOLEAN NOT NULL,
  consent_source TEXT NOT NULL, -- 'registration', 'payment_flow', 'settings_update'
  ip_address INET,
  user_agent TEXT,
  consent_version TEXT NOT NULL DEFAULT '1.0',
  expires_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Data anonymization requests
CREATE TABLE public.data_anonymization_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  request_type TEXT NOT NULL, -- 'user_request', 'retention_policy', 'compliance'
  tables_affected TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  anonymization_method JSONB NOT NULL, -- Configuration for anonymization
  completed_at TIMESTAMPTZ,
  requested_by UUID REFERENCES auth.users(id),
  executed_by UUID REFERENCES auth.users(id),
  verification_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- GDPR data export requests
CREATE TABLE public.gdpr_data_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_format TEXT NOT NULL DEFAULT 'json', -- 'json', 'csv', 'pdf'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  download_url TEXT,
  expires_at TIMESTAMPTZ,
  file_size_bytes BIGINT,
  tables_included TEXT[] NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  downloaded_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Compliance audit trail
CREATE TABLE public.compliance_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_type TEXT NOT NULL, -- 'PCI_DSS', 'GDPR', 'CCPA'
  action_type TEXT NOT NULL, -- 'data_access', 'data_deletion', 'consent_update', 'export_request'
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  affected_data_type TEXT NOT NULL,
  action_details JSONB NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  compliance_status TEXT NOT NULL DEFAULT 'compliant', -- 'compliant', 'violation', 'pending_review'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on all compliance tables
ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secure_deletion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consent_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_anonymization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_trail ENABLE ROW LEVEL SECURITY;

-- RLS Policies for data retention policies (admin only)
CREATE POLICY "Admins can manage data retention policies" ON public.data_retention_policies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- RLS Policies for secure deletion logs (admin only)
CREATE POLICY "Admins can view secure deletion logs" ON public.secure_deletion_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- RLS Policies for user consent tracking
CREATE POLICY "Users can view their own consent" ON public.user_consent_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consent" ON public.user_consent_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consent" ON public.user_consent_tracking
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all consent tracking" ON public.user_consent_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- RLS Policies for anonymization requests
CREATE POLICY "Users can view their own anonymization requests" ON public.data_anonymization_requests
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = requested_by);

CREATE POLICY "Users can create anonymization requests" ON public.data_anonymization_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = requested_by);

CREATE POLICY "Admins can manage all anonymization requests" ON public.data_anonymization_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- RLS Policies for GDPR exports
CREATE POLICY "Users can manage their own data exports" ON public.gdpr_data_exports
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all data exports" ON public.gdpr_data_exports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- RLS Policies for compliance audit trail
CREATE POLICY "Users can view their own compliance audit records" ON public.compliance_audit_trail
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all compliance audit records" ON public.compliance_audit_trail
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "System can insert compliance audit records" ON public.compliance_audit_trail
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_user_consent_tracking_user_id ON public.user_consent_tracking(user_id);
CREATE INDEX idx_user_consent_tracking_type ON public.user_consent_tracking(consent_type);
CREATE INDEX idx_data_anonymization_requests_user_id ON public.data_anonymization_requests(user_id);
CREATE INDEX idx_data_anonymization_requests_status ON public.data_anonymization_requests(status);
CREATE INDEX idx_gdpr_data_exports_user_id ON public.gdpr_data_exports(user_id);
CREATE INDEX idx_compliance_audit_trail_user_id ON public.compliance_audit_trail(user_id);
CREATE INDEX idx_compliance_audit_trail_type ON public.compliance_audit_trail(compliance_type);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_data_retention_policies_updated_at
  BEFORE UPDATE ON public.data_retention_policies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_consent_tracking_updated_at
  BEFORE UPDATE ON public.user_consent_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_anonymization_requests_updated_at
  BEFORE UPDATE ON public.data_anonymization_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if user has given consent for specific processing
CREATE OR REPLACE FUNCTION public.check_user_consent(
  p_user_id UUID,
  p_consent_type TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_consent BOOLEAN := false;
BEGIN
  SELECT consent_given INTO has_consent
  FROM public.user_consent_tracking
  WHERE user_id = p_user_id
    AND consent_type = p_consent_type
    AND consent_given = true
    AND (expires_at IS NULL OR expires_at > now())
    AND withdrawn_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(has_consent, false);
END;
$$;

-- Function to anonymize user data
CREATE OR REPLACE FUNCTION public.anonymize_user_data(
  p_user_id UUID,
  p_tables TEXT[] DEFAULT ARRAY['payment_audit_logs', 'device_fingerprints', 'payment_patterns']
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_id UUID;
  v_table_name TEXT;
BEGIN
  -- Create anonymization request
  INSERT INTO public.data_anonymization_requests (
    user_id,
    request_type,
    tables_affected,
    anonymization_method,
    requested_by
  ) VALUES (
    p_user_id,
    'user_request',
    p_tables,
    jsonb_build_object(
      'method', 'hash_replacement',
      'preserve_structure', true,
      'hash_algorithm', 'sha256'
    ),
    auth.uid()
  ) RETURNING id INTO v_request_id;
  
  -- Process anonymization for each table
  FOREACH v_table_name IN ARRAY p_tables
  LOOP
    CASE v_table_name
      WHEN 'payment_audit_logs' THEN
        UPDATE public.payment_audit_logs
        SET 
          user_id = NULL,
          ip_address = NULL,
          user_agent = 'ANONYMIZED',
          metadata = jsonb_build_object('anonymized', true, 'original_user_id_hash', encode(sha256(user_id::text::bytea), 'hex'))
        WHERE user_id = p_user_id;
      
      WHEN 'device_fingerprints' THEN
        UPDATE public.device_fingerprints
        SET 
          user_id = NULL,
          device_data = jsonb_build_object('anonymized', true),
          fingerprint_hash = encode(sha256((fingerprint_hash || 'ANON')::bytea), 'hex')
        WHERE user_id = p_user_id;
      
      WHEN 'payment_patterns' THEN
        UPDATE public.payment_patterns
        SET 
          user_id = NULL,
          pattern_data = jsonb_build_object('anonymized', true)
        WHERE user_id = p_user_id;
    END CASE;
  END LOOP;
  
  -- Update request status
  UPDATE public.data_anonymization_requests
  SET 
    status = 'completed',
    completed_at = now(),
    executed_by = auth.uid(),
    verification_hash = encode(sha256((p_user_id::text || now()::text)::bytea), 'hex')
  WHERE id = v_request_id;
  
  -- Log compliance action
  INSERT INTO public.compliance_audit_trail (
    compliance_type,
    action_type,
    user_id,
    affected_data_type,
    action_details,
    performed_by
  ) VALUES (
    'GDPR',
    'data_anonymization',
    p_user_id,
    'user_data',
    jsonb_build_object(
      'request_id', v_request_id,
      'tables_anonymized', p_tables,
      'method', 'hash_replacement'
    ),
    auth.uid()
  );
  
  RETURN v_request_id;
END;
$$;