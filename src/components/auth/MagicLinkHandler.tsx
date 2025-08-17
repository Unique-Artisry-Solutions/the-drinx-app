import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

/**
 * Component to handle magic link authentication for impersonation
 * This component processes the magic link tokens in the URL fragment
 */
export const MagicLinkHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { isAuthenticated, authStable, userType } = useAuthenticatedUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Enhanced magic link detection with multiple fallback methods
    const detectMagicLinkTokens = () => {
      const urlHash = window.location.hash;
      const searchParams = new URLSearchParams(urlHash.substring(1));
      
      // Primary method: Check URL hash
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const tokenType = searchParams.get('token_type');
      const type = searchParams.get('type');
      
      console.log('🔍 MagicLinkHandler - Enhanced token detection:', {
        method: 'URL_HASH',
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        tokenType,
        type,
        fullHash: urlHash,
        currentDomain: window.location.hostname,
        fullUrl: window.location.href
      });
      
      // Backup method: Check if we have tokens in session storage (for cross-domain scenarios)
      let backupTokens = null;
      try {
        const storedTokens = window.sessionStorage.getItem('magic_link_backup');
        if (storedTokens) {
          backupTokens = JSON.parse(storedTokens);
          console.log('🔄 Found backup magic link tokens in session storage:', {
            hasBackupTokens: !!backupTokens,
            backupMethod: 'SESSION_STORAGE'
          });
        }
      } catch (e) {
        console.warn('Failed to parse backup tokens:', e);
      }
      
      // Use primary tokens if available, otherwise use backup
      const finalTokens = {
        accessToken: accessToken || backupTokens?.access_token,
        refreshToken: refreshToken || backupTokens?.refresh_token,
        tokenType: tokenType || backupTokens?.token_type,
        type: type || backupTokens?.type
      };
      
      return finalTokens;
    };
    
    const tokens = detectMagicLinkTokens();
    
    if (tokens.accessToken && tokens.refreshToken && tokens.tokenType === 'bearer' && tokens.type === 'magiclink') {
      console.log('✅ Magic link tokens detected, processing authentication');
      setIsProcessingMagicLink(true);
      
      // Set flag to prevent dev auto-login interference
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('processing_magic_link', 'true');
        
        // Store tokens as backup in case of cross-domain issues
        window.sessionStorage.setItem('magic_link_backup', JSON.stringify({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          token_type: tokens.tokenType,
          type: tokens.type,
          timestamp: Date.now()
        }));
      }
      
      // Clean the URL after a delay to allow Supabase to process the tokens
      setTimeout(() => {
        const currentUrl = new URL(window.location.href);
        const cleanUrl = `${currentUrl.origin}${currentUrl.pathname}${currentUrl.search}`;
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('🧹 Magic link processing completed, URL cleaned');
        setIsProcessingMagicLink(false);
        setShouldRedirect(true);
        
        // Clear the magic link processing flag and backup tokens
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('processing_magic_link');
          window.sessionStorage.removeItem('magic_link_backup');
        }
      }, 3000); // Increased timeout for better stability
    } else if (window.location.hash) {
      // Log any other hash parameters for debugging
      console.log('❓ Non-magic-link hash detected:', {
        hash: window.location.hash,
        parsedParams: Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)).entries())
      });
    } else {
      // Check if we're expecting a magic link but don't have tokens (cross-domain issue)
      const expectingMagicLink = window.sessionStorage.getItem('expecting_magic_link');
      if (expectingMagicLink) {
        console.warn('⚠️  Expected magic link tokens but none found - possible cross-domain issue');
        window.sessionStorage.removeItem('expecting_magic_link');
      }
    }
  }, []);

  // Handle post-authentication redirect
  useEffect(() => {
    if (shouldRedirect && authStable && isAuthenticated && userType) {
      console.log('🔄 MagicLinkHandler: Redirecting authenticated user after magic link', { userType });
      
      const dashboardPath = 
        userType === 'admin' ? '/admin/system-breakdown' :
        userType === 'establishment' ? '/establishment/dashboard' :
        userType === 'promoter' ? '/promoter/dashboard' : '/explore';
      
      navigate(dashboardPath, { replace: true });
      setShouldRedirect(false);
    }
  }, [shouldRedirect, authStable, isAuthenticated, userType, navigate]);

  // Show loading while processing magic link
  if (isProcessingMagicLink) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing authentication...</p>
          <p className="mt-2 text-sm text-gray-500">Redirecting from magic link...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MagicLinkHandler;