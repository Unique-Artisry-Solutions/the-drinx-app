
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseLoginRedirectProps {
  user: any;
  isLoading: boolean;
  pageId: string;
}

export const useLoginRedirect = ({ user, isLoading, pageId }: UseLoginRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Skip if we're still loading or no user is found
    if (isLoading || !user) {
      return;
    }
    
    // Check for redirect loops
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_ts')) {
      console.log(`[LOGIN PAGE ${pageId}] Detected potential redirect loop, skipping automatic redirect`);
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
    
    if (savedRedirect) {
      console.log(`[LOGIN PAGE ${pageId}] Found saved redirect path:`, savedRedirect);
      
      // For promoters, use window.location.href for consistent full page reload
      if (userType === 'promoter') {
        console.log(`[LOGIN PAGE ${pageId}] Redirecting authenticated promoter to saved path`);
        // Add timestamp to force fresh load
        const redirectUrl = new URL(savedRedirect, window.location.origin);
        redirectUrl.searchParams.set('auth_ts', Date.now().toString());
        redirectUrl.searchParams.set('login_page_id', pageId);
        
        // Small timeout to avoid redirect race conditions
        setTimeout(() => {
          localStorage.removeItem('auth_redirect');
          window.location.href = redirectUrl.toString();
        }, 100);
      } else {
        localStorage.removeItem('auth_redirect');
        navigate(savedRedirect);
      }
    } else {
      // Default redirect based on user type
      console.log(`[LOGIN PAGE ${pageId}] No saved redirect, using user type for redirect:`, userType);
      
      if (userType === 'promoter') {
        console.log(`[LOGIN PAGE ${pageId}] Redirecting authenticated promoter to dashboard`);
        const redirectUrl = new URL('/promoter/dashboard', window.location.origin);
        redirectUrl.searchParams.set('auth_ts', Date.now().toString());
        redirectUrl.searchParams.set('login_page_id', pageId);
        
        setTimeout(() => {
          window.location.href = redirectUrl.toString();
        }, 100);
      } else if (userType === 'establishment') {
        navigate('/establishment/dashboard');
      } else {
        navigate('/explore');
      }
    }
  }, [user, isLoading, navigate, pageId]);
};
