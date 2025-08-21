/**
 * Debug utility for impersonation state
 */

export const debugImpersonationState = () => {
  console.group('🎭 Impersonation Debug State');
  
  // Check localStorage
  const backup = localStorage.getItem('impersonation_backup');
  const activeBackup = localStorage.getItem('impersonation_active_backup');
  
  console.log('📦 LocalStorage:', {
    backup: backup ? JSON.parse(backup) : null,
    activeBackup,
    magicLinkBackup: localStorage.getItem('impersonation_magic_link_backup'),
    magicLinkTokensBackup: localStorage.getItem('magiclink_tokens_backup')
  });
  
  // Check sessionStorage
  console.log('🧳 SessionStorage:', {
    active: sessionStorage.getItem('impersonation_active'),
    magicLink: sessionStorage.getItem('impersonation_magic_link'),
    targetEmail: sessionStorage.getItem('impersonation_target_email'),
    startTime: sessionStorage.getItem('impersonation_start_time'),
    expectingMagicLink: sessionStorage.getItem('expecting_magic_link'),
    processingMagicLink: sessionStorage.getItem('processing_magic_link'),
    restoreRequested: sessionStorage.getItem('impersonation_restore_requested')
  });
  
  // Check URL
  const urlHash = window.location.hash;
  const urlSearch = window.location.search;
  console.log('🌐 URL State:', {
    pathname: window.location.pathname,
    hasHashTokens: urlHash.includes('access_token='),
    hasSearchTokens: urlSearch.includes('access_token='),
    hashLength: urlHash.length,
    searchLength: urlSearch.length
  });
  
  // Current user state
  import('@/integrations/supabase/client').then(({ supabase }) => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('👤 Current Session:', {
        userId: data?.session?.user?.id,
        userEmail: data?.session?.user?.email,
        userType: data?.session?.user?.user_metadata?.user_type,
        error
      });
    });
  });
  
  console.groupEnd();
};

export const clearAllImpersonationDebug = () => {
  console.log('🧹 Debug: Clearing all impersonation state');
  
  // Clear localStorage
  const localKeys = [
    'impersonation_backup',
    'impersonation_active_backup', 
    'impersonation_magic_link_backup',
    'magiclink_tokens_backup'
  ];
  localKeys.forEach(key => localStorage.removeItem(key));
  
  // Clear sessionStorage
  const sessionKeys = [
    'impersonation_active',
    'impersonation_magic_link',
    'impersonation_target_email',
    'impersonation_start_time',
    'expecting_magic_link',
    'processing_magic_link',
    'impersonation_restore_requested',
    'magiclink_processing',
    'magiclink_tokens'
  ];
  sessionKeys.forEach(key => sessionStorage.removeItem(key));
  
  debugImpersonationState();
};

// Auto-run debug in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(debugImpersonationState, 2000);
}