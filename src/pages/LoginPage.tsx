
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserAuth from '@/components/UserAuth';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const [requiredUserType, setRequiredUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // Generate a unique ID for this page instance for tracking
  const pageId = React.useId();
  
  // For debugging
  useEffect(() => {
    // Log page load with timestamp
    const timestamp = new Date().toISOString();
    console.log(`[LOGIN PAGE ${pageId}] Page loaded at ${timestamp}`, {
      path: location.pathname,
      search: location.search,
      authState: { user: !!user, isLoading }
    });

    // Log auth related storage flags
    console.log(`[LOGIN PAGE ${pageId}] Storage state:`, {
      // Session storage flags
      loginSuccess: sessionStorage.getItem('login_success'),
      loginTimestamp: sessionStorage.getItem('login_success_timestamp'),
      loginUserType: sessionStorage.getItem('login_user_type'),
      loginAttemptId: sessionStorage.getItem('login_attempt_id'),
      bypassAttemptId: sessionStorage.getItem('bypass_attempt_id'),
      
      // Local storage flags
      authenticated: localStorage.getItem('user_authenticated'),
      userType: localStorage.getItem('user_type'),
      adminBypass: localStorage.getItem('admin_bypass'),
      redirectPath: localStorage.getItem('auth_redirect')
    });
    
    // Check URL params for debugging
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('debug_auth') === 'true') {
      console.log(`[LOGIN PAGE ${pageId}] Auth debugging enabled`);
    }
    
    // Check if we need an immediate redirect
    const checkForImmediateRedirect = () => {
      // If just logged in as promoter (checked via sessionStorage)
      if (sessionStorage.getItem('login_success') === 'true' && 
          sessionStorage.getItem('login_user_type') === 'promoter' && 
          !isLoading) {
        console.log(`[LOGIN PAGE ${pageId}] Detected successful promoter login, redirecting immediately`);
        
        // Clear tracking flags 
        sessionStorage.removeItem('login_success');
        
        // Get redirect path or use default
        const savedRedirect = localStorage.getItem('auth_redirect') || '/promoter/dashboard';
        localStorage.removeItem('auth_redirect');
        
        // Create URL with timestamp
        const redirectUrl = new URL(savedRedirect, window.location.origin);
        redirectUrl.searchParams.set('redirect_ts', Date.now().toString());
        redirectUrl.searchParams.set('login_page_id', pageId);
        
        console.log(`[LOGIN PAGE ${pageId}] Redirecting to: ${redirectUrl.toString()}`);
        window.location.href = redirectUrl.toString();
        return;
      }
    };
    
    // Run initial check
    checkForImmediateRedirect();
    
    // Also set up an interval to check for changes in session storage
    // This helps catch async login completions
    const intervalId = setInterval(checkForImmediateRedirect, 500);
    
    return () => {
      clearInterval(intervalId);
      console.log(`[LOGIN PAGE ${pageId}] Page unloaded at ${new Date().toISOString()}`);
    };
  }, [location, user, isLoading, pageId]);
  
  // Check for userType in the location state
  useEffect(() => {
    const state = location.state as { 
      userType?: 'individual' | 'establishment' | 'promoter', 
      message?: string 
    };

    console.log(`[LOGIN PAGE ${pageId}] Location state:`, state);
    
    if (state?.userType) {
      console.log(`[LOGIN PAGE ${pageId}] Setting required user type from state:`, state.userType);
      setRequiredUserType(state.userType);
    }
    
    // If there's a redirect message, display it
    if (state?.message) {
      setErrorMessage(state.message);
    }
  }, [location, pageId]);
  
  // Redirect if already logged in
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
  
  // Always force light theme for login page
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);
  
  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-purple-50">
      <div className="container max-w-6xl mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-material-primary hover:underline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-600">
                Sign in to your Spiritless account 
                {requiredUserType !== 'individual' ? ` as ${requiredUserType}` : ''}
              </p>
              
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {errorMessage}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 text-red-500" 
                    onClick={() => setErrorMessage(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              )}
            </div>
            
            <UserAuth 
              defaultTab="login" 
              userType={requiredUserType}
            />
            
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-material-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
