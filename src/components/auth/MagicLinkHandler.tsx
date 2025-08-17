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
    // IMMEDIATE token capture before Supabase processes them
    const captureTokensImmediately = () => {
      const urlHash = window.location.hash;
      
      // Immediate synchronous capture
      if (urlHash.includes('access_token=') && urlHash.includes('type=magiclink')) {
        const searchParams = new URLSearchParams(urlHash.substring(1));
        const tokens = {
          accessToken: searchParams.get('access_token'),
          refreshToken: searchParams.get('refresh_token'),
          tokenType: searchParams.get('token_type'),
          type: searchParams.get('type')
        };
        
        console.log('⚡ MagicLinkHandler - IMMEDIATE token capture:', {
          hasAccessToken: !!tokens.accessToken,
          hasRefreshToken: !!tokens.refreshToken,
          tokenType: tokens.tokenType,
          type: tokens.type,
          timestamp: Date.now(),
          fullHash: urlHash.substring(0, 100) + '...'
        });
        
        // Store tokens immediately before Supabase consumes them
        if (tokens.accessToken && tokens.refreshToken) {
          window.sessionStorage.setItem('captured_magic_tokens', JSON.stringify({
            ...tokens,
            captureTime: Date.now(),
            domain: window.location.hostname
          }));
          
          // Check for impersonation context
          const impersonationBackup = localStorage.getItem('impersonation_backup');
          if (impersonationBackup) {
            console.log('🎭 MagicLinkHandler - Impersonation context detected with magic link!');
            window.sessionStorage.setItem('magic_link_impersonation', 'true');
          }
        }
        
        return tokens;
      }
      
      return null;
    };
    
    // Enhanced magic link detection with multiple fallback methods
    const detectMagicLinkTokens = () => {
      // First try immediate capture
      const immediateTokens = captureTokensImmediately();
      if (immediateTokens?.accessToken) {
        return immediateTokens;
      }
      
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
      
      // Backup method: Check captured tokens
      let capturedTokens = null;
      try {
        const stored = window.sessionStorage.getItem('captured_magic_tokens');
        if (stored) {
          capturedTokens = JSON.parse(stored);
          console.log('🔄 Found captured magic link tokens:', {
            hasCapturedTokens: !!capturedTokens,
            captureMethod: 'IMMEDIATE_CAPTURE',
            captureTime: capturedTokens.captureTime
          });
        }
      } catch (e) {
        console.warn('Failed to parse captured tokens:', e);
      }
      
      // Fallback method: Check session storage backup
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
      
      // Use tokens in priority order: immediate > url > captured > backup
      const finalTokens = {
        accessToken: accessToken || capturedTokens?.accessToken || backupTokens?.access_token,
        refreshToken: refreshToken || capturedTokens?.refreshToken || backupTokens?.refresh_token,
        tokenType: tokenType || capturedTokens?.tokenType || backupTokens?.token_type,
        type: type || capturedTokens?.type || backupTokens?.type
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

  // Handle post-authentication redirect with impersonation awareness
  useEffect(() => {
    if (shouldRedirect && authStable && isAuthenticated && userType) {
      console.log('🔄 MagicLinkHandler: Redirecting authenticated user after magic link', { userType });
      
      // Check if this is an impersonation flow
      const isImpersonation = window.sessionStorage.getItem('magic_link_impersonation') === 'true' ||
                             window.sessionStorage.getItem('impersonation_active') === 'true';
      
      if (isImpersonation) {
        console.log('🎭 MagicLinkHandler: Impersonation detected, redirecting to target user dashboard');
        
        // Clear magic link impersonation flag but keep impersonation_active for banner
        window.sessionStorage.removeItem('magic_link_impersonation');
      }
      
      const dashboardPath = 
        userType === 'admin' ? '/admin/system-breakdown' :
        userType === 'establishment' ? '/establishment/dashboard' :
        userType === 'promoter' ? '/promoter/dashboard' : '/explore';
      
      console.log('🎯 MagicLinkHandler: Final redirect decision:', {
        userType,
        dashboardPath,
        isImpersonation,
        targetEmail: window.sessionStorage.getItem('impersonation_target_email')
      });
      
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