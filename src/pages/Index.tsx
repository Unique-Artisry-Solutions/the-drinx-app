
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import { checkAdminBypassStatus } from '@/utils/adminBypass';
import { getSessionDebug } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { validateSessionState, syncSessionState } from '@/utils/sessionRecovery';
import { handlePotentialStuckState } from '@/utils/session/recovery';

const Index = () => {
  const { user, isLoading, session, authStable, authError, recoverAuthState } = useAuth();
  const navigate = useNavigate();
  const [hasMismatch, setHasMismatch] = useState(false);
  
  // Set up stuck state detection
  useEffect(() => {
    const stuckHandler = handlePotentialStuckState(8000, false);
    return () => stuckHandler.cancel();
  }, []);
  
  // Check for session mismatches
  useEffect(() => {
    const checkSession = async () => {
      if (!isLoading && authStable) {
        const validationResult = await validateSessionState();
        if (validationResult.hasMismatch) {
          console.log('Session mismatch detected:', validationResult);
          setHasMismatch(true);
        } else {
          setHasMismatch(false);
        }
      }
    };
    
    checkSession();
  }, [isLoading, authStable]);
  
  // Log information for debugging
  useEffect(() => {
    console.log("Index page loaded");
    console.log("Current URL:", window.location.href);
    console.log("Auth state:", { 
      user: !!user, 
      session: !!session, 
      isLoading,
      authStable,
      authError: authError?.message
    });
    
    // Check for admin bypass
    const { isEnabled: isAdminBypass, userType } = checkAdminBypassStatus();
    console.log("Admin bypass status:", { isAdminBypass, userType });
    
    // Always log the current session state
    getSessionDebug();
  }, [user, session, isLoading, authStable, authError]);
  
  // Use useEffect to handle navigation properly
  useEffect(() => {
    // Wait until auth is stable before making navigation decisions
    if (isLoading || !authStable) {
      console.log("Index page - Auth is still loading or not stable, waiting...");
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
    
    // For normal authenticated users - explicitly check both user and session
    if (user && session) {
      console.log("Index page - User authenticated with valid session, redirecting");
      
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
    if ((!user || !session) && !isLoading && authStable) {
      console.log("Index page - No authenticated user/session, redirecting to landing");
      navigate('/landing', { replace: true });
      return;
    }
  }, [user, session, isLoading, navigate, authStable, authError]);

  const handleRecoveryClick = async () => {
    // First try to sync, if that fails then do full recovery
    const result = await validateSessionState();
    
    if (result.hasMismatch) {
      const syncSuccess = await syncSessionState();
      if (!syncSuccess) {
        await recoverAuthState();
      } else {
        window.location.reload();
      }
    } else {
      await recoverAuthState();
    }
  };

  // Show improved loading state
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          {hasMismatch && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-700 mb-2">Session mismatch detected</p>
              <p className="text-sm text-amber-600 mb-3">Your session state is out of sync. This can happen after long periods of inactivity.</p>
              <Button 
                onClick={handleRecoveryClick} 
                variant="outline" 
                className="bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Fix Session
              </Button>
            </div>
          )}
          
          <p className="text-lg mb-2">Loading application...</p>
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your experience</p>
          
          {!authStable && (
            <p className="text-sm text-amber-500 mt-2">Verifying your authentication...</p>
          )}
          
          {authError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 mb-2">Authentication error</p>
              <p className="text-sm text-red-600 mb-3">{authError.message}</p>
              <Button 
                onClick={handleRecoveryClick} 
                variant="outline" 
                className="bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Recover Session
              </Button>
            </div>
          )}
          
          {/* Show recovery button if loading takes too long */}
          {isLoading && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Taking longer than expected?</p>
              <Button 
                onClick={handleRecoveryClick} 
                variant="outline" 
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Reset Session
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
