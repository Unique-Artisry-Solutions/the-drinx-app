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
 * Enhanced with multiple fallback methods and comprehensive error handling
 */
export const restoreImpersonation = async (): Promise<void> => {
  try {
    console.log('🔄 Starting enhanced impersonation restoration...');
    
    const backup = getImpersonationBackup();
    if (!backup) {
      console.error('❌ No impersonation backup found');
      throw new Error('No impersonation backup found - please navigate to /admin/users manually');
    }

    console.log('📦 Found impersonation backup:', {
      adminUserId: backup.user_id,
      adminEmail: backup.email,
      backupTimestamp: backup.created_at,
      backupAge: Date.now() - backup.created_at
    });

    // Check if backup is too old (24 hours)
    const MAX_BACKUP_AGE = 24 * 60 * 60 * 1000;
    if (Date.now() - backup.created_at > MAX_BACKUP_AGE) {
      console.warn('⚠️ Backup is expired, clearing and using manual fallback');
      clearAllImpersonationState();
      throw new Error('Backup expired - please navigate to /admin/users manually');
    }

    // Set explicit restoration flag BEFORE clearing other flags
    sessionStorage.setItem('impersonation_restore_requested', 'true');
    sessionStorage.setItem('impersonation_restore_time', Date.now().toString());
    console.log('🎯 Set explicit restoration flags');

    // Clear ALL other impersonation flags and data comprehensively
    clearImpersonationState();

    // Multiple restoration attempts with different methods
    const restorationMethods = ['magic_link', 'session_refresh'];
    let lastError = null;

    for (const method of restorationMethods) {
      try {
        console.log(`🔧 Attempting restoration via ${method}...`);
        
        const { data, error } = await supabase.functions.invoke('restore-impersonation', {
          body: { 
            admin_user_id: backup.user_id,
            admin_email: backup.email,
            fallback_method: method
          }
        });

        if (error) {
          console.warn(`⚠️ ${method} method failed:`, error.message);
          lastError = error;
          continue;
        }

        console.log(`✅ ${method} method response:`, data);

        if (data?.success && data?.action_link) {
          console.log('🔗 Restoration link received, redirecting...');
          
          // Set success flag before redirect
          sessionStorage.setItem('impersonation_restore_success', 'true');
          
          window.location.href = data.action_link;
          return; // Success - exit function
        } else {
          console.warn(`⚠️ ${method} method returned no action link`);
          lastError = new Error(`${method} method returned no action link`);
        }

      } catch (methodError) {
        console.warn(`⚠️ ${method} method error:`, methodError);
        lastError = methodError;
        continue;
      }
    }

    // All methods failed - use manual fallback
    console.error('❌ All restoration methods failed, using manual fallback');
    
    // Clear all restoration flags
    sessionStorage.removeItem('impersonation_restore_requested');
    sessionStorage.removeItem('impersonation_restore_time');
    
    // Provide manual fallback with instructions
    const manualUrl = '/admin/users';
    const errorMessage = `All automated restoration methods failed. ${lastError?.message || 'Unknown error'}. Please navigate to ${manualUrl} manually.`;
    
    // Try to redirect to manual fallback
    try {
      window.location.href = manualUrl;
    } catch (redirectError) {
      console.error('❌ Manual redirect also failed:', redirectError);
    }
    
    throw new Error(errorMessage);

  } catch (error) {
    console.error('❌ Failed to restore impersonation:', error);
    
    // Comprehensive cleanup on any error
    sessionStorage.removeItem('impersonation_restore_requested');
    sessionStorage.removeItem('impersonation_restore_time');
    sessionStorage.removeItem('impersonation_restore_success');
    
    // Re-throw with helpful instructions
    const enhancedError = new Error(
      `Impersonation restoration failed: ${error.message}. ` +
      'Please clear your browser data and navigate to /admin/users manually.'
    );
    enhancedError.name = 'ImpersonationRestorationError';
    throw enhancedError;
  }
};

