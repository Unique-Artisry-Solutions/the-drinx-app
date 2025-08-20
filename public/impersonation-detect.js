(function() {
  // Simple impersonation detection for magic links
  const urlHash = window.location.hash;
  const urlSearch = window.location.search;
  
  // Check if we have magic link tokens and impersonation backup
  const hasMagicLinkTokens = urlHash.includes('access_token=') || urlSearch.includes('access_token=');
  const impersonationBackup = localStorage.getItem('impersonation_backup');
  
  if (hasMagicLinkTokens && impersonationBackup) {
    console.log('🎭 [EARLY] Magic link impersonation detected, setting flags');
    
    // Set simple impersonation flags
    sessionStorage.setItem('impersonation_magic_link', 'true');
    sessionStorage.setItem('impersonation_active', 'true');
    localStorage.setItem('impersonation_active_backup', 'true');
    
    console.log('✅ [EARLY] Impersonation flags set for magic link authentication');
  }
})();