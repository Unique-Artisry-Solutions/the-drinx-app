import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

interface TokenDetectionResult {
  method: 'URL_HASH' | 'URL_SEARCH' | 'STORED_TOKENS';
  hasAccessToken: boolean;
  hasRefreshToken: boolean;
  tokenType: string | null;
  type: string | null;
  fullHash: string;
  currentDomain: string;
  fullUrl: string;
}

/**
 * Component to handle magic link authentication for impersonation
 * Simplified to avoid hook ordering issues
 */
export const MagicLinkHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { isAuthenticated, authStable, userType } = useAuthenticatedUser();
  const navigate = useNavigate();

  // Single useEffect for token detection and processing
  useEffect(() => {
    const detectAndProcessTokens = () => {
      const urlHash = window.location.hash;
      const urlSearch = window.location.search;
      
      // Check if tokens were already captured by the early script
      let hasTokens = false;
      let tokenData: any = null;
      
      try {
        const storedTokens = sessionStorage.getItem('magiclink_tokens') || localStorage.getItem('magiclink_tokens_backup');
        if (storedTokens) {
          tokenData = JSON.parse(storedTokens);
          hasTokens = !!(tokenData.access_token && tokenData.refresh_token);
          console.log('🔍 MagicLinkHandler - Using pre-captured tokens:', {
            source: sessionStorage.getItem('magiclink_tokens') ? 'session' : 'localStorage',
            hasAccess: !!tokenData.access_token,
            hasRefresh: !!tokenData.refresh_token
          });
        }
      } catch (e) {
        console.error('🔍 MagicLinkHandler - Failed to parse stored tokens:', e);
      }
      
      // Fallback to URL detection if no stored tokens
      if (!hasTokens) {
        const hashParams = new URLSearchParams(urlHash.substring(1));
        const searchParams = new URLSearchParams(urlSearch);
        
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        const tokenType = hashParams.get('token_type') || searchParams.get('token_type');
        const type = hashParams.get('type') || searchParams.get('type');
        
        hasTokens = !!(accessToken && refreshToken && tokenType === 'bearer' && type === 'magiclink');
        
        if (hasTokens) {
          tokenData = { access_token: accessToken, refresh_token: refreshToken, token_type: tokenType, type };
          console.log('🔍 MagicLinkHandler - Detected tokens in URL');
        }
      }
      
      console.log('🔍 MagicLinkHandler - Token detection result:', {
        hasTokens,
        method: tokenData ? 'DETECTED' : 'NONE',
        currentDomain: window.location.hostname,
        fullUrl: window.location.href
      });
      
      if (hasTokens && tokenData) {
        console.log('✅ Magic link tokens detected, processing authentication');
        setIsProcessingMagicLink(true);
        
        // Set processing flag
        sessionStorage.setItem('processing_magic_link', 'true');
        
        // Clean URL and finish processing after delay
        setTimeout(() => {
          const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
          window.history.replaceState({}, document.title, cleanUrl);
          console.log('🧹 Magic link processing completed, URL cleaned');
          
          setIsProcessingMagicLink(false);
          setShouldRedirect(true);
          sessionStorage.removeItem('processing_magic_link');
        }, 3000);
      }
    };

    detectAndProcessTokens();
  }, []); // Empty dependency array - run once on mount

  // Single useEffect for redirect handling
  useEffect(() => {
    if (!shouldRedirect || !authStable || !isAuthenticated || !userType) {
      return;
    }

    console.log('🔄 MagicLinkHandler: Redirecting authenticated user after magic link', { userType });
    
    // Check if this is an impersonation flow
    const isImpersonation = sessionStorage.getItem('magic_link_impersonation') === 'true' ||
                           sessionStorage.getItem('impersonation_active') === 'true';
    
    if (isImpersonation) {
      console.log('🎭 MagicLinkHandler: Impersonation detected, redirecting to target user dashboard');
      sessionStorage.removeItem('magic_link_impersonation');
    }
    
    const dashboardPath = 
      userType === 'admin' ? '/admin/system-breakdown' :
      userType === 'establishment' ? '/establishment/dashboard' :
      userType === 'promoter' ? '/promoter/dashboard' : '/explore';
    
    console.log('🎯 MagicLinkHandler: Final redirect decision:', {
      userType,
      dashboardPath,
      isImpersonation,
      targetEmail: sessionStorage.getItem('impersonation_target_email')
    });
    
    navigate(dashboardPath, { replace: true });
    setShouldRedirect(false);
  }, [shouldRedirect, authStable, isAuthenticated, userType, navigate]);

  // Show loading while processing magic link
  if (isProcessingMagicLink) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Processing authentication...</p>
          <p className="mt-2 text-sm text-muted-foreground">Redirecting from magic link...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MagicLinkHandler;