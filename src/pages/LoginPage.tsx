
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserAuth from '@/components/UserAuth';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import TestCredentials from '@/components/auth/TestCredentials';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [requiredUserType, setRequiredUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, authStable } = useAuth();
  
  // Check for userType and message in the location state
  useEffect(() => {
    const state = location.state as { 
      userType?: 'individual' | 'establishment' | 'promoter', 
      message?: string,
      from?: string
    };

    console.log("LoginPage - Location state:", state);
    
    if (state?.userType) {
      console.log("LoginPage - Setting required user type from state:", state.userType);
      setRequiredUserType(state.userType);
    }
    
    // If there's a redirect message, display it
    if (state?.message) {
      setErrorMessage(state.message);
    }
    
    // Save the 'from' path for post-login redirect
    if (state?.from) {
      localStorage.setItem('auth_redirect', state.from);
    }
  }, [location]);
  
  // Handle session recovery if needed
  const handleSessionRecovery = async () => {
    setIsRecovering(true);
    const { recoverAuthState } = useAuth();
    const recovered = await recoverAuthState();
    setIsRecovering(false);
    
    if (recovered) {
      setErrorMessage(null);
    }
  };
  
  // Redirect if already logged in
  useEffect(() => {
    if (authStable && isAuthenticated && user) {
      console.log("LoginPage - User already authenticated, redirecting");
      
      // Check if there's a saved redirect
      const savedRedirect = localStorage.getItem('auth_redirect');
      
      if (savedRedirect) {
        console.log("LoginPage - Found saved redirect path:", savedRedirect);
        navigate(savedRedirect, { replace: true });
        localStorage.removeItem('auth_redirect');
      } else {
        // Default redirect based on user type
        const userType = localStorage.getItem('user_type');
        console.log("LoginPage - No saved redirect, using user type for redirect:", userType);
        
        if (userType === 'establishment') {
          navigate('/establishment/dashboard', { replace: true });
        } else if (userType === 'promoter') {
          navigate('/promoter/dashboard', { replace: true });
        } else {
          navigate('/explore', { replace: true });
        }
      }
    }
  }, [user, isLoading, navigate, isAuthenticated, authStable]);
  
  // Always force light theme for login page
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);
  
  // Clear error message after 10 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-purple-50">
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
                {requiredUserType !== 'individual' ? ` as ${requiredUserType}` : ''}
              </p>
              
              {errorMessage && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Issue</AlertTitle>
                  <AlertDescription>
                    {errorMessage}
                    <div className="mt-2 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setErrorMessage(null)}
                      >
                        Dismiss
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleSessionRecovery}
                        disabled={isRecovering}
                      >
                        {isRecovering ? 'Recovering...' : 'Recover Session'}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            {/* Show loading indicator while recovering */}
            {isRecovering ? (
              <div className="text-center p-8">
                <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Recovering your session...</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
