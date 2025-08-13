import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'impersonation_backup';

export interface ImpersonationBackup {
  access_token: string;
  refresh_token: string;
  user_id: string;
  email?: string;
  return_path?: string;
  created_at: number;
}

export async function saveImpersonationBackup(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.access_token || !session?.refresh_token || !session.user) return false;

  const backup: ImpersonationBackup = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user_id: session.user.id,
    email: session.user.email ?? undefined,
    return_path: window.location.pathname + window.location.search,
    created_at: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(backup));
  return true;
}

export function getImpersonationBackup(): ImpersonationBackup | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ImpersonationBackup) : null;
  } catch {
    return null;
  }
}

export function clearImpersonationBackup() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function restoreImpersonation(): Promise<boolean> {
  const backup = getImpersonationBackup();
  if (!backup) return false;
  const { data, error } = await supabase.auth.setSession({
    access_token: backup.access_token,
    refresh_token: backup.refresh_token,
  });
  if (error) return false;
  clearImpersonationBackup();
  // Navigate back to where the admin was
  const path = backup.return_path || '/admin';
  window.location.href = path;
  return true;
}

export async function impersonateUser(targetUserId: string): Promise<{ ok: boolean; error?: string }> {
  const saved = await saveImpersonationBackup();
  if (!saved) return { ok: false, error: 'Unable to save admin session backup' };

  const { data, error } = await supabase.functions.invoke('impersonate-user', {
    body: { target_user_id: targetUserId },
  });

  if (error) return { ok: false, error: error.message };

  const link = (data as any)?.action_link;
  if (!link) return { ok: false, error: 'No magic link returned' };

  window.location.href = link;
  return { ok: true };
}
