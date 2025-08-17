/**
 * Utility for validating and maintaining impersonation session state
 */

import { getImpersonationBackup } from './impersonation';

export interface ImpersonationValidationResult {
  isValid: boolean;
  shouldPersist: boolean;
  shouldClear: boolean;
  reason?: string;
}

/**
 * Validate current impersonation state against session and expected targets
 */
export const validateImpersonationState = (currentUserId: string, currentUserEmail: string): ImpersonationValidationResult => {
  try {
    const backup = getImpersonationBackup();
    const hasImpersonationFlags = !!(
      sessionStorage.getItem('impersonation_active') ||
      sessionStorage.getItem('impersonation_magic_link') ||
      localStorage.getItem('impersonation_active_backup')
    );
    
    const expectedTargetEmail = sessionStorage.getItem('impersonation_target_email');
    const restoreRequested = sessionStorage.getItem('impersonation_restore_requested') === 'true';
    
    // If restoration was requested, we should be restoring to admin
    if (restoreRequested) {
      if (backup && backup.user_id === currentUserId) {
        return {
          isValid: true,
          shouldPersist: false,
          shouldClear: true,
          reason: 'Restoration successful - should clear impersonation state'
        };
      } else {
        return {
          isValid: false,
          shouldPersist: false,
          shouldClear: true,
          reason: 'Restoration requested but user mismatch'
        };
      }
    }
    
    // If we have backup and flags, validate the impersonation
    if (backup && hasImpersonationFlags) {
      const isActuallyImpersonating = backup.user_id !== currentUserId;
      
      if (!isActuallyImpersonating) {
        return {
          isValid: false,
          shouldPersist: false,
          shouldClear: true,
          reason: 'User IDs match - not actually impersonating'
        };
      }
      
      // Validate email matches expected target
      if (expectedTargetEmail && expectedTargetEmail !== currentUserEmail) {
        return {
          isValid: false,
          shouldPersist: false,
          shouldClear: true,
          reason: `Email mismatch: expected ${expectedTargetEmail}, got ${currentUserEmail}`
        };
      }
      
      return {
        isValid: true,
        shouldPersist: true,
        shouldClear: false,
        reason: 'Valid impersonation state'
      };
    }
    
    // If we have flags but no backup, or backup but no flags, state is inconsistent
    if (hasImpersonationFlags && !backup) {
      return {
        isValid: false,
        shouldPersist: false,
        shouldClear: true,
        reason: 'Impersonation flags present but no backup found'
      };
    }
    
    if (backup && !hasImpersonationFlags) {
      return {
        isValid: false,
        shouldPersist: false,
        shouldClear: true,
        reason: 'Backup present but no impersonation flags'
      };
    }
    
    // No impersonation state detected
    return {
      isValid: true,
      shouldPersist: false,
      shouldClear: false,
      reason: 'No impersonation state detected'
    };
    
  } catch (error) {
    console.error('❌ Impersonation validation error:', error);
    return {
      isValid: false,
      shouldPersist: false,
      shouldClear: true,
      reason: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Ensure impersonation flags are properly set for valid impersonation
 */
export const ensureImpersonationFlags = (targetEmail: string): void => {
  console.log('✅ Setting consistent impersonation flags for user:', targetEmail);
  
  sessionStorage.setItem('impersonation_active', 'true');
  sessionStorage.setItem('impersonation_magic_link', 'true');
  localStorage.setItem('impersonation_active_backup', 'true');
  sessionStorage.setItem('impersonation_target_email', targetEmail);
};

/**
 * Clear impersonation flags when impersonation is invalid or complete
 */
export const clearImpersonationFlags = (): void => {
  console.log('🧹 Clearing impersonation flags due to validation failure or completion');
  
  sessionStorage.removeItem('impersonation_active');
  sessionStorage.removeItem('impersonation_magic_link');
  sessionStorage.removeItem('impersonation_target_email');
  localStorage.removeItem('impersonation_active_backup');
  
  // Also clear backup if restoration is complete
  const restoreRequested = sessionStorage.getItem('impersonation_restore_requested') === 'true';
  if (restoreRequested) {
    localStorage.removeItem('impersonation_backup');
    sessionStorage.removeItem('impersonation_restore_requested');
  }
};