
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authStable, setAuthStable] = useState(false);
  const [authError, setAuthError] = useState<any>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            setAuthError(error);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
            setIsEmailVerified(!!session?.user?.email_confirmed_at);
            
            // Get user type from profile
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', session.user.id)
                .single();
              
              if (profile?.user_type) {
                setUserType(profile.user_type as any);
              }
            }
          }
          setIsLoading(false);
          setAuthStable(true);
        }
      } catch (error) {
        if (mounted) {
          setAuthError(error);
          setIsLoading(false);
          setAuthStable(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsEmailVerified(!!session?.user?.email_confirmed_at);
          setIsLoading(false);
          setAuthStable(true);
          
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', session.user.id)
              .single();
            
            if (profile?.user_type) {
              setUserType(profile.user_type as any);
            }
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: null, data };
    } catch (error) {
      setAuthError(error);
      return { error: error as Error, data: null };
    }
  };

  const signUp = async (formData: any) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            user_type: formData.userType || 'individual',
            display_name: formData.displayName,
          },
        },
      });

      if (error) throw error;

      setIsVerificationEmailSent(true);
      return { error: null, data };
    } catch (error) {
      setAuthError(error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthError(null);
      await supabase.auth.signOut();
    } catch (error) {
      setAuthError(error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      setSession(session);
      setUser(session?.user ?? null);
      const isVerified = !!session?.user?.email_confirmed_at;
      setIsEmailVerified(isVerified);
      
      return { isEmailVerified: isVerified };
    } catch (error) {
      setAuthError(error);
      return { isEmailVerified: false };
    }
  };

  const recoverAuthState = async () => {
    try {
      await refreshSession();
      return true;
    } catch (error) {
      setAuthError(error);
      return false;
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      setIsVerificationEmailSent(true);
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link',
      });
    } catch (error) {
      setAuthError(error);
      throw error;
    }
  };

  const updateUserProfile = async (data: any) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      setAuthError(error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error) {
      setAuthError(error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    userType,
    navigationReady: authStable,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