export async function impersonateUser(targetUserId: string): Promise<{ ok: boolean; error?: string }> {
  console.log('🎭 Starting enhanced impersonation process:', {
    targetUserId,
    currentDomain: window.location.hostname,
    currentOrigin: window.location.origin,
    timestamp: new Date().toISOString()
  });

  // Step 1: Clear any existing impersonation state
  clearAllImpersonationState();

  // Step 2: Save admin session backup with validation
  const saved = await saveImpersonationBackup();
  if (!saved) {
    console.error('❌ Failed to save admin session backup');
    return { ok: false, error: 'Unable to save admin session backup - please ensure you are logged in as admin' };
  }

  console.log('✅ Admin session backup saved securely');

  // Step 3: Set impersonation state atomically
  if (typeof window !== 'undefined') {
    try {
      // Create atomic state transaction
      const transaction = [
        () => window.sessionStorage.setItem('expecting_magic_link', 'true'),
        () => window.sessionStorage.setItem('impersonation_start_time', Date.now().toString()),
        () => window.sessionStorage.setItem('impersonation_active', 'true'),
        () => window.sessionStorage.setItem('impersonation_magic_link', 'true'),
        () => window.localStorage.setItem('impersonation_active_backup', 'true'),
        () => window.sessionStorage.setItem('impersonation_method', 'magic_link')
      ];

      // Execute all operations atomically
      transaction.forEach(op => op());
      console.log('✅ Impersonation state set atomically');
      
    } catch (stateError) {
      console.error('❌ Failed to set impersonation state:', stateError);
      clearAllImpersonationState();
      return { ok: false, error: 'Failed to set impersonation state' };
    }
  }

  // Step 4: Attempt impersonation with retry logic
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Impersonation attempt ${attempt}/${maxRetries}`);
      
      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: { target_user_id: targetUserId },
      });

      if (error) {
        lastError = error;
        console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
        
        // Exponential backoff for retries
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`⏱️ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      } else {
        const response = data as any;
        const link = response?.action_link;
        
        console.log('📨 Impersonation response received:', {
          hasActionLink: !!link,
          redirectTo: response?.redirect_to,
          targetEmail: response?.target_email,
          linkDomain: link ? new URL(link).hostname : 'N/A',
          attempt
        });

        if (!link) {
          lastError = new Error('No magic link returned from impersonation function');
          console.error(`❌ Attempt ${attempt}: No magic link returned`);
          
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        } else {
          // Store target email for validation
          if (response?.target_email && typeof window !== 'undefined') {
            window.sessionStorage.setItem('impersonation_target_email', response.target_email);
          }

          console.log('🔗 Impersonation successful, redirecting to magic link:', {
            link: link.substring(0, 100) + '...',
            linkDomain: new URL(link).hostname
          });

          // Successful impersonation - redirect
          window.location.href = link;
          return { ok: true };
        }
      }

    } catch (attemptError) {
      lastError = attemptError;
      console.error(`❌ Attempt ${attempt} error:`, attemptError);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All attempts failed - cleanup and return error
  console.error('❌ All impersonation attempts failed');
  
  if (typeof window !== 'undefined') {
    clearAllImpersonationState();
  }

  const errorMessage = lastError?.message || 'Unknown impersonation error';
  return { 
    ok: false, 
    error: `Impersonation failed after ${maxRetries} attempts: ${errorMessage}. Please try again or contact an administrator.`
  };
}

export const clearImpersonationState = (): void => {
  console.log('🧹 Clearing comprehensive impersonation state...');
  
  try {
    // Clear all session storage flags (including new ones)
    // NOTE: We do NOT clear 'impersonation_restore_requested' here as it's handled separately
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

/**
 * Clear all impersonation state including restoration flag (for complete cleanup)
 */
export const clearAllImpersonationState = (): void => {
  console.log('🧹 Clearing ALL impersonation state including restoration flag...');
  
  clearImpersonationState();
  
  // Also clear the restoration flag
  sessionStorage.removeItem('impersonation_restore_requested');
  
  console.log('✅ All impersonation state cleared completely');
};
