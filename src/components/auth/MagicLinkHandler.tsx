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
    // Check if we have magic link tokens in the URL
    const urlHash = window.location.hash;
    const searchParams = new URLSearchParams(urlHash.substring(1));
    
    // Look for access_token, refresh_token, token_type, and type parameters
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const tokenType = searchParams.get('token_type');
    const type = searchParams.get('type');
    
    console.log('MagicLinkHandler - Checking URL hash:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      tokenType,
      type,
      fullHash: urlHash
    });
    
    if (accessToken && refreshToken && tokenType === 'bearer' && type === 'magiclink') {
      console.log('🔗 Magic link tokens detected, processing authentication');
      setIsProcessingMagicLink(true);
      
      // Set flag to prevent dev auto-login interference
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('processing_magic_link', 'true');
      }
      
      // Clean the URL after a delay to allow Supabase to process the tokens
      setTimeout(() => {
        const currentUrl = new URL(window.location.href);
        const cleanUrl = `${currentUrl.origin}${currentUrl.pathname}${currentUrl.search}`;
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('Magic link processing completed, URL cleaned');
        setIsProcessingMagicLink(false);
        setShouldRedirect(true);
        
        // Clear the magic link processing flag
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('processing_magic_link');
        }
      }, 2000); // Increased timeout for better stability
    } else if (window.location.hash) {
      // Log any other hash parameters for debugging
      console.log('Non-magic-link hash detected:', window.location.hash);
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