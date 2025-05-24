
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { getSessionDebug } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
      authError: authError?.message
    });
    
    // Always log the current session state
    getSessionDebug();
  }, [user, session, isLoading, authStable, userType, navigationReady, authError]);
  
  // Note: Removed all manual navigation - AuthProvider handles everything automatically
  // The AuthProvider will redirect users based on their authentication state and userType
  
  const handleRecoveryClick = () => {
    recoverAuthState();
  };

  // Show improved loading state with more detailed information
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg mb-2">Loading application...</p>
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your experience</p>
          
          {!authStable && (
            <p className="text-sm text-amber-500 mt-2">Verifying your authentication...</p>
          )}
          
          {!navigationReady && authStable && (
            <p className="text-sm text-blue-500 mt-2">Determining user type...</p>
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
          {(isLoading || !navigationReady) && !authError && (
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
