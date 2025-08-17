import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

/**
 * Simplified Magic Link Handler - focuses on redirect logic only
 * Enhanced with state stabilization awareness
 */
export const MagicLinkHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { isAuthenticated, authStable, userType, isTransitioning, authStateStable } = useAuthenticatedUser();
  const navigate = useNavigate();

  // Simplified magic link detection - only check URL for processing state
  useEffect(() => {
    const urlHash = window.location.hash;
    const urlSearch = window.location.search;
    
    // Simple check for magic link tokens in URL
    const hasMagicLinkTokens = urlHash.includes('access_token=') || urlSearch.includes('access_token=');
    
    console.log('🔍 MagicLinkHandler - Simple token detection:', {
      hasMagicLinkTokens,
      currentDomain: window.location.hostname,
      fullUrl: window.location.href
    });
    
    if (hasMagicLinkTokens) {
      console.log('✅ Magic link detected, letting Supabase handle authentication');
      setIsProcessingMagicLink(true);
      
      // Clean URL and prepare for redirect after short delay
      setTimeout(() => {
        const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('🧹 Magic link URL cleaned');
        
        setIsProcessingMagicLink(false);
        setShouldRedirect(true);
      }, 2000);
    }
  }, []);

  // Enhanced redirect handling with state stabilization awareness
  useEffect(() => {
    // Wait for auth state to be stable and not transitioning
    if (!shouldRedirect || !authStable || !authStateStable || isTransitioning || !isAuthenticated || !userType) {
      return;
    }

    console.log('🔄 MagicLinkHandler: Redirecting authenticated user after magic link', { 
      userType, 
      isTransitioning, 
      authStateStable 
    });
    
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
  }, [shouldRedirect, authStable, authStateStable, isTransitioning, isAuthenticated, userType, navigate]);

  // Show loading while processing magic link or during auth transitions
  if (isProcessingMagicLink || (shouldRedirect && (isTransitioning || !authStateStable))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Processing authentication...</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {isProcessingMagicLink ? 'Redirecting from magic link...' : 'Stabilizing authentication state...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MagicLinkHandler;