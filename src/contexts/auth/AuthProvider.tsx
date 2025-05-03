import React, { createContext, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from './types';
import { useAuthActions } from './useAuthActions';
import { useAuthState } from './useAuthState';
import { useSessionRefresh } from './useSessionRefresh';
import { useAuthSetup } from './useAuthSetup';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get auth state
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
  
  // Get auth actions
  const { 
    isLoading: actionLoading, 
    refreshSession: refreshSessionAction,
    signIn: signInAction,
    signUp: signUpAction,
    signOut: signOutAction,
    updateProfile: updateProfileAction,
    resetPassword: resetPasswordAction
  } = useAuthActions();

  // Set up session refresh utility
  const { refreshSession } = useSessionRefresh({
    refreshSessionAction,
    setSession,
    setUser,
    setIsEmailVerified,
    updateLocalStorage
  });

  // Set up auth effect
  useAuthSetup({
    setSession,
    setUser,
    setIsEmailVerified,
    setIsLoading,
    updateLocalStorage,
    checkAdminBypass,
    checkAdminSession,
    refreshSession,
    toast
  });

  // Make window.isLoading property available globally for other components
  useEffect(() => {
    window.isLoading = isLoading || actionLoading;
    
    return () => {
      window.isLoading = undefined;
    };
  }, [isLoading, actionLoading]);

  // Add a special listener for promoter logins
  useEffect(() => {
    // Check if there are URL parameters indicating a recent login
    const urlParams = new URLSearchParams(window.location.search);
    const loginTs = urlParams.get('login_ts');
    const loginId = urlParams.get('login_id');
    const bypassTs = urlParams.get('bypass_ts');
    const bypassId = urlParams.get('bypass_id');
    
    if (loginTs && loginId) {
      console.log(`[AUTH PROVIDER] Detected login redirect with ID: ${loginId}, timestamp: ${loginTs}`);
      
      // Verify the user type is set correctly
      const storedUserType = localStorage.getItem('user_type');
      if (storedUserType === 'promoter') {
        console.log(`[AUTH PROVIDER] Promoter login confirmed. Path: ${window.location.pathname}`);
        
        // Ensure we're on a promoter page
        if (!window.location.pathname.startsWith('/promoter')) {
          console.log(`[AUTH PROVIDER] Not on a promoter page, redirecting`);
          window.location.href = '/promoter/dashboard';
        }
      }
    }
    
    if (bypassTs && bypassId) {
      console.log(`[AUTH PROVIDER] Detected bypass login redirect with ID: ${bypassId}, timestamp: ${bypassTs}`);
      
      // Ensure admin bypass is active
      const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
      if (!isAdminBypass) {
        console.warn(`[AUTH PROVIDER] Admin bypass not active but bypass parameters detected`);
      }
    }
    
    // Debug logging for auth state
    if (urlParams.get('debug_auth') === 'true') {
      console.log('[AUTH PROVIDER] Auth debugging enabled. Current state:', { 
        user: !!user,
        session: !!session,
        isLoading,
        userType: localStorage.getItem('user_type'),
        isAdminBypass: localStorage.getItem('admin_bypass'),
      });
    }
  }, [user, window.location.search]);

  const handleSignOut = async () => {
    console.log("[AUTH PROVIDER] Starting sign out process...");
    // Clear local user state first
    setUser(null);
    setSession(null);
    setIsEmailVerified(false);
    
    // Clear all login/bypass tracking from localStorage
    localStorage.removeItem('login_success');
    localStorage.removeItem('login_success_timestamp');
    localStorage.removeItem('login_user_type');
    localStorage.removeItem('login_attempt_id');
    localStorage.removeItem('login_attempt_timestamp');
    localStorage.removeItem('login_requested_usertype');
    localStorage.removeItem('login_redirect');
    
    localStorage.removeItem('bypass_attempt_id');
    localStorage.removeItem('bypass_timestamp');
    localStorage.removeItem('bypass_user_type');
    
    // Then call the signOut action which handles backend and localStorage cleanup
    await signOutAction();
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading: isLoading || actionLoading,
    isEmailVerified,
    signIn: signInAction,
    signUp: signUpAction,
    signOut: handleSignOut,
    updateProfile: updateProfileAction,
    refreshSession,
    resetPassword: resetPasswordAction
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
