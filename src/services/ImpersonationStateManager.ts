/**
 * Centralized, hardened impersonation state management
 * Provides atomic operations, consistency checks, and self-healing capabilities
 */

export interface ImpersonationState {
  isActive: boolean;
  backup: ImpersonationBackup | null;
  targetEmail: string | null;
  startTime: number | null;
  method: 'magic_link' | 'direct_auth' | null;
  restorationInProgress: boolean;
  lastValidation: number;
  consistencyHash: string;
}

export interface ImpersonationBackup {
  access_token: string;
  refresh_token: string;
  user_id: string;
  email?: string;
  return_path?: string;
  created_at: number;
}

export interface StateValidationResult {
  isValid: boolean;
  hasInconsistencies: boolean;
  issues: string[];
  recommendedAction: 'continue' | 'cleanup' | 'restore_backup' | 'full_reset';
}

class ImpersonationStateManager {
  private static instance: ImpersonationStateManager;
  private readonly STORAGE_KEYS = {
    BACKUP: 'impersonation_backup',
    STATE: 'impersonation_state',
    SESSION_FLAGS: 'impersonation_session_flags',
    VALIDATION: 'impersonation_last_validation'
  } as const;

  private readonly SESSION_KEYS = [
    'impersonation_active',
    'impersonation_magic_link', 
    'impersonation_target_email',
    'impersonation_start_time',
    'impersonation_restore_requested',
    'expecting_magic_link',
    'magiclink_processing',
    'magiclink_tokens'
  ] as const;

  private readonly LOCAL_KEYS = [
    'impersonation_backup',
    'impersonation_active_backup',
    'impersonation_magic_link_backup',
    'magiclink_tokens_backup'
  ] as const;

  public static getInstance(): ImpersonationStateManager {
    if (!ImpersonationStateManager.instance) {
      ImpersonationStateManager.instance = new ImpersonationStateManager();
    }
    return ImpersonationStateManager.instance;
  }

  /**
   * Get comprehensive impersonation state with validation
   */
  public getState(): ImpersonationState {
    try {
      const backup = this.getBackup();
      const sessionFlags = this.getSessionFlags();
      const startTime = this.getStartTime();
      const targetEmail = this.getTargetEmail();
      const restorationInProgress = this.isRestorationInProgress();
      
      const state: ImpersonationState = {
        isActive: this.determineActiveState(backup, sessionFlags),
        backup,
        targetEmail,
        startTime,
        method: this.determineMethod(),
        restorationInProgress,
        lastValidation: Date.now(),
        consistencyHash: this.generateConsistencyHash()
      };

      // Cache state for performance
      this.cacheState(state);
      
      return state;
    } catch (error) {
      console.error('❌ Failed to get impersonation state:', error);
      return this.getEmptyState();
    }
  }

  /**
   * Validate state consistency and detect issues
   */
  public validateState(): StateValidationResult {
    const issues: string[] = [];
    let isValid = true;
    let hasInconsistencies = false;

    try {
      const backup = this.getBackup();
      const sessionFlags = this.getSessionFlags();
      
      // Check for orphaned flags without backup
      if (sessionFlags.hasFlags && !backup) {
        issues.push('Session flags exist without backup');
        hasInconsistencies = true;
      }

      // Check for expired backup
      if (backup && this.isBackupExpired(backup)) {
        issues.push('Backup has expired');
        isValid = false;
      }

      // Check for inconsistent storage states
      const sessionActive = sessionStorage.getItem('impersonation_active');
      const localBackup = localStorage.getItem('impersonation_active_backup');
      
      if (sessionActive && !localBackup) {
        issues.push('Session active but no local backup');
        hasInconsistencies = true;
      }

      // Check for restoration timeout
      const restoreRequested = sessionStorage.getItem('impersonation_restore_requested');
      if (restoreRequested) {
        const restoreTime = parseInt(sessionStorage.getItem('impersonation_restore_time') || '0');
        if (restoreTime && Date.now() - restoreTime > 30000) { // 30 second timeout
          issues.push('Restoration request timed out');
          isValid = false;
        }
      }

      const recommendedAction = this.determineRecommendedAction(isValid, hasInconsistencies, issues);

      return {
        isValid,
        hasInconsistencies,
        issues,
        recommendedAction
      };

    } catch (error) {
      console.error('❌ State validation failed:', error);
      return {
        isValid: false,
        hasInconsistencies: true,
        issues: ['Validation error: ' + error.message],
        recommendedAction: 'full_reset'
      };
    }
  }

