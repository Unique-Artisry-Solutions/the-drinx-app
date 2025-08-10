import { supabase } from '@/integrations/supabase/client';

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export type UserConsentStatus = 'granted' | 'revoked';

export async function listConsents() {
  const userId = await currentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('user_consents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('listConsents error', error);
    return [];
  }
  return data ?? [];
}

export async function hasConsent(consentType: string): Promise<boolean> {
  const userId = await currentUserId();
  if (!userId) return false;
  const { data, error } = await supabase.rpc('check_user_consent', {
    p_user_id: userId,
    p_consent_type: consentType,
  });
  if (error) {
    console.error('hasConsent error', error);
    return false;
  }
  return Boolean(data);
}

export async function grantConsent(consentType: string, version?: string, metadata: Record<string, any> = {}) {
  const userId = await currentUserId();
  if (!userId) return { success: false };
  const { error } = await supabase
    .from('user_consents')
    .insert({ user_id: userId, consent_type: consentType, status: 'granted', version, metadata });
  if (error) {
    console.error('grantConsent error', error);
    return { success: false, error };
  }
  return { success: true };
}

export async function revokeConsent(consentType: string) {
  const userId = await currentUserId();
  if (!userId) return { success: false };
  // Try update active grant
  const { error } = await supabase
    .from('user_consents')
    .update({ status: 'revoked' as UserConsentStatus })
    .eq('user_id', userId)
    .eq('consent_type', consentType)
    .eq('status', 'granted');
  if (error) {
    console.warn('revokeConsent update failed, inserting revocation record instead', error);
    const { error: insertErr } = await supabase
      .from('user_consents')
      .insert({ user_id: userId, consent_type: consentType, status: 'revoked' });
    if (insertErr) {
      console.error('revokeConsent insert error', insertErr);
      return { success: false, error: insertErr };
    }
  }
  return { success: true };
}
