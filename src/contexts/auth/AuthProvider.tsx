
import React, { createContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SessionStorageManager } from '@/utils/sessionStorage';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: string | null;
  isReady: boolean;
  authStable: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [authStable, setAuthStable] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user || null);
          
          if (session) {
            SessionStorageManager.persistAuthSession(session);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
        setIsReady(true);
        setAuthStable(true);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session) {
          SessionStorageManager.persistAuthSession(session);
        } else {
          SessionStorageManager.clearAuthSession();
        }
        
        setIsLoading(false);
        setIsReady(true);
        setAuthStable(true);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Determine user type from dev mode or session
  const userType = SessionStorageManager.getItem<string>('dev_user_type') || 
    (user ? 'individual' : null);

  const isAuthenticated = !!user || !!SessionStorageManager.getItem('dev_user_type');

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    userType,
    isReady,
    authStable,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
