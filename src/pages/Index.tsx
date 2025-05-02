
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { isPreviewEnvironment } from '@/utils/environment';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
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
      
      // Log all sessionStorage keys
      const sessionStorageKeys = Object.keys(sessionStorage);
      const sessionStorageData = {};
      
      sessionStorageKeys.forEach(key => {
        sessionStorageData[key] = sessionStorage.getItem(key);
      });
      
      console.log(`[INDEX ${pageId}] SessionStorage data:`, sessionStorageData);
    }
    
    // Clear sessions in preview environment to prevent stale data
    if (isPreviewEnvironment()) {
      console.log(`[INDEX ${pageId}] Preview environment detected, clearing sessions`);
      clearAllSessions();
    }
  }, [user, isLoading, pageId]);
  
  // Use useEffect to handle navigation properly
  useEffect(() => {
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
    
    // For promoters, use window.location for a complete reload
    if (isPromoter) {
      console.log(`[INDEX ${pageId}] Redirecting promoter using direct navigation`);
      const redirectUrl = new URL(redirectPath, window.location.origin);
      redirectUrl.searchParams.set('index_ts', Date.now().toString());
      redirectUrl.searchParams.set('index_id', pageId);
      window.location.href = redirectUrl.toString();
      return;
    }
    
    // For everyone else, use React Router
    console.log(`[INDEX ${pageId}] Redirecting to: ${redirectPath}`);
    navigate(redirectPath, { replace: true });
  }, [user, isLoading, navigate, pageId]);

  // If we're still loading, show a loading state
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg mb-2">Loading application...</p>
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your experience</p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
