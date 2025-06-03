import { useState, useEffect, useCallback } from 'react';
import { useAuth as useSupabaseAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState as ContextAuthState, AuthActions as ContextAuthActions } from '@/contexts/auth/types';
import type { SwitchableUserRole, UserRole } from '@/types/userRole';

// Simplified interface that aligns with the existing auth context
export interface AuthState {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: UserRole;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData?: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  switchRole: (role: SwitchableUserRole) => Promise<void>;
}

export function useAuth(): { state: AuthState; actions: AuthActions } {
  const auth = useSupabaseAuth();
  const { toast } = useToast();
  
  const [error, setError] = useState<string | null>(null);

  // Ensure userType is properly typed by providing a fallback
  const getUserType = (): UserRole => {
    if (!auth.userType) return 'individual';
    // Ensure the userType matches our expected union type
    const validTypes = ['individual', 'establishment', 'promoter', 'admin'] as const;
    return validTypes.includes(auth.userType as any) ? auth.userType as any : 'individual';
  };

  const state: AuthState = {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    userType: getUserType(),
    error
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      // Use the auth context's signIn method
      await auth.signIn?.(email, password);
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
      toast({
        title: 'Login Error',
        description: message,
        variant: 'destructive',
      });
    }
  }, [auth.signIn, toast]);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await auth.signOut?.();
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      setError(message);
      toast({
        title: 'Logout Error',
        description: message,
        variant: 'destructive',
      });
    }
  }, [auth.signOut, toast]);

  const signup = useCallback(async (email: string, password: string, userData?: any) => {
    try {
      setError(null);
      await auth.signUp?.(userData || { email, password });
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      setError(message);
      toast({
        title: 'Signup Error',
        description: message,
        variant: 'destructive',
      });
    }
  }, [auth.signUp, toast]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Password reset email sent',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      setError(message);
      toast({
        title: 'Reset Error',
        description: message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updateProfile = useCallback(async (updates: any) => {
    try {
      setError(null);
      await auth.updateUserProfile?.(updates);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      setError(message);
      toast({
        title: 'Update Error',
        description: message,
        variant: 'destructive',
      });
    }
  }, [auth.updateUserProfile, toast]);

  const switchRole = useCallback(async (role: SwitchableUserRole) => {
    try {
      setError(null);
      
      // Check if role is actually switchable
      if (!['individual', 'establishment', 'promoter'].includes(role)) {
        throw new Error('Admin role cannot be switched to via role switching');
      }
      
      // Use Supabase RPC function for role switching if available
      const { error } = await supabase.rpc('switch_active_role', { 
        role_to_activate: role 
      });
      
      if (error) throw error;
      
      // Refresh session to get updated user data
      await auth.refreshSession?.();
      
      toast({
        title: 'Success',
        description: `Switched to ${role} role`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Role switch failed';
      setError(message);
      toast({
        title: 'Role Switch Error',
        description: message,
        variant: 'destructive',
      });
    }
  }, [auth.refreshSession, toast]);

  const actions: AuthActions = {
    login,
    logout,
    signup,
    resetPassword,
    updateProfile,
    switchRole
  };

  return { state, actions };
}
