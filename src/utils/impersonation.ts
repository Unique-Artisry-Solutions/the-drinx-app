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
export const restoreImpersonation = async (): Promise<void> => {
  try {
    console.log('🔄 Starting impersonation restoration...');
    
    const backup = getImpersonationBackup();
    if (!backup) {
      console.error('❌ No impersonation backup found');
      throw new Error('No impersonation backup found');
    }

    console.log('📦 Found impersonation backup:', {
      adminUserId: backup.user_id,
      adminEmail: backup.email,
      backupTimestamp: backup.created_at
    });

    // Clear ALL impersonation flags and data comprehensively
    clearImpersonationState();

    // Call custom edge function to restore admin session
    console.log('🔧 Calling restore-impersonation function...');
    const { data, error } = await supabase.functions.invoke('restore-impersonation', {
      body: { 
        admin_user_id: backup.user_id,
        admin_email: backup.email 
      }
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      throw error;
    }

    console.log('✅ Restore function response:', data);

    if (data?.action_link) {
      console.log('🔗 Magic link received, redirecting...');
      window.location.href = data.action_link;
    } else {
      throw new Error('No magic link received from restore function');
    }

  } catch (error) {
    console.error('❌ Failed to restore impersonation:', error);
    throw error;
  }
};

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

export const clearImpersonationState = (): void => {
  console.log('🧹 Clearing comprehensive impersonation state...');
  
  try {
    // Clear all session storage flags (including new ones)
    sessionStorage.removeItem('impersonation_active');
    sessionStorage.removeItem('impersonation_magic_link');
    sessionStorage.removeItem('magiclink_processing');
    sessionStorage.removeItem('expecting_magic_link');
    sessionStorage.removeItem('magiclink_tokens');
    sessionStorage.removeItem('processing_magic_link');
    sessionStorage.removeItem('magic_link_impersonation');
    sessionStorage.removeItem('captured_magic_tokens');
    sessionStorage.removeItem('impersonation_target_email');
    sessionStorage.removeItem('impersonation_start_time');
    
    // Clear localStorage backup and additional flags
    localStorage.removeItem('impersonation_backup');
    localStorage.removeItem('impersonation_active_backup');
    localStorage.removeItem('impersonation_magic_link_backup');
    localStorage.removeItem('magiclink_tokens_backup');
    
    console.log('✅ Comprehensive impersonation state cleared successfully');
  } catch (error) {
    console.error('❌ Failed to clear impersonation state:', error);
  }
};
