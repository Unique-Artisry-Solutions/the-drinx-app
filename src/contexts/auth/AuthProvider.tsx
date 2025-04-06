
import React, { createContext, useContext } from 'react';
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

  const handleSignOut = async () => {
    // Clear all authentication-related state before calling signout
    // This ensures immediate UI update even before the async operation completes
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_username');
    
    // Check if we need to clear admin bypass
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    if (isAdminBypass) {
      localStorage.removeItem('admin_bypass');
      localStorage.removeItem('admin_authenticated');
      
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      
      toast({
        title: "Logged out",
        description: "Admin bypass session cleared"
      });
      
      return;
    }
    
    // Normal signout
    setUser(null);
    setSession(null);
    setIsEmailVerified(false);
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
