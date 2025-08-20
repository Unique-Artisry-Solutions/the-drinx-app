import { supabase } from '@/integrations/supabase/client';
import { debugLogger } from '@/utils/debugLogger';

const STORAGE_KEY = 'impersonation_backup';
const SESSION_KEY = 'impersonation_active';

export interface ImpersonationBackup {
  access_token: string;
  refresh_token: string;
  user_id: string;
  email?: string;
  return_path?: string;
  created_at: number;
}

export interface ImpersonationState {
  isActive: boolean;
  backup: ImpersonationBackup | null;
  targetEmail?: string;
  startTime?: number;
}

/**
 * Simplified impersonation state management
 * Consolidates all the complex logic into a single, reliable system
 */
class SimplifiedImpersonationManager {
  private static instance: SimplifiedImpersonationManager;
  private currentState: ImpersonationState | null = null;
  private stateValidated = false;
  private lastValidation = 0;
  private static readonly VALIDATION_THROTTLE = 5000; // Only validate every 5 seconds

  static getInstance(): SimplifiedImpersonationManager {
    if (!SimplifiedImpersonationManager.instance) {
      SimplifiedImpersonationManager.instance = new SimplifiedImpersonationManager();
    }
    return SimplifiedImpersonationManager.instance;
  }

  /**
   * Get current impersonation state with validation (throttled)
   */
  getState(): ImpersonationState {
    const now = Date.now();
    const needsValidation = !this.stateValidated || 
                           !this.currentState || 
                           (now - this.lastValidation) > SimplifiedImpersonationManager.VALIDATION_THROTTLE;
    
    if (needsValidation) {
      this.currentState = this.validateAndGetState();
      this.stateValidated = true;
      this.lastValidation = now;
    }
    return this.currentState;
  }

  /**
   * Check if currently impersonating
   */
  isImpersonating(): boolean {
    const state = this.getState();
    return state.isActive && !!state.backup;
  }

  /**
   * Start impersonation process
   */
  async startImpersonation(targetUserId: string): Promise<{ ok: boolean; error?: string }> {
    try {
      debugLogger.info('impersonation', `Starting simplified impersonation for: ${targetUserId}`);
      
      // Clear any existing state
      this.clearState();
      
      // Save current session as backup
      const backup = await this.saveCurrentSession();
      if (!backup) {
        return { ok: false, error: 'Failed to save admin session' };
      }

      // Set impersonation flags atomically
      sessionStorage.setItem(SESSION_KEY, 'true');
      sessionStorage.setItem('impersonation_target', targetUserId);
      sessionStorage.setItem('impersonation_start_time', Date.now().toString());

      // Call impersonation function
      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: { target_user_id: targetUserId }
      });

      if (error || !data?.action_link) {
        this.clearState();
        return { 
          ok: false, 
          error: error?.message || 'No magic link received' 
        };
      }

      // Store target email if provided
      if (data.target_email) {
        sessionStorage.setItem('impersonation_target_email', data.target_email);
      }

      debugLogger.info('impersonation', 'Impersonation setup complete, redirecting...');
      
      // Update internal state
      this.currentState = {
        isActive: true,
        backup,
        targetEmail: data.target_email,
        startTime: Date.now()
      };

