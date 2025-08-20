/**
 * Hardened impersonation utilities with multiple fallback methods and comprehensive error handling
 */

import { supabase } from '@/integrations/supabase/client';
import { impersonationStateManager, ImpersonationBackup } from '@/services/ImpersonationStateManager';

export interface ImpersonationResult {
  success: boolean;
  method: 'magic_link' | 'direct_auth' | 'fallback';
  error?: string;
  fallbackAvailable?: boolean;
  retryAfter?: number;
}

export interface RestorationResult {
  success: boolean;
  method: 'magic_link' | 'session_refresh' | 'manual_fallback';
  redirectUrl?: string;
  error?: string;
  manualInstructions?: string;
}

/**
 * Enhanced impersonation with multiple fallback methods
 */
export async function hardenedImpersonateUser(targetUserId: string): Promise<ImpersonationResult> {
  console.log('🛡️ Starting hardened impersonation process...');
  
  try {
    // Step 1: Validate current state and self-heal if needed
    const validation = impersonationStateManager.validateState();
    if (validation.hasInconsistencies) {
      console.log('🔧 Inconsistent state detected, self-healing...');
      await impersonationStateManager.selfHeal();
    }

    // Step 2: Save admin session backup
    const backup = await createSecureBackup();
    if (!backup) {
      return {
        success: false,
        method: 'magic_link',
        error: 'Failed to create secure backup of admin session',
        fallbackAvailable: false
      };
    }

    // Step 3: Set impersonation state atomically
    const stateSet = await impersonationStateManager.startImpersonation(targetUserId, backup);
    if (!stateSet) {
      return {
        success: false,
        method: 'magic_link',
        error: 'Failed to set impersonation state',
        fallbackAvailable: true
      };
    }

    // Step 4: Attempt impersonation with retry logic
    const result = await attemptImpersonationWithRetry(targetUserId, 3);
    
    if (!result.success) {
      // Cleanup on failure
      impersonationStateManager.clearAllState();
    }
    
    return result;

  } catch (error) {
    console.error('❌ Hardened impersonation failed:', error);
    impersonationStateManager.clearAllState();
    
    return {
      success: false,
      method: 'magic_link',
      error: error.message,
      fallbackAvailable: true
    };
  }
}

/**
 * Enhanced restoration with multiple fallback methods
 */
export async function hardenedRestoreImpersonation(): Promise<RestorationResult> {
  console.log('🛡️ Starting hardened restoration process...');
  
  try {
    // Step 1: Validate we have a backup to restore
    const state = impersonationStateManager.getState();
    if (!state.backup) {
      return {
        success: false,
        method: 'manual_fallback',
        error: 'No admin backup found',
        manualInstructions: 'Please navigate to /admin/users and log in manually'
      };
    }

    // Step 2: Set restoration state
    const restorationStarted = impersonationStateManager.startRestoration();
    if (!restorationStarted) {
      return {
        success: false,
        method: 'manual_fallback',
        error: 'Failed to start restoration process'
      };
    }

    // Step 3: Attempt restoration with multiple methods
    const result = await attemptRestorationWithFallbacks(state.backup);
    
    if (result.success) {
      // Clear impersonation state on successful restoration
      impersonationStateManager.clearAllState();
    }
    
    return result;

  } catch (error) {
    console.error('❌ Hardened restoration failed:', error);
    impersonationStateManager.clearAllState();
    
    return {
      success: false,
      method: 'manual_fallback',
      error: error.message,
      manualInstructions: 'Please clear your browser data and navigate to /admin/users'
    };
  }
}

/**
 * Check impersonation health and auto-heal issues
 */
export async function checkImpersonationHealth(): Promise<{
  healthy: boolean;
  issues: string[];
  autoHealed: boolean;
  actions: string[];
}> {
  try {
    const validation = impersonationStateManager.validateState();
    
    if (validation.isValid && !validation.hasInconsistencies) {
      return {
        healthy: true,
        issues: [],
        autoHealed: false,
        actions: []
      };
    }

    console.log('🔧 Health check found issues, attempting auto-heal...');
    const healResult = await impersonationStateManager.selfHeal();
    
    return {
      healthy: healResult.healed,
      issues: validation.issues,
      autoHealed: healResult.healed,
      actions: healResult.actions
    };

  } catch (error) {
    console.error('❌ Health check failed:', error);
    return {
      healthy: false,
      issues: ['Health check failed: ' + error.message],
      autoHealed: false,
      actions: []
    };
  }
}

// Private helper functions
async function createSecureBackup(): Promise<ImpersonationBackup | null> {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
    if (!session?.access_token || !session?.refresh_token || !session.user) {
      console.error('❌ Invalid session for backup');
      return null;
    }

    const backup: ImpersonationBackup = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      user_id: session.user.id,
      email: session.user.email ?? undefined,
      return_path: window.location.pathname + window.location.search,
      created_at: Date.now(),
    };

    console.log('✅ Secure backup created');
    return backup;

  } catch (error) {
    console.error('❌ Failed to create secure backup:', error);
    return null;
  }
}

async function attemptImpersonationWithRetry(targetUserId: string, maxRetries: number): Promise<ImpersonationResult> {
  let lastError = '';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 Impersonation attempt ${attempt}/${maxRetries}`);
    
    try {
      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: { target_user_id: targetUserId }
      });

      if (error) {
        lastError = error.message;
        console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      } else if (data?.action_link) {
        console.log('✅ Impersonation successful');
        
        // Store target email for validation
        if (data.target_email) {
          sessionStorage.setItem('impersonation_target_email', data.target_email);
        }
        
        // Redirect to magic link
        window.location.href = data.action_link;
        
        return {
          success: true,
          method: 'magic_link'
        };
      }
      
    } catch (error) {
      lastError = error.message;
      console.warn(`⚠️ Attempt ${attempt} error:`, error);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return {
    success: false,
    method: 'magic_link',
    error: `All ${maxRetries} attempts failed. Last error: ${lastError}`,
    fallbackAvailable: true,
    retryAfter: 30000 // Suggest retry after 30 seconds
  };
}

async function attemptRestorationWithFallbacks(backup: ImpersonationBackup): Promise<RestorationResult> {
  const fallbackMethods: Array<'magic_link' | 'session_refresh'> = ['magic_link', 'session_refresh'];
  
  for (const method of fallbackMethods) {
    console.log(`🔄 Trying restoration method: ${method}`);
    
    try {
      const { data, error } = await supabase.functions.invoke('restore-impersonation', {
        body: {
          admin_user_id: backup.user_id,
          admin_email: backup.email,
          fallback_method: method
        }
      });

      if (error) {
        console.warn(`⚠️ ${method} method failed:`, error.message);
        continue;
      }

      if (data?.success && data?.action_link) {
        console.log(`✅ Restoration successful via ${method}`);
        
        // Redirect to restoration link
        window.location.href = data.action_link;
        
        return {
          success: true,
          method,
          redirectUrl: data.action_link
        };
      }

    } catch (error) {
      console.warn(`⚠️ ${method} method error:`, error);
      continue;
    }
  }

  console.error('❌ All restoration methods failed');
  
  // Final fallback: manual navigation
  const manualUrl = '/admin/users';
  
  return {
    success: false,
    method: 'manual_fallback',
    error: 'All automated restoration methods failed',
    redirectUrl: manualUrl,
    manualInstructions: `Please navigate to ${manualUrl} and log in manually. You may need to clear your browser data first.`
  };
}