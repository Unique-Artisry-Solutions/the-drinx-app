
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from './types';
import { useAuthActions } from './useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session expiry time (24 hours)
const SESSION_EXPIRY_TIME = 24 * 60 * 60 * 1000; 

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
    
    // Also update localStorage to ensure consistency
    if (result.user) {
      localStorage.setItem('user_authenticated', 'true');
      if (result.user.email) {
        localStorage.setItem('user_email', result.user.email);
      }
      if (result.user.user_metadata?.user_type) {
        localStorage.setItem('user_type', result.user.user_metadata.user_type);
      }
    }
  };

  useEffect(() => {
    // Check for admin session expiry
    const checkAdminSession = () => {
      const adminSessionCreated = localStorage.getItem('admin_session_created');
      if (adminSessionCreated) {
        const sessionTime = new Date(adminSessionCreated).getTime();
        const currentTime = new Date().getTime();
        
        if (currentTime - sessionTime > SESSION_EXPIRY_TIME) {
          // Admin session expired, log out
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_username');
          localStorage.removeItem('admin_session_created');
          console.log('Admin session expired due to inactivity');
        }
      }
    };
    
    // Check active session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setIsLoading(false);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Set email verification status
        if (data.session?.user) {
          setIsEmailVerified(data.session.user.email_confirmed_at !== null);
          
          // Ensure localStorage is consistent with session state
          localStorage.setItem('user_authenticated', 'true');
          if (data.session.user.email) {
            localStorage.setItem('user_email', data.session.user.email);
          }
          if (data.session.user.user_metadata?.user_type) {
            localStorage.setItem('user_type', data.session.user.user_metadata.user_type);
          }
          if (data.session.user.user_metadata?.username) {
            localStorage.setItem('user_username', data.session.user.user_metadata.username);
          }
        } else {
          // No active session, clear localStorage auth items (except admin)
          if (localStorage.getItem('user_authenticated')) {
            localStorage.removeItem('user_authenticated');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_type');
            localStorage.removeItem('user_username');
          }
        }
        
        checkAdminSession();
        setIsLoading(false);
      } catch (error) {
        console.error('Error in checkSession:', error);
        setIsLoading(false);
      }
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
              localStorage.setItem('user_username', currentSession.user.user_metadata.username || '');
              
              // Redirect to explore if user has just verified email
              if (window.location.href.includes('?email_confirmed=true')) {
                window.location.href = '/explore';
              }
            }
          } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('user_authenticated');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_type');
            localStorage.removeItem('user_username');
          }
        }
        
        setIsLoading(false);
      }
    );

    // Set up a periodic session check and refresh
    const sessionCheckInterval = setInterval(() => {
      refreshSession();
      checkAdminSession();
    }, 15 * 60 * 1000); // Check every 15 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
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