      // Redirect to magic link
      window.location.href = data.action_link;
      return { ok: true };

    } catch (error: any) {
      debugLogger.error('impersonation', 'Impersonation failed:', error);
      this.clearState();
      return { 
        ok: false, 
        error: error.message || 'Unknown error during impersonation' 
      };
    }
  }

  /**
   * Restore original admin session
   */
  async restoreSession(): Promise<void> {
    try {
      debugLogger.info('impersonation', 'Restoring admin session...');
      
      const state = this.getState();
      if (!state.backup) {
        throw new Error('No backup session found');
      }

      // Check if backup is expired (24 hours)
      const MAX_AGE = 24 * 60 * 60 * 1000;
      if (Date.now() - state.backup.created_at > MAX_AGE) {
        this.clearState();
        throw new Error('Backup session expired - please login manually');
      }

      // Try to restore via edge function first
      const { data, error } = await supabase.functions.invoke('restore-impersonation', {
        body: { 
          admin_user_id: state.backup.user_id,
          admin_email: state.backup.email
        }
      });

      if (error || !data?.action_link) {
        // Fallback to manual navigation
        debugLogger.warn('impersonation', 'Edge function restore failed, using manual fallback');
        this.clearState();
        window.location.href = '/admin/users';
        return;
      }

      debugLogger.info('impersonation', 'Restore link received, redirecting...');
      this.clearState();
      window.location.href = data.action_link;

    } catch (error: any) {
      debugLogger.error('impersonation', 'Failed to restore session:', error);
      this.clearState();
      
      // Always provide manual fallback
      window.location.href = '/admin/users';
      throw error;
    }
  }

  /**
   * Clear all impersonation state
   */
  clearState(): void {
    try {
      debugLogger.debug('impersonation', 'Clearing impersonation state...');
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      // Clear sessionStorage
      const sessionKeys = [
        SESSION_KEY,
        'impersonation_target',
        'impersonation_target_email', 
        'impersonation_start_time',
        'impersonation_magic_link',
        'expecting_magic_link',
        'magiclink_processing',
        'magiclink_tokens'
      ];
      
      sessionKeys.forEach(key => sessionStorage.removeItem(key));
      
      // Reset internal state
      this.currentState = {
        isActive: false,
        backup: null
      };
      this.stateValidated = true;
      
      debugLogger.debug('impersonation', 'Impersonation state cleared');
      
    } catch (error) {
      debugLogger.error('impersonation', 'Failed to clear state:', error);
    }
  }

  /**
   * Private: Save current session as backup
   */
  private async saveCurrentSession(): Promise<ImpersonationBackup | null> {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session?.access_token || !session?.refresh_token || !session.user) {
        debugLogger.error('impersonation', 'No valid session to backup');
        return null;
      }

      const backup: ImpersonationBackup = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user_id: session.user.id,
        email: session.user.email || undefined,
        return_path: window.location.pathname + window.location.search,
        created_at: Date.now()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(backup));
      debugLogger.debug('impersonation', 'Admin session backed up');
      return backup;

    } catch (error) {
      debugLogger.error('impersonation', 'Failed to save session backup:', error);
      return null;
    }
  }

  /**
   * Private: Validate and get current state
   */
  private validateAndGetState(): ImpersonationState {
    try {
      // Get backup
      const backupRaw = localStorage.getItem(STORAGE_KEY);
      const backup = backupRaw ? JSON.parse(backupRaw) as ImpersonationBackup : null;
      
      // Check session flags
      const isActiveFlag = sessionStorage.getItem(SESSION_KEY) === 'true';
      const targetEmail = sessionStorage.getItem('impersonation_target_email') || undefined;
      const startTimeRaw = sessionStorage.getItem('impersonation_start_time');
      const startTime = startTimeRaw ? parseInt(startTimeRaw) : undefined;

      // Check URL for magic link tokens (indicates impersonation in progress)
      const urlHash = window.location.hash;
      const hasMagicLinkTokens = urlHash.includes('access_token=');

      // Determine if we're actively impersonating
      const isActive = !!(backup && (isActiveFlag || hasMagicLinkTokens));

      const state: ImpersonationState = {
        isActive,
        backup,
        targetEmail,
        startTime
      };

      debugLogger.debug('impersonation', 'Validated impersonation state:', {
        isActive,
        hasBackup: !!backup,
        hasFlags: isActiveFlag,
        hasMagicTokens: hasMagicLinkTokens,
        targetEmail,
        backupAge: backup ? Date.now() - backup.created_at : null
      });

      return state;

    } catch (error) {
      debugLogger.error('impersonation', 'Failed to validate state:', error);
      return { isActive: false, backup: null };
    }
  }

  /**
   * Force state refresh (useful after navigation)
   */
  refreshState(): void {
    this.stateValidated = false;
    this.currentState = null;
  }
}

// Export singleton instance and convenience functions
export const impersonationManager = SimplifiedImpersonationManager.getInstance();

export const getImpersonationState = () => impersonationManager.getState();
export const isImpersonating = () => impersonationManager.isImpersonating();
export const startImpersonation = (targetUserId: string) => impersonationManager.startImpersonation(targetUserId);
export const restoreImpersonation = () => impersonationManager.restoreSession();
export const clearImpersonationState = () => impersonationManager.clearState();
export const refreshImpersonationState = () => impersonationManager.refreshState();

// Legacy compatibility
export const getImpersonationBackup = () => getImpersonationState().backup;
export const saveImpersonationBackup = () => Promise.resolve(true); // No-op, handled internally now