
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import { emergencyResetAllStorage } from '@/utils/sessionCleaner';
import { performRedirect, isRedirectLoop } from '@/utils/redirectUtils';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  
  // Generate a unique ID for this page instance
  const pageId = React.useId();
  
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
  
  // Handle the emergency reset
  const handleEmergencyReset = () => {
    if (window.confirm('WARNING: This will reset ALL authentication data and may log you out of the application. Continue?')) {
      setIsResetting(true);
      setResetError('');
      
      // Small delay to allow UI to update
      setTimeout(() => {
        try {
          // Perform the reset
          const success = emergencyResetAllStorage();
          setResetSuccess(success);
          console.log(`[INDEX ${pageId}] Emergency reset completed successfully:`, success);
          
          // Reload the page after reset to ensure clean state
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } catch (err) {
          console.error(`[INDEX ${pageId}] Error during emergency reset:`, err);
          setResetSuccess(false);
          setResetError(err.message || 'Unknown error during reset');
        } finally {
          setIsResetting(false);
        }
      }, 100);
    }
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
          
          {/* Emergency Reset Section */}
          <div className="mt-8 border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Authentication Troubleshooting</p>
            
            {resetSuccess && (
              <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-md">
                Storage successfully cleared. The page will refresh automatically.
              </div>
            )}
            
            {resetError && (
              <div className="mb-4 p-2 bg-red-100 text-red-800 rounded-md">
                Error: {resetError}
              </div>
            )}
            
            <button 
              onClick={handleEmergencyReset}
              disabled={isResetting}
              className={`w-full mt-2 text-sm px-4 py-2 rounded-md transition-colors 
                ${isResetting 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
            >
              {isResetting ? 'Clearing Storage...' : 'Emergency Authentication Reset'}
            </button>
            
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
