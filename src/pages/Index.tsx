
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Log information for debugging
  useEffect(() => {
    console.log("Index page loaded");
    console.log("Current URL:", window.location.href);
    console.log("Auth state:", { user: !!user, isLoading });
    
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
      console.log("Auth is still loading, waiting...");
      return;
    }
    
    // Read authentication info
    const userType = localStorage.getItem('user_type');
    const isEstablishment = userType === 'establishment';
    const isPromoter = userType === 'promoter';
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    
    // For debugging
    console.log("Index page navigation check:", { 
      user, 
      isLoading, 
      userType, 
      isEstablishment, 
      isPromoter, 
      isAdmin,
      isAdminBypass,
      userId: user?.id,
      redirectPath: isPromoter ? '/promoter/dashboard' : (isEstablishment ? '/establishment/dashboard' : '/explore')
    });
    
    // If admin is authenticated, redirect to system breakdown page
    if (isAdmin) {
      console.log("Redirecting admin to system breakdown");
      navigate('/admin/system-breakdown', { replace: true });
      return;
    }
    
    // If user is authenticated and is an establishment, redirect to establishment dashboard
    if (user && isEstablishment) {
      console.log("Redirecting establishment to dashboard");
      navigate('/establishment/dashboard', { replace: true });
      return;
    }
    
    // If user is authenticated and is a promoter, redirect to promoter dashboard
    if (user && isPromoter) {
      console.log("Redirecting promoter to dashboard");
      navigate('/promoter/dashboard', { replace: true });
      return;
    }
    
    // If user is authenticated and is an individual, redirect to explore
    if (user && !isEstablishment && !isPromoter) {
      console.log("Redirecting individual user to explore");
      navigate('/explore', { replace: true });
      return;
    }
    
    // For admin bypass (but not regular user)
    if (!user && isAdminBypass) {
      console.log("Admin bypass active but no user object, checking user type for redirect");
      
      if (isPromoter) {
        navigate('/promoter/dashboard', { replace: true });
      } else if (isEstablishment) {
        navigate('/establishment/dashboard', { replace: true });
      } else if (isAdmin) {
        navigate('/admin/system-breakdown', { replace: true });
      } else {
        navigate('/explore', { replace: true });
      }
      return;
    }
    
    // If user is not authenticated, redirect to landing
    if (!user) {
      console.log("Redirecting unauthenticated user to landing");
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
