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
 * Enhanced for better timing resilience
 */
export const validateImpersonationState = (
  currentUserId: string, 
  currentUserEmail: string, 
  isMagicLinkProcessing: boolean = false
): ImpersonationValidationResult => {
  try {
    const backup = getImpersonationBackup();
    const hasImpersonationFlags = !!(
      sessionStorage.getItem('impersonation_active') ||
      sessionStorage.getItem('impersonation_magic_link') ||
      localStorage.getItem('impersonation_active_backup')
    );
    
    const expectedTargetEmail = sessionStorage.getItem('impersonation_target_email');
    const restoreRequested = sessionStorage.getItem('impersonation_restore_requested') === 'true';
    
    console.log('🔍 Impersonation validation context:', {
      currentUserId,
      currentUserEmail,
      isMagicLinkProcessing,
      hasBackup: !!backup,
      hasFlags: hasImpersonationFlags,
      expectedTargetEmail,
      restoreRequested,
      backupUserId: backup?.user_id
    });
    
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
    
    // **CRITICAL FIX**: During magic link processing, be more lenient and resilient
    if (isMagicLinkProcessing) {
      console.log('🔄 Validation during magic link processing - being lenient');
      
      // If we have backup and we're processing, assume flags will be set properly
      if (backup) {
        const isActuallyImpersonating = backup.user_id !== currentUserId;
        
        if (!isActuallyImpersonating) {
          console.log('🔍 During processing: User IDs match, but allowing for transition period');
          // During magic link processing, allow some time for user ID to change
          return {
            isValid: true,
            shouldPersist: true,
            shouldClear: false,
            reason: 'User IDs match but allowing transition during magic link processing'
          };
        }
        
        // During processing, allow impersonation even if flags aren't fully set yet
        // This provides timing resilience
        return {
          isValid: true,
          shouldPersist: true,
          shouldClear: false,
          reason: 'Valid impersonation during magic link processing'
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
      
      // Validate email matches expected target (with fallback tolerance)
      if (expectedTargetEmail && expectedTargetEmail !== currentUserEmail) {
        console.warn(`⚠️ Email mismatch detected: expected ${expectedTargetEmail}, got ${currentUserEmail}`);
        
        // During magic link processing, be more tolerant of email mismatches
        if (!isMagicLinkProcessing) {
          return {
            isValid: false,
            shouldPersist: false,
            shouldClear: true,
            reason: `Email mismatch: expected ${expectedTargetEmail}, got ${currentUserEmail}`
          };
        } else {
          console.log('🔄 Allowing email mismatch during magic link processing');
        }
      }
      
      return {
        isValid: true,
        shouldPersist: true,
        shouldClear: false,
        reason: 'Valid impersonation state'
      };
    }
    
    // **CRITICAL FIX**: If we have flags but no backup, or backup but no flags, state is inconsistent
    // BUT during magic link processing, be more forgiving about temporary state
    if (hasImpersonationFlags && !backup) {
      return {
        isValid: false,
        shouldPersist: false,
        shouldClear: true,
        reason: 'Impersonation flags present but no backup found'
      };
    }
    
    if (backup && !hasImpersonationFlags) {
      // **CRITICAL FIX**: During normal processing, this is an issue, but allow recovery
      if (!isMagicLinkProcessing) {
        console.log('🔄 Backup present but no flags - allowing flag restoration');
        return {
          isValid: true,
          shouldPersist: true,
          shouldClear: false,
          reason: 'Backup present - restoring impersonation flags'
        };
      } else {
        return {
          isValid: false,
          shouldPersist: false,
          shouldClear: true,
          reason: 'Backup present but no impersonation flags'
        };
      }
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
  sessionStorage.removeItem('impersonation_start_time');
  sessionStorage.removeItem('impersonation_expecting_magic_link');
  localStorage.removeItem('impersonation_active_backup');
  
  // Also clear backup if restoration is complete
  const restoreRequested = sessionStorage.getItem('impersonation_restore_requested') === 'true';
  if (restoreRequested) {
    localStorage.removeItem('impersonation_backup');
    sessionStorage.removeItem('impersonation_restore_requested');
  }
};

/**
 * Clear all impersonation state completely (for cleanup purposes)
 */
export const clearAllImpersonationState = (): void => {
  console.log('🧹 Clearing ALL impersonation state');
  
  // Clear all sessionStorage items
  sessionStorage.removeItem('impersonation_active');
  sessionStorage.removeItem('impersonation_magic_link');
  sessionStorage.removeItem('impersonation_target_email');
  sessionStorage.removeItem('impersonation_start_time');
  sessionStorage.removeItem('impersonation_expecting_magic_link');
  sessionStorage.removeItem('impersonation_restore_requested');
  
  // Clear all localStorage items
  localStorage.removeItem('impersonation_backup');
  localStorage.removeItem('impersonation_active_backup');
  localStorage.removeItem('impersonation_magic_link_backup');
  localStorage.removeItem('impersonation_magic_link_tokens_backup');
};