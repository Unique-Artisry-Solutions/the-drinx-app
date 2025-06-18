import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserAuth from '@/components/UserAuth';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { Button } from '@/components/ui/button';
import TestCredentials from '@/components/auth/TestCredentials';
import AutoCreateAdminUser from '@/components/auth/AutoCreateAdminUser';
import DevBypassLinks from '@/components/development/DevBypassLinks';

const LoginPage = () => {
  const [requiredUserType, setRequiredUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { goToAfterLogin } = useAppNavigation();
  
  // Refs to prevent duplicate processing
  const processedStateRef = useRef<string>('');
  const navigationHandledRef = useRef(false);
  
  // Check for userType in URL search parameters and location state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlUserType = searchParams.get('userType');
    
    const state = location.state as { 
      userType?: 'individual' | 'establishment' | 'promoter' | 'admin', 
      message?: string 
    };
    
    const stateKey = JSON.stringify({ state, urlUserType });
    
    // Only process if state has actually changed
    if (processedStateRef.current === stateKey) {
      return;
    }
    
    processedStateRef.current = stateKey;
    
    console.log("LoginPage - Processing location state and URL params:", { state, urlUserType });
    
    // Priority: URL parameter > location state
    const userTypeToSet = urlUserType || state?.userType;
    
    if (userTypeToSet && ['individual', 'establishment', 'promoter', 'admin'].includes(userTypeToSet)) {
      console.log("LoginPage - Setting required user type:", userTypeToSet);
      setRequiredUserType(userTypeToSet as 'individual' | 'establishment' | 'promoter' | 'admin');
    }
    
    // If there's a redirect message, display it (only once)
    if (state?.message && !errorMessage) {
      setErrorMessage(state.message);
    }
  }, [location.search, location.state, errorMessage]);
  
  // Handle post-authentication navigation
  useEffect(() => {
    if (isAuthenticated && user && !navigationHandledRef.current) {
      navigationHandledRef.current = true;
      console.log("LoginPage - User authenticated, handling navigation");
      
      // Get saved redirect path
      const savedRedirect = localStorage.getItem('auth_redirect');
      
      // Navigate to appropriate page
      goToAfterLogin(user.user_metadata?.user_type, savedRedirect);
    }
  }, [isAuthenticated, user, goToAfterLogin]);
  
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

  const getUserTypeDisplayName = (userType: string) => {
    switch (userType) {
      case 'establishment':
        return 'Business';
      case 'promoter':
        return 'Promoter';
      case 'admin':
        return 'Admin';
      default:
        return '';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-purple-50">
      {/* Auto-create admin user component */}
      <AutoCreateAdminUser />
      
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
                {requiredUserType !== 'individual' ? ` as ${getUserTypeDisplayName(requiredUserType)}` : ''}
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
            
            {/* Display test credentials */}
            <div className="mt-8">
              <TestCredentials />
            </div>
            
            {/* Add development bypass links */}
            <DevBypassLinks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
