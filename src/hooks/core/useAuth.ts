
import { useState, useEffect, useCallback } from 'react';
import { useAuth as useAuthContext } from '@/contexts/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { SwitchableUserRole } from '@/types/userRole';

export interface AuthState {
  user: any;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: string;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  switchRole: (role: SwitchableUserRole) => Promise<void>;
}

export function useAuth(): { state: AuthState; actions: AuthActions } {
  const authContext = useAuthContext();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const state: AuthState = {
    user: authContext?.user || null,
    session: authContext?.session || null,
    isLoading: authContext?.isLoading || false,
    isAuthenticated: authContext?.isAuthenticated || false,
    userType: authContext?.userType || 'individual',
    error
  };

  const actions: AuthActions = {
    login: useCallback(async (email: string, password: string) => {
      try {
        setError(null);
        if (authContext?.signIn) {
          await authContext.signIn(email, password);
        }
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [authContext, toast]),

    logout: useCallback(async () => {
      try {
        setError(null);
        if (authContext?.signOut) {
          await authContext.signOut();
        }
        toast({
          title: 'Success',
          description: 'Logged out successfully',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Logout failed';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [authContext, toast]),

    signup: useCallback(async (userData: any) => {
      try {
        setError(null);
        if (authContext?.signUp) {
          await authContext.signUp(userData);
        }
        toast({
          title: 'Success',
          description: 'Account created successfully',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Signup failed';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [authContext, toast]),

    resetPassword: useCallback(async (email: string) => {
      try {
        setError(null);
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Password reset email sent',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Reset failed';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [toast]),

    updateProfile: useCallback(async (updates: any) => {
      try {
        setError(null);
        if (authContext?.updateUserProfile) {
          await authContext.updateUserProfile(updates);
        }
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Update failed';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [authContext, toast]),

    switchRole: useCallback(async (role: SwitchableUserRole) => {
      try {
        setError(null);
        const { error } = await supabase.rpc('switch_active_role', { role_to_activate: role });
        if (error) throw error;
        toast({
          title: 'Success',
          description: `Switched to ${role} role`,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Role switch failed';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [toast])
  };

  return { state, actions };
}
