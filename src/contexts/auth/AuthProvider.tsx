
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from './types';
import { useAuthActions } from './useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const { 
    isLoading: actionLoading, 
    refreshSession: refreshSessionAction,
    signIn: signInAction,
    signUp: signUpAction,
    signOut: signOutAction,
    updateProfile: updateProfileAction
  } = useAuthActions();

  const refreshSession = async () => {
    const result = await refreshSessionAction();
    setSession(result.session);
    setUser(result.user);
    if (result.isEmailVerified !== undefined) {
      setIsEmailVerified(result.isEmailVerified);
    }
  };

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      
      // Set email verification status
      if (data.session?.user) {
        setIsEmailVerified(data.session.user.email_confirmed_at !== null);
      }
      
      setIsLoading(false);
    };

    checkSession();

    // Set up authentication state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Update email verification status
        if (currentSession?.user) {
          setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
          
          if (event === 'SIGNED_IN') {
            // If email is verified, store authentication state in localStorage
            if (currentSession.user.email_confirmed_at) {
              localStorage.setItem('user_authenticated', 'true');
              localStorage.setItem('user_email', currentSession.user.email || '');
              localStorage.setItem('user_type', currentSession.user.user_metadata.user_type || 'individual');
              
              // Redirect to explore if user has just verified email
              if (window.location.href.includes('?email_confirmed=true')) {
                window.location.href = '/explore';
              }
            }
          } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('user_authenticated');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_type');
          }
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    isLoading: isLoading || actionLoading,
    isEmailVerified,
    signIn: signInAction,
    signUp: signUpAction,
    signOut: signOutAction,
    updateProfile: updateProfileAction,
    refreshSession,
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