  /**
   * Atomically start impersonation with all required state
   */
  public async startImpersonation(targetUserId: string, backup: ImpersonationBackup): Promise<boolean> {
    try {
      console.log('🎭 Starting atomic impersonation state setup...');
      
      // Clear any existing state first
      this.clearAllState();
      
      // Set all state atomically
      const transaction = this.createStateTransaction();
      
      transaction.setBackup(backup);
      transaction.setSessionFlag('impersonation_active', 'true');
      transaction.setSessionFlag('impersonation_magic_link', 'true');
      transaction.setSessionFlag('impersonation_start_time', Date.now().toString());
      transaction.setSessionFlag('expecting_magic_link', 'true');
      transaction.setLocalFlag('impersonation_active_backup', 'true');
      
      const success = transaction.commit();
      
      if (success) {
        console.log('✅ Impersonation state set atomically');
        return true;
      } else {
        console.error('❌ Failed to set impersonation state atomically');
        this.clearAllState(); // Cleanup on failure
        return false;
      }
      
    } catch (error) {
      console.error('❌ Failed to start impersonation:', error);
      this.clearAllState(); // Cleanup on error
      return false;
    }
  }

  /**
   * Atomically start restoration process
   */
  public startRestoration(): boolean {
    try {
      console.log('🔄 Starting atomic restoration state setup...');
      
      // Set restoration flags
      sessionStorage.setItem('impersonation_restore_requested', 'true');
      sessionStorage.setItem('impersonation_restore_time', Date.now().toString());
      
      // Clear other flags but keep backup
      this.clearSessionFlags();
      
      console.log('✅ Restoration state set atomically');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to start restoration:', error);
      return false;
    }
  }

  /**
   * Self-healing: automatically fix inconsistent states
   */
  public async selfHeal(): Promise<{ healed: boolean; actions: string[] }> {
    const actions: string[] = [];
    
    try {
      const validation = this.validateState();
      
      if (!validation.hasInconsistencies && validation.isValid) {
        return { healed: true, actions: ['No healing needed'] };
      }

      console.log('🔧 Starting self-healing process...', validation);

      switch (validation.recommendedAction) {
        case 'cleanup':
          this.clearSessionFlags();
          actions.push('Cleared inconsistent session flags');
          break;
          
        case 'restore_backup':
          // Attempt to restore from backup if valid
          const backup = this.getBackup();
          if (backup && !this.isBackupExpired(backup)) {
            this.restoreFromBackup(backup);
            actions.push('Restored from valid backup');
          } else {
            this.clearAllState();
            actions.push('Cleared invalid backup');
          }
          break;
          
        case 'full_reset':
          this.clearAllState();
          actions.push('Performed full state reset');
          break;
          
        default:
          actions.push('No action taken');
      }

      console.log('✅ Self-healing completed:', actions);
      return { healed: true, actions };
      
    } catch (error) {
      console.error('❌ Self-healing failed:', error);
      return { healed: false, actions: ['Self-healing failed: ' + error.message] };
    }
  }

  /**
   * Complete cleanup of all impersonation state
   */
  public clearAllState(): void {
    try {
      console.log('🧹 Clearing all impersonation state atomically...');
      
      // Clear session storage
      this.SESSION_KEYS.forEach(key => {
        sessionStorage.removeItem(key);
      });
      
      // Clear local storage
      this.LOCAL_KEYS.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Clear cached state
      sessionStorage.removeItem(this.STORAGE_KEYS.STATE);
      
      console.log('✅ All impersonation state cleared');
      
    } catch (error) {
      console.error('❌ Failed to clear impersonation state:', error);
    }
  }

