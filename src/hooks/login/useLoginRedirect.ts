
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleAuthRedirect, isRedirectLoop } from '@/utils/redirectUtils';

interface UseLoginRedirectProps {
  user: any;
  isLoading: boolean;
  pageId: string;
}

/**
 * Hook for handling redirects after login authentication
 * Uses localStorage consistently for all auth-related storage
 */
export const useLoginRedirect = ({ user, isLoading, pageId }: UseLoginRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Skip if we're still loading or no user is found
    if (isLoading || !user) {
      return;
    }
    
    // Check for redirect loops and prevent them
    if (isRedirectLoop()) {
      console.log(`[LOGIN PAGE ${pageId}] Detected redirect loop, skipping automatic redirect`);
      return;
    }
    
    console.log(`[LOGIN PAGE ${pageId}] User authenticated, preparing redirect`);
    
    // Get user type for routing decision
    const userType = localStorage.getItem('user_type');
    console.log(`[LOGIN PAGE ${pageId}] Authenticated user type:`, userType);
    
    // Check if there's a saved redirect
    const savedRedirect = localStorage.getItem('auth_redirect');
    
    // Clean up any login tracking flags to prevent issues
    localStorage.removeItem('login_success');
    localStorage.removeItem('login_success_timestamp');
    
    // Perform the redirect using our centralized utility
    handleAuthRedirect(user, navigate, {
      savedRedirect,
      userType,
      source: `login_page_${pageId}`
    });
  }, [user, isLoading, navigate, pageId, location]);
};
