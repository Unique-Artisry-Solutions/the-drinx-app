
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { getSessionDebug } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
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
  
  // Smart routing logic
  useEffect(() => {
    console.log("Index page loaded - Smart routing check");
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

    // If auth is stable and we have no user, redirect to landing page
    if (authStable && !user && !isLoading) {
      console.log("No authenticated user - redirecting to landing page");
      navigate('/landing', { replace: true });
      return;
    }

    // If user is authenticated and navigation is ready, redirect based on user type
    if (user && navigationReady && authStable) {
      console.log("Authenticated user detected - redirecting based on user type:", userType);
      
      switch (userType) {
        case 'promoter':
          navigate('/promoter-dashboard', { replace: true });
          break;
        case 'establishment':
          navigate('/establishment-dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/system-breakdown', { replace: true });
          break;
        default:
          navigate('/explore', { replace: true });
          break;
      }
    }
  }, [user, session, isLoading, authStable, userType, navigationReady, authError, navigate]);
  
  const handleRecovery = () => {
    recoverAuthState();
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
          
          {authError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 mb-2">Authentication error</p>
              <p className="text-sm text-red-600 mb-3">{authError.message}</p>
              
              <Button 
                onClick={handleRecovery} 
                variant="outline" 
                className="bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Try Again
              </Button>
            </div>
          )}
          
          {/* Show recovery options if loading takes too long */}
          {(isLoading || !navigationReady) && !authError && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">Taking longer than expected?</p>
              
              <Button 
                onClick={handleRecovery} 
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
