import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserAuth from '@/components/UserAuth';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import TestCredentials from '@/components/auth/TestCredentials';

const LoginPage = () => {
  const [requiredUserType, setRequiredUserType] = useState<'individual' | 'establishment' | 'promoter'>('individual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // Check for userType in the location state
  useEffect(() => {
    const state = location.state as { 
      userType?: 'individual' | 'establishment' | 'promoter', 
      message?: string 
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
  }, [location]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      console.log("LoginPage - User already authenticated, redirecting");
      
      // Check if there's a saved redirect
      const savedRedirect = localStorage.getItem('auth_redirect');
      
      if (savedRedirect) {
        console.log("LoginPage - Found saved redirect path:", savedRedirect);
        navigate(savedRedirect);
        localStorage.removeItem('auth_redirect');
      } else {
        // Default redirect based on user type
        const userType = localStorage.getItem('user_type');
        console.log("LoginPage - No saved redirect, using user type for redirect:", userType);
        
        if (userType === 'establishment') {
          navigate('/establishment/dashboard');
        } else if (userType === 'promoter') {
          navigate('/promoter/dashboard');
        } else {
          navigate('/explore');
        }
      }
    }
  }, [user, isLoading, navigate]);
  
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
