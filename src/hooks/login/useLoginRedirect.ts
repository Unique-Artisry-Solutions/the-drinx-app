
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseLoginRedirectProps {
  user: any;
  isLoading: boolean;
  pageId: string;
}

export const useLoginRedirect = ({ user, isLoading, pageId }: UseLoginRedirectProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && user) {
      console.log(`[LOGIN PAGE ${pageId}] User already authenticated, preparing redirect`);
      
      // Get user type for routing decision
      const userType = localStorage.getItem('user_type');
      console.log(`[LOGIN PAGE ${pageId}] Authenticated user type:`, userType);
      
      // Check if there's a saved redirect
      const savedRedirect = localStorage.getItem('auth_redirect');
      
      if (savedRedirect) {
        console.log(`[LOGIN PAGE ${pageId}] Found saved redirect path:`, savedRedirect);
        
        // For promoters, use window.location.href for consistent full page reload
        if (userType === 'promoter') {
          console.log(`[LOGIN PAGE ${pageId}] Redirecting authenticated promoter to saved path`);
          // Add timestamp to force fresh load
          const redirectUrl = new URL(savedRedirect, window.location.origin);
          redirectUrl.searchParams.set('auth_ts', Date.now().toString());
          redirectUrl.searchParams.set('login_page_id', pageId);
          window.location.href = redirectUrl.toString();
        } else {
          navigate(savedRedirect);
        }
        localStorage.removeItem('auth_redirect');
      } else {
        // Default redirect based on user type
        console.log(`[LOGIN PAGE ${pageId}] No saved redirect, using user type for redirect:`, userType);
        
        if (userType === 'promoter') {
          console.log(`[LOGIN PAGE ${pageId}] Redirecting authenticated promoter to dashboard`);
          const redirectUrl = new URL('/promoter/dashboard', window.location.origin);
          redirectUrl.searchParams.set('auth_ts', Date.now().toString());
          redirectUrl.searchParams.set('login_page_id', pageId);
          window.location.href = redirectUrl.toString();
        } else if (userType === 'establishment') {
          navigate('/establishment/dashboard');
        } else {
          navigate('/explore');
        }
      }
    }
  }, [user, isLoading, navigate, pageId]);
};
