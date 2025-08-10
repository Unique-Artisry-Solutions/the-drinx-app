-- Create user_consents table for GDPR consent tracking
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  consent_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('granted','revoked')),
  version TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Policies: users manage their own consents (idempotent creation via DO blocks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_consents' AND policyname = 'Users can view their own consents'
  ) THEN
    CREATE POLICY "Users can view their own consents"
    ON public.user_consents FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_consents' AND policyname = 'Users can insert their own consents'
  ) THEN
    CREATE POLICY "Users can insert their own consents"
    ON public.user_consents FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_consents' AND policyname = 'Users can update their own consents'
  ) THEN
    CREATE POLICY "Users can update their own consents"
    ON public.user_consents FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END$$;

-- Admins can view all consents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_consents' AND policyname = 'Admins can view all consents'
  ) THEN
    CREATE POLICY "Admins can view all consents"
    ON public.user_consents FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_type = 'admin'));
  END IF;
END$$;

-- Unique active grant per user/type (partial index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_consents_active_grant
ON public.user_consents (user_id, consent_type)
WHERE status = 'granted';

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_consents_user ON public.user_consents (user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON public.user_consents (consent_type);

-- Timestamp trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
DROP TRIGGER IF EXISTS trg_user_consents_updated_at ON public.user_consents;
CREATE TRIGGER trg_user_consents_updated_at
BEFORE UPDATE ON public.user_consents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Compliance audit reporting view (admin-only via base RLS)
CREATE OR REPLACE VIEW public.compliance_audit_report AS
SELECT 
  date_trunc('day', created_at) AS day,
  action_type,
  compliance_type,
  compliance_status,
  count(*) AS event_count
FROM public.compliance_audit_trail
GROUP BY 1,2,3,4
ORDER BY day DESC;

-- Index to speed up compliance report
CREATE INDEX IF NOT EXISTS idx_compliance_audit_trail_created_at ON public.compliance_audit_trail (created_at);
CREATE INDEX IF NOT EXISTS idx_compliance_audit_trail_action_type ON public.compliance_audit_trail (action_type);

-- Data retention cleanup function (SECURITY DEFINER) reading from existing data_retention_policies
CREATE OR REPLACE FUNCTION public.run_retention_cleanup()
RETURNS JSON AS $$
DECLARE
  rec RECORD;
  cutoff TIMESTAMPTZ;
  del_sql TEXT;
  total_deleted BIGINT := 0;
  table_deleted BIGINT;
BEGIN
  FOR rec IN 
    SELECT * FROM public.data_retention_policies 
    WHERE is_active = true AND auto_deletion_enabled = true
  LOOP
    cutoff := now() - (COALESCE(rec.retention_period_days, 0) || ' days')::interval;

    -- Only operate on tables that have a created_at column
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = rec.data_type AND column_name = 'created_at'
    ) THEN
      del_sql := format('DELETE FROM %I WHERE created_at < $1', rec.data_type);
      EXECUTE del_sql USING cutoff;
      GET DIAGNOSTICS table_deleted = ROW_COUNT;
      total_deleted := total_deleted + COALESCE(table_deleted, 0);
    END IF;
  END LOOP;

  UPDATE public.data_retention_policies
  SET last_cleanup_at = now()
  WHERE is_active = true AND auto_deletion_enabled = true;

  RETURN json_build_object('deleted_rows', total_deleted, 'timestamp', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Allow authenticated users to run the cleanup (logic is server-side)
REVOKE ALL ON FUNCTION public.run_retention_cleanup() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.run_retention_cleanup() TO authenticated;
GRANT EXECUTE ON FUNCTION public.run_retention_cleanup() TO service_role;