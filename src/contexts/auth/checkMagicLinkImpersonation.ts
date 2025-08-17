/**
 * Enhanced magic link impersonation detection utility
 */
export const checkMagicLinkImpersonation = (): boolean => {
  const impersonationBackup = localStorage.getItem('impersonation_backup');
  const urlHash = window.location.hash;
  const urlSearch = window.location.search;
  
  // Check multiple sources for magic link tokens
  const hasMagicLinkTokens = urlHash.includes('access_token=') || urlSearch.includes('access_token=');
  const hasStoredTokens = !!(sessionStorage.getItem('magiclink_tokens') || localStorage.getItem('magiclink_tokens_backup'));
  const hasImpersonationFlag = !!(sessionStorage.getItem('impersonation_magic_link') || localStorage.getItem('impersonation_magic_link_backup'));
  
  console.log('🍎 Enhanced magic link detection:', {
    hasMagicLinkTokens,
    hasStoredTokens,
    hasImpersonationFlag,
    hasBackup: !!impersonationBackup,
    isMagicLinkProcessing: !!sessionStorage.getItem('magiclink_processing'),
    expectingMagicLink: !!sessionStorage.getItem('expecting_magic_link'),
    urlHash: urlHash.substring(0, 50) + '...',
    currentDomain: window.location.hostname
  });
  
  // Enhanced detection: check backup + (tokens OR stored tokens OR impersonation flag)
  return !!(impersonationBackup && (hasMagicLinkTokens || hasStoredTokens || hasImpersonationFlag));
};