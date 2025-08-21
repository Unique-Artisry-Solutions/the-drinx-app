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

  // Simplified magic link detection with enhanced DevTools bypass
  useEffect(() => {
    try {
      // Check if window object is available (DOM ready)
      if (typeof window === 'undefined') {
        console.log('🔍 MagicLinkHandler - Window not available, skipping magic link detection');
        return;
      }

      // **PHASE 2 FIX**: Enhanced DevTools detection with timestamp validation
      const devToolsUserType = localStorage.getItem('dev_auto_login_user_type');
      const devToolsLoginTimestamp = localStorage.getItem('dev_auto_login_timestamp');
      const isActiveDevToolsLogin = devToolsUserType && devToolsLoginTimestamp && 
        (Date.now() - parseInt(devToolsLoginTimestamp)) < 15000; // 15 second protection window
      const currentPath = window.location?.pathname || '';
      const isAdminLogin = currentPath === '/admin/login';
      
      if (devToolsUserType || isActiveDevToolsLogin || isAdminLogin) {
        console.log('🔧 MagicLinkHandler - DevTools login detected, completely bypassing magic link processing:', {
          devToolsUserType,
          isActiveDevToolsLogin,
          isAdminLogin,
          currentPath,
          timeSinceLogin: devToolsLoginTimestamp ? Date.now() - parseInt(devToolsLoginTimestamp) : 'N/A'
        });
        return;
      }

      const urlHash = window.location?.hash || '';
      const urlSearch = window.location?.search || '';
      
      // Simple check for magic link tokens in URL
      const hasMagicLinkTokens = urlHash.includes('access_token=') || urlSearch.includes('access_token=');
      
      console.log('🔍 MagicLinkHandler - Simple token detection:', {
        hasMagicLinkTokens,
        currentDomain: window.location?.hostname || 'unknown',
        fullUrl: window.location?.href || 'unknown'
      });
      
      if (hasMagicLinkTokens) {
        console.log('✅ Magic link detected, letting Supabase handle authentication');
        setIsProcessingMagicLink(true);
        
        // Clean URL and prepare for redirect after short delay
        setTimeout(() => {
          try {
            const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
            window.history?.replaceState({}, document.title, cleanUrl);
            console.log('🧹 Magic link URL cleaned');
            
            setIsProcessingMagicLink(false);
            setShouldRedirect(true);
          } catch (cleanupError) {
            console.error('🚨 MagicLinkHandler - Error cleaning URL:', cleanupError);
            // Still proceed with redirect even if cleanup fails
            setIsProcessingMagicLink(false);
            setShouldRedirect(true);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('🚨 MagicLinkHandler - Error in magic link detection:', error);
      // If there's an error, just proceed normally without magic link processing
      setIsProcessingMagicLink(false);
    }
  }, []);

  // Enhanced redirect handling with DevTools bypass
  useEffect(() => {
    // **PHASE 2 FIX**: Enhanced DevTools protection for redirects
    const devToolsUserType = localStorage.getItem('dev_auto_login_user_type');
    const devToolsLoginTimestamp = localStorage.getItem('dev_auto_login_timestamp');
    const isActiveDevToolsLogin = devToolsUserType && devToolsLoginTimestamp && 
      (Date.now() - parseInt(devToolsLoginTimestamp)) < 15000; // 15 second protection window
    
    if ((devToolsUserType || isActiveDevToolsLogin) && shouldRedirect) {
      console.log('🔧 MagicLinkHandler - DevTools login detected, cancelling magic link redirect:', {
        devToolsUserType,
        isActiveDevToolsLogin,
        timeSinceLogin: devToolsLoginTimestamp ? Date.now() - parseInt(devToolsLoginTimestamp) : 'N/A'
      });
      setShouldRedirect(false);
      return;
    }

    // Wait for auth state to be stable and not transitioning
    if (!shouldRedirect || !authStable || !authStateStable || isTransitioning || !isAuthenticated || !userType) {
      return;
    }

    console.log('🔄 MagicLinkHandler: Redirecting authenticated user after magic link', { 
      userType, 
      isTransitioning, 
      authStateStable 
    });
    
    const dashboardPath = 
      userType === 'admin' ? '/admin/system-breakdown' :
      userType === 'establishment' ? '/establishment/dashboard' :
      userType === 'promoter' ? '/promoter/dashboard' : '/explore';
    
    console.log('🎯 MagicLinkHandler: Final redirect decision:', {
      userType,
      dashboardPath
    });
    
    navigate(dashboardPath, { replace: true });
    setShouldRedirect(false);
  }, [shouldRedirect, authStable, authStateStable, isTransitioning, isAuthenticated, userType, navigate]);

  // Show loading while processing magic link or during auth transitions
  // **PHASE 2 FIX**: Enhanced DevTools detection for loading state
  const devToolsUserType = localStorage.getItem('dev_auto_login_user_type');
  const devToolsLoginTimestamp = localStorage.getItem('dev_auto_login_timestamp');
  const isActiveDevToolsLogin = devToolsUserType && devToolsLoginTimestamp && 
    (Date.now() - parseInt(devToolsLoginTimestamp)) < 15000; // 15 second protection window
  
  const shouldShowLoading = !(devToolsUserType || isActiveDevToolsLogin) && 
    (isProcessingMagicLink || (shouldRedirect && (isTransitioning || !authStateStable)));
  
  if (shouldShowLoading) {
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