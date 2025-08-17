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

/**
 * Restore impersonation by switching back to the backed up session
 */
export async function restoreImpersonation(): Promise<boolean> {
  const backup = getImpersonationBackup();
  if (!backup) {
    console.warn('No impersonation backup found');
    // Still redirect to admin panel even without backup
    window.location.href = '/admin/users';
    return false;
  }

  try {
    console.log('Restoring impersonation session...');
    
    // Clear impersonation flags and session data
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('impersonation_active');
      window.sessionStorage.removeItem('impersonation_target_email');
      window.sessionStorage.removeItem('magic_link_impersonation');
      window.sessionStorage.removeItem('captured_magic_tokens');
      window.sessionStorage.removeItem('expecting_magic_link');
      window.sessionStorage.removeItem('impersonation_start_time');
    }
    
    // First clear the current session to avoid conflicts
    await supabase.auth.signOut();
    
    // Wait a moment for signOut to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Set the backup session
    const { data, error } = await supabase.auth.setSession({
      access_token: backup.access_token,
      refresh_token: backup.refresh_token
    });

    if (error) {
      console.error('Failed to restore session:', error);
      throw error;
    }

    console.log('Impersonation session restored successfully');
    clearImpersonationBackup();
    
    // Navigate back to where the admin was, with fallback to users page
    const path = backup.return_path || '/admin/users';
    
    // Use replace instead of href to avoid page reload issues
    window.location.replace(path);
    return true;
    
  } catch (error) {
    console.error('Failed to restore impersonation:', error);
    clearImpersonationBackup();
    
    // Fallback: Force reload and redirect
    window.location.href = '/admin/users';
    return false;
  }
}

export async function impersonateUser(targetUserId: string): Promise<{ ok: boolean; error?: string }> {
  console.log('🎭 Starting impersonation process:', {
    targetUserId,
    currentDomain: window.location.hostname,
    currentOrigin: window.location.origin,
    timestamp: new Date().toISOString()
  });

  const saved = await saveImpersonationBackup();
  if (!saved) {
    console.error('❌ Failed to save admin session backup');
    return { ok: false, error: 'Unable to save admin session backup' };
  }

  console.log('✅ Admin session backup saved, calling impersonate-user function');

  // Set expectation flag for magic link processing
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('expecting_magic_link', 'true');
    window.sessionStorage.setItem('impersonation_start_time', Date.now().toString());
  }

  const { data, error } = await supabase.functions.invoke('impersonate-user', {
    body: { target_user_id: targetUserId },
  });

  if (error) {
    console.error('❌ Impersonation function error:', error);
    // Clear expectation flag on error
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('expecting_magic_link');
      window.sessionStorage.removeItem('impersonation_start_time');
    }
    return { ok: false, error: error.message };
  }

  const response = data as any;
  const link = response?.action_link;
  
  console.log('📨 Impersonation response received:', {
    hasActionLink: !!link,
    redirectTo: response?.redirect_to,
    targetEmail: response?.target_email,
    linkDomain: link ? new URL(link).hostname : 'N/A'
  });

  if (!link) {
    console.error('❌ No magic link returned from impersonation function');
    // Clear expectation flag on error
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('expecting_magic_link');
      window.sessionStorage.removeItem('impersonation_start_time');
    }
    return { ok: false, error: 'No magic link returned' };
  }

  console.log('🔗 Redirecting to magic link:', {
    link: link.substring(0, 100) + '...',
    linkDomain: new URL(link).hostname
  });

  window.location.href = link;
  return { ok: true };
}

export async function impersonationDiagnostics(targetUserId?: string): Promise<{ ok: boolean; data?: any; error?: string }> {
  const { data, error } = await supabase.functions.invoke('impersonation-diagnostics', {
    body: { target_user_id: targetUserId ?? null, test_link: false },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}
