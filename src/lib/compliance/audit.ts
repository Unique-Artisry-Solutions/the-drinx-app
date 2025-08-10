import { supabase } from '@/integrations/supabase/client';
import { redactSensitive } from '@/lib/logging/redact';

export async function logComplianceEvent(actionType: string, complianceType: string, details: Record<string, any> = {}) {
  const payload = {
    action_type: actionType,
    compliance_type: complianceType,
    details: redactSensitive(details),
    timestamp: new Date().toISOString(),
  };
  const { data, error } = await supabase.functions.invoke('audit-log', { body: payload });
  if (error) {
    console.error('audit-log invoke error', error);
    return { success: false, error };
  }
  return { success: true, data };
}
