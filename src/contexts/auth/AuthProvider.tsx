
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { useAuthSetup } from './useAuthSetup';
import { useAuthActions } from './useAuthActions';
import { useSessionRefresh } from './useSessionRefresh';

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize all state first, before any logic that might use the state
  const [authStable, setAuthStable] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  
  // Get auth state from custom hook
  const {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    isEmailVerified,
    setIsEmailVerified,
    checkAdminBypass,
    updateLocalStorage,
    checkAdminSession,
    toast
  } = useAuthState();
  
  // Initialize session refresh functionality first
  const { refreshSession } = useSessionRefresh({
    setIsEmailVerified,
    setAuthError,
    toast
  });
  
  // Then set up auth state and listeners, passing the refreshSession function
  useAuthSetup({
    setSession,
    setUser,
    setIsEmailVerified,
    setIsLoading,
    updateLocalStorage,
    checkAdminBypass,
    checkAdminSession,
    refreshSession,
    setAuthStable,
    toast
  });

  // Auth action handlers
  const {
    signIn,
    signUp,
    signOut,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
    recoverAuthState
  } = useAuthActions({
    setSession,
    setUser,
    setIsLoading,
    setIsEmailVerified,
    setIsVerificationEmailSent,
    setAuthError,
    updateLocalStorage,
    toast
  });
  
  // Allow bypassing auth in preview environments
  const continueAsGuest = () => {
    // Mark as authenticated guest for preview purposes
    localStorage.setItem('preview_mode', 'true');
    localStorage.setItem('demo_mode', 'true');
    localStorage.setItem('guest_authenticated', 'true');
    
    // Force auth stable state
    setAuthStable(true);
    setIsLoading(false);
    
    // Redirect happens in components that use this function
  };
  
  // Expose auth context values
  const contextValue: AuthContextType = {
    session,
    user,
    isAuthenticated: !!user,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
    continueAsGuest
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
