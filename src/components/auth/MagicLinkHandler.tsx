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
export const MagicLinkHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { isAuthenticated, authStable, userType } = useAuthenticatedUser();
  const navigate = useNavigate();

  const detectTokens = (): TokenDetectionResult => {
    const urlHash = window.location.hash;
    const urlSearch = window.location.search;
    
    // First, check if tokens were already captured by the early script
    const storedTokens = sessionStorage.getItem('magiclink_tokens') || localStorage.getItem('magiclink_tokens_backup');
    if (storedTokens) {
      try {
        const tokenData = JSON.parse(storedTokens);
        console.log('🔍 MagicLinkHandler - Using pre-captured tokens:', {
          source: sessionStorage.getItem('magiclink_tokens') ? 'session' : 'localStorage',
          hasAccess: !!tokenData.access_token,
          hasRefresh: !!tokenData.refresh_token,
          capturedAt: tokenData.captured_at
        });
        
        return {
          method: 'STORED_TOKENS',
          hasAccessToken: !!tokenData.access_token,
          hasRefreshToken: !!tokenData.refresh_token,
          tokenType: tokenData.token_type,
          type: tokenData.type,
          fullHash: tokenData.original_hash || '',
          currentDomain: window.location.hostname,
          fullUrl: window.location.href
        };
      } catch (e) {
        console.error('🔍 MagicLinkHandler - Failed to parse stored tokens:', e);
      }
    }
    
    // Fallback to URL detection
    let params = new URLSearchParams(urlHash.substring(1));
    let method: 'URL_HASH' | 'URL_SEARCH' = 'URL_HASH';
    
    // Fallback to URL search params
    if (!params.get('access_token')) {
      params = new URLSearchParams(urlSearch);
      method = 'URL_SEARCH';
    }
    
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const tokenType = params.get('token_type');
    const type = params.get('type');
    
    return {
      method,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      tokenType,
      type,
      fullHash: urlHash,
      currentDomain: window.location.hostname,
      fullUrl: window.location.href
    };
  };

  useEffect(() => {
    const tokens = detectTokens();
    
    console.log('🔍 MagicLinkHandler - Enhanced token detection:', tokens);
    
    if (tokens.hasAccessToken && tokens.hasRefreshToken && tokens.tokenType === 'bearer' && tokens.type === 'magiclink') {
      console.log('✅ Magic link tokens detected, processing authentication');
      setIsProcessingMagicLink(true);
      
      // Set flag to prevent dev auto-login interference
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('processing_magic_link', 'true');
      }
      
      // Clean the URL after a delay to allow Supabase to process the tokens
      setTimeout(() => {
        const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('🧹 Magic link processing completed, URL cleaned');
        setIsProcessingMagicLink(false);
        setShouldRedirect(true);
        
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('processing_magic_link');
        }
      }, 3000);
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