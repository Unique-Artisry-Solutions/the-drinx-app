import { useEffect, useState } from 'react';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

/**
 * Component to handle magic link authentication for impersonation
 * This component processes the magic link tokens in the URL fragment
 */
export const MagicLinkHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const { isAuthenticated, authStable } = useAuthenticatedUser();

  useEffect(() => {
    // Check if we have magic link tokens in the URL
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const tokenType = urlParams.get('token_type');
    const type = urlParams.get('type');

    // Only process if we have magic link tokens and it's a magic link
    if (accessToken && refreshToken && type === 'magiclink' && tokenType === 'bearer') {
      console.log('Magic link detected, processing...', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        tokenType,
        type,
        currentUrl: window.location.href
      });
      setIsProcessingMagicLink(true);

      // Let the auth system handle the tokens naturally
      // The AuthProvider will pick up the session change automatically
      
      // Clean up the URL after a short delay to let auth settle
      setTimeout(() => {
        // Remove the hash from URL to clean it up
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('Magic link processing completed, URL cleaned');
        setIsProcessingMagicLink(false);
      }, 1500); // Increased timeout for better stability
    } else if (window.location.hash) {
      // Log any other hash parameters for debugging
      console.log('Non-magic-link hash detected:', window.location.hash);
    }
  }, []);

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