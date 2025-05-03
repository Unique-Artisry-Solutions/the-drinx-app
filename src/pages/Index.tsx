
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import { checkAdminBypassStatus } from '@/utils/adminBypass';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Log information for debugging
  useEffect(() => {
    console.log("Index page loaded");
    console.log("Current URL:", window.location.href);
    console.log("Auth state:", { user: !!user, isLoading });
    
    // Check for admin bypass
    const { isEnabled: isAdminBypass, userType } = checkAdminBypassStatus();
    console.log("Admin bypass status:", { isAdminBypass, userType });
    
    // Log all localStorage keys and values for debugging
    const localStorageKeys = Object.keys(localStorage);
    const localStorageData = {};
    
    localStorageKeys.forEach(key => {
      if (!key.includes('supabase.auth.token')) { // Skip sensitive auth tokens
        localStorageData[key] = localStorage.getItem(key);
      }
    });
    
    console.log("LocalStorage data:", localStorageData);
  }, [user, isLoading]);
  
  // Use useEffect to handle navigation properly
  useEffect(() => {
    // Make sure we're not in a loading state
    if (isLoading) {
      console.log("Index page - Auth is still loading, waiting...");
      return;
    }
    
    // Check for admin bypass first since it overrides normal auth
    const { isEnabled: isAdminBypass, userType: bypassType } = checkAdminBypassStatus();
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    
    if (isAdminBypass || isAdmin) {
      console.log("Index page - Admin bypass or auth active, redirecting");
      
      if (isAdmin) {
        navigate('/admin/system-breakdown', { replace: true });
      } else if (bypassType === 'establishment') {
        navigate('/establishment/dashboard', { replace: true });
      } else if (bypassType === 'promoter') {
        navigate('/promoter/dashboard', { replace: true });
      } else {
        navigate('/explore', { replace: true });
      }
      return;
    }
    
    // For normal authenticated users
    if (user) {
      console.log("Index page - User authenticated, redirecting");
      
      // Check if there's a saved redirect
      const savedRedirect = localStorage.getItem('auth_redirect');
      
      if (savedRedirect) {
        console.log("Index page - Using saved redirect path:", savedRedirect);
        navigate(savedRedirect, { replace: true });
        localStorage.removeItem('auth_redirect');
        return;
      }
      
      // Default redirect based on user type
      const userType = localStorage.getItem('user_type');
      console.log("Index page - Using user type for redirect:", userType);
      
      if (userType === 'establishment') {
        navigate('/establishment/dashboard', { replace: true });
      } else if (userType === 'promoter') {
        navigate('/promoter/dashboard', { replace: true });
      } else {
        navigate('/explore', { replace: true });
      }
      return;
    }
    
    // If user is not authenticated, redirect to landing
    if (!user && !isLoading) {
      console.log("Index page - No authenticated user, redirecting to landing");
      navigate('/landing', { replace: true });
      return;
    }
  }, [user, isLoading, navigate]);

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