  // Private helper methods
  private getBackup(): ImpersonationBackup | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEYS.BACKUP);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private getSessionFlags() {
    const hasFlags = this.SESSION_KEYS.some(key => sessionStorage.getItem(key));
    return { hasFlags };
  }

  private getStartTime(): number | null {
    const time = sessionStorage.getItem('impersonation_start_time');
    return time ? parseInt(time) : null;
  }

  private getTargetEmail(): string | null {
    return sessionStorage.getItem('impersonation_target_email');
  }

  private isRestorationInProgress(): boolean {
    return sessionStorage.getItem('impersonation_restore_requested') === 'true';
  }

  private determineActiveState(backup: ImpersonationBackup | null, sessionFlags: any): boolean {
    return !!(backup && sessionFlags.hasFlags);
  }

  private determineMethod(): 'magic_link' | 'direct_auth' | null {
    if (sessionStorage.getItem('impersonation_magic_link')) return 'magic_link';
    if (sessionStorage.getItem('impersonation_direct_auth')) return 'direct_auth';
    return null;
  }

  private generateConsistencyHash(): string {
    const data = {
      backup: !!this.getBackup(),
      sessionFlags: this.getSessionFlags().hasFlags,
      restoration: this.isRestorationInProgress(),
      timestamp: Math.floor(Date.now() / 1000) // Hash per second
    };
    return btoa(JSON.stringify(data));
  }

  private cacheState(state: ImpersonationState): void {
    try {
      sessionStorage.setItem(this.STORAGE_KEYS.STATE, JSON.stringify(state));
    } catch (error) {
      console.warn('⚠️ Failed to cache state:', error);
    }
  }

  private getEmptyState(): ImpersonationState {
    return {
      isActive: false,
      backup: null,
      targetEmail: null,
      startTime: null,
      method: null,
      restorationInProgress: false,
      lastValidation: Date.now(),
      consistencyHash: ''
    };
  }

  private isBackupExpired(backup: ImpersonationBackup): boolean {
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
    return Date.now() - backup.created_at > MAX_AGE;
  }

  private determineRecommendedAction(isValid: boolean, hasInconsistencies: boolean, issues: string[]): StateValidationResult['recommendedAction'] {
    if (!isValid && issues.some(i => i.includes('expired'))) return 'full_reset';
    if (!isValid) return 'restore_backup';
    if (hasInconsistencies) return 'cleanup';
    return 'continue';
  }

  private clearSessionFlags(): void {
    this.SESSION_KEYS.forEach(key => {
      if (key !== 'impersonation_restore_requested') { // Keep restoration flag
        sessionStorage.removeItem(key);
      }
    });
  }

  private restoreFromBackup(backup: ImpersonationBackup): void {
    // Restore minimal required state from backup
    sessionStorage.setItem('impersonation_active', 'true');
    localStorage.setItem('impersonation_active_backup', 'true');
  }

  private createStateTransaction() {
    const operations: Array<() => void> = [];
    
    return {
      setBackup: (backup: ImpersonationBackup) => {
        operations.push(() => localStorage.setItem(this.STORAGE_KEYS.BACKUP, JSON.stringify(backup)));
      },
      setSessionFlag: (key: string, value: string) => {
        operations.push(() => sessionStorage.setItem(key, value));
      },
      setLocalFlag: (key: string, value: string) => {
        operations.push(() => localStorage.setItem(key, value));
      },
      commit: (): boolean => {
        try {
          operations.forEach(op => op());
          return true;
        } catch (error) {
          console.error('❌ Transaction failed:', error);
          return false;
        }
      }
    };
  }
}

export const impersonationStateManager = ImpersonationStateManager.getInstance();
