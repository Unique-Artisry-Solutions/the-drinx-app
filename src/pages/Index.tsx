
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAuthRecovery } from '@/hooks/useAuthRecovery';
import { getSessionDebug } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { RefreshCw, Shield } from 'lucide-react';

const Index = () => {
  const { 
    user, 
    isLoading, 
    session, 
    authStable, 
    authError, 
    recoverAuthState, 
    userType,
    navigationReady 
  } = useAuth();
  
  const { 
    recoverAuthState: advancedRecovery, 
    quickRecovery, 
    isRecovering,
    recoveryAttempts 
  } = useAuthRecovery();
  
  // Log information for debugging
  useEffect(() => {
    console.log("Index page loaded");
    console.log("Current URL:", window.location.href);
    console.log("Auth state:", { 
      user: !!user, 
      session: !!session, 
      isLoading,
      authStable,
      userType,
      navigationReady,
      authError: authError?.message,
      isRecovering,
      recoveryAttempts
    });
    
    // Always log the current session state
    getSessionDebug();
  }, [user, session, isLoading, authStable, userType, navigationReady, authError, isRecovering, recoveryAttempts]);
  
  const handleBasicRecovery = () => {
    recoverAuthState();
  };

  const handleAdvancedRecovery = () => {
    advancedRecovery();
  };

  const handleQuickRecovery = async () => {
    const success = await quickRecovery();
    if (!success) {
      handleAdvancedRecovery();
    }
  };

  // Show improved loading state with recovery options
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <p className="text-lg mb-2">Loading application...</p>
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your experience</p>
          
          {!authStable && (
            <p className="text-sm text-amber-500 mt-2">Verifying your authentication...</p>
          )}
          
          {!navigationReady && authStable && (
            <p className="text-sm text-blue-500 mt-2">Determining user type...</p>
          )}
          
          {isRecovering && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 mb-1">Recovery in progress...</p>
              <p className="text-sm text-blue-600">Attempt {recoveryAttempts} - Restoring your session</p>
            </div>
          )}
          
          {authError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 mb-2">Authentication error</p>
              <p className="text-sm text-red-600 mb-3">{authError.message}</p>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleQuickRecovery} 
                  variant="outline" 
                  className="bg-white hover:bg-gray-50"
                  disabled={isRecovering}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Quick Recovery
                </Button>
                
                <Button 
                  onClick={handleAdvancedRecovery} 
                  variant="outline" 
                  className="bg-white hover:bg-gray-50"
                  disabled={isRecovering}
                >
                  <Shield className="h-4 w-4 mr-2" /> Advanced Recovery
                </Button>
              </div>
            </div>
          )}
          
          {/* Show recovery options if loading takes too long */}
          {(isLoading || !navigationReady) && !authError && !isRecovering && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">Taking longer than expected?</p>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleQuickRecovery} 
                  variant="outline" 
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Quick Fix
                </Button>
                
                <Button 
                  onClick={handleBasicRecovery} 
                  variant="outline" 
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Reset Session
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
