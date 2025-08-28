-- Lock down device_fingerprints table and anonymize sensitive data
-- Device fingerprinting is sensitive data that needs proper access controls

-- RLS is already enabled, but let's ensure it's set
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with proper access controls
DROP POLICY IF EXISTS "System can insert device fingerprints" ON public.device_fingerprints;
DROP POLICY IF EXISTS "System can update device fingerprints" ON public.device_fingerprints;
DROP POLICY IF EXISTS "Users can view their own device fingerprints" ON public.device_fingerprints;

-- Users can SELECT only their own rows, admins can see all
DROP POLICY IF EXISTS dfp_select_self ON public.device_fingerprints;
CREATE POLICY dfp_select_self ON public.device_fingerprints
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Users can INSERT their own fingerprints, service role can insert any
DROP POLICY IF EXISTS dfp_insert_self ON public.device_fingerprints;
CREATE POLICY dfp_insert_self ON public.device_fingerprints
  FOR INSERT WITH CHECK (user_id = auth.uid() OR auth.role() = 'service_role');

-- Service role and admins can UPDATE any fingerprint data
DROP POLICY IF EXISTS dfp_update_service ON public.device_fingerprints;
CREATE POLICY dfp_update_service ON public.device_fingerprints
  FOR UPDATE USING (auth.role() = 'service_role' OR public.is_admin(auth.uid()));

-- Anonymize existing device_data by hashing sensitive fields
-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a function to anonymize device data
CREATE OR REPLACE FUNCTION public.anonymize_device_data(device_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  anonymized_data jsonb := '{}';
  key text;
  value text;
BEGIN
  -- Preserve only non-sensitive metadata
  FOR key IN SELECT jsonb_object_keys(device_data)
  LOOP
    -- Keep general device info but hash sensitive identifiers
    CASE key
      WHEN 'screen_resolution', 'timezone', 'language', 'platform', 'browser_name' THEN
        anonymized_data := anonymized_data || jsonb_build_object(key, device_data->key);
      WHEN 'user_agent', 'canvas_fingerprint', 'webgl_fingerprint', 'audio_fingerprint' THEN
        -- Hash sensitive fingerprinting data
        value := device_data->>key;
        IF value IS NOT NULL AND value != '' THEN
          anonymized_data := anonymized_data || jsonb_build_object(
            key || '_hash', 
            encode(digest(value, 'sha256'), 'hex')
          );
        END IF;
      ELSE
        -- For other unknown fields, hash them to be safe
        value := device_data->>key;
        IF value IS NOT NULL AND value != '' THEN
          anonymized_data := anonymized_data || jsonb_build_object(
            key || '_hash', 
            encode(digest(value, 'sha256'), 'hex')
          );
        END IF;
    END CASE;
  END LOOP;
  
  -- Add anonymization timestamp
  anonymized_data := anonymized_data || jsonb_build_object('anonymized_at', now());
  
  RETURN anonymized_data;
END;
$$;

-- Update existing records to anonymize device_data
-- Only anonymize if device_data doesn't already have anonymized_at field
UPDATE public.device_fingerprints 
SET device_data = public.anonymize_device_data(device_data)
WHERE device_data->>'anonymized_at' IS NULL;

-- Create trigger to automatically anonymize device_data on insert/update
CREATE OR REPLACE FUNCTION public.trigger_anonymize_device_fingerprints()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Anonymize device_data if it doesn't already contain anonymized_at
  IF NEW.device_data->>'anonymized_at' IS NULL THEN
    NEW.device_data := public.anonymize_device_data(NEW.device_data);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_anonymize_device_fingerprints ON public.device_fingerprints;
CREATE TRIGGER trigger_anonymize_device_fingerprints
  BEFORE INSERT OR UPDATE ON public.device_fingerprints
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_anonymize_device_fingerprints();