
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import { emergencyResetAllStorage } from '@/utils/sessionCleaner';
import { performRedirect, isRedirectLoop } from '@/utils/redirectUtils';
import { Button } from '@/components/ui/button';
import { debouncedToast } from '@/utils/debouncedToast';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<boolean | null>(null);
  const [resetMessage, setResetMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Generate a unique ID for this page instance
  const pageId = React.useId();
  
  // Add maximum wait time for loading
  useEffect(() => {
    // If we're still loading after 15 seconds, show timeout message
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log(`[INDEX ${pageId}] Loading timeout reached after 15 seconds`);
        setLoadingTimeout(true);
      }
    }, 15000);
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, pageId]);
  
  // Log information for debugging
  useEffect(() => {
    console.log(`[INDEX ${pageId}] Index page loaded at ${new Date().toISOString()}`);
    console.log(`[INDEX ${pageId}] Current URL:`, window.location.href);
    console.log(`[INDEX ${pageId}] Auth state:`, { user: !!user, isLoading });
    
    // Check for auth debugging flags
    const urlParams = new URLSearchParams(window.location.search);
    const debugAuth = urlParams.get('debug_auth') === 'true';
    
    if (debugAuth) {
      // Log all localStorage keys and values for debugging
      const localStorageKeys = Object.keys(localStorage);
      const localStorageData = {};
      
      localStorageKeys.forEach(key => {
        if (!key.includes('supabase.auth.token')) { // Skip sensitive auth tokens
          localStorageData[key] = localStorage.getItem(key);
        }
      });
      
      console.log(`[INDEX ${pageId}] LocalStorage data:`, localStorageData);
    }
  }, [user, isLoading, pageId]);
  
  // Handle showing the confirmation dialog
  const handleResetRequest = () => {
    setShowConfirm(true);
  };
  
  // Handle the emergency reset
  const handleEmergencyReset = () => {
    setIsResetting(true);
    setResetSuccess(null);
    setResetMessage('');
    
    // Small delay to allow UI to update
    setTimeout(() => {
      try {
        // Perform the reset
        const result = emergencyResetAllStorage();
        setResetSuccess(result.success);
        setResetMessage(result.message);
        
        console.log(`[INDEX ${pageId}] Emergency reset completed:`, result);
        
        // Reload the page after reset to ensure clean state
        if (result.success) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (err) {
        console.error(`[INDEX ${pageId}] Error during emergency reset:`, err);
        setResetSuccess(false);
        setResetMessage(err instanceof Error ? err.message : 'Unknown error during reset');
      } finally {
        setIsResetting(false);
        setShowConfirm(false);
      }
    }, 100);
  };
  
  // Cancel the reset
  const handleCancelReset = () => {
    setShowConfirm(false);
  };
  
  // Force navigation to login if loading times out
  const handleForceLoginNavigation = () => {
    console.log(`[INDEX ${pageId}] User manually navigating to login page`);
    breakRedirectLoop();
    window.location.href = '/login';
  };
  
  // Function to break redirect loops and clear any problematic state
  const breakRedirectLoop = () => {
    console.log(`[INDEX ${pageId}] Breaking potential redirect loop`);
    localStorage.removeItem('redirect_count');
    localStorage.removeItem('last_redirect_time');
    localStorage.removeItem('login_success');
    localStorage.removeItem('login_success_timestamp');
    localStorage.removeItem('login_user_type');
    localStorage.removeItem('auth_redirect');
    localStorage.removeItem('login_redirect');
  };
  
  // Use useEffect to handle navigation properly
  useEffect(() => {
    // Check for redirect loop prevention
    if (isRedirectLoop()) {
      console.log(`[INDEX ${pageId}] Detected redirect loop, staying on index page`);
      return;
    }
    
    // Make sure we're not in a loading state
    if (isLoading) {
      console.log(`[INDEX ${pageId}] Auth is still loading, waiting...`);
      return;
    }
    
    // Read authentication info
    const userType = localStorage.getItem('user_type');
    const isEstablishment = userType === 'establishment';
    const isPromoter = userType === 'promoter';
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    
    // Redirect path determination
    let redirectPath = '/landing';
    
    if (user || isAdminBypass) {
      if (isAdmin) {
        redirectPath = '/admin/system-breakdown';
      } else if (isPromoter) {
        redirectPath = '/promoter/dashboard';
      } else if (isEstablishment) {
        redirectPath = '/establishment/dashboard';
      } else {
        redirectPath = '/explore';
      }
    }
    
    // For debugging
    console.log(`[INDEX ${pageId}] Navigation check:`, { 
      user: !!user, 
      isLoading, 
      userType, 
      isEstablishment, 
      isPromoter, 
      isAdmin,
      isAdminBypass,
      userId: user?.id,
      redirectPath
    });
    
    // Use the centralized redirect utility
    performRedirect(redirectPath, navigate, {
      userType,
      isFullPageRefresh: isPromoter,
      source: `index_${pageId}`
    });
  }, [user, isLoading, navigate, pageId]);

  // If we're still loading, show a loading state
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full">
          <p className="text-lg mb-2 font-medium">Loading application...</p>
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2 mb-6">Please wait while we prepare your experience</p>
          
          {loadingTimeout && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              <p className="font-medium">Taking longer than expected</p>
              <p className="text-sm my-1">The application seems to be having trouble loading.</p>
              <Button variant="outline" 
                className="mt-2 text-sm border-amber-300 hover:bg-amber-100"
                onClick={handleForceLoginNavigation}>
                Go to Login Page
              </Button>
            </div>
          )}
          
          {/* Emergency Reset Section */}
          <div className="mt-8 border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Authentication Troubleshooting</p>
            
            {resetSuccess === true && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                <p className="font-medium">Reset Successful</p>
                <p className="text-sm">{resetMessage}</p>
                <p className="text-xs mt-2">The page will refresh automatically in 2 seconds</p>
              </div>
            )}
            
            {resetSuccess === false && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                <p className="font-medium">Reset Failed</p>
                <p className="text-sm">{resetMessage}</p>
              </div>
            )}
            
            {showConfirm ? (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="font-medium text-amber-800">Confirm Reset</p>
                <p className="text-sm text-amber-700 mb-3">
                  This will clear ALL authentication data and storage. 
                  You will be logged out and redirected to the login page.
                </p>
                <div className="flex justify-between gap-3">
                  <Button
                    variant="outline"
                    className="w-1/2"
                    onClick={handleCancelReset}
                    disabled={isResetting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-1/2"
                    onClick={handleEmergencyReset}
                    disabled={isResetting}
                  >
                    {isResetting ? 'Clearing...' : 'Confirm Reset'}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline"
                className="w-full mt-2 text-sm border-red-200 hover:bg-red-50 text-red-600"
                onClick={handleResetRequest}
                disabled={isResetting}
              >
                {isResetting ? 'Clearing Storage...' : 'Emergency Authentication Reset'}
              </Button>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              This will reset all authentication data and may resolve login issues.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
