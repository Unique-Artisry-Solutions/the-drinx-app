
import { useState, useEffect, useCallback } from 'react';
import { useAuth as useSupabaseAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

export interface AuthState {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: 'individual' | 'establishment' | 'promoter' | 'admin';
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData?: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  switchRole: (role: string) => Promise<void>;
}

export function useAuth(): { state: AuthState; actions: AuthActions } {
  const auth = useSupabaseAuth();
  const { toast } = useToast();
  
  const [error, setError] = useState<string | null>(null);

  const state: AuthState = {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    error
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      // Use the auth context's login method
      await auth.login?.(email, password);
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
  }, [auth.login, toast]);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await auth.logout?.();
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
  }, [auth.logout, toast]);

  const signup = useCallback(async (email: string, password: string, userData?: any) => {
    try {
      setError(null);
      await auth.signup?.(email, password, userData);
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
  }, [auth.signup, toast]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      await auth.resetPassword?.(email);
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
  }, [auth.resetPassword, toast]);

  const updateProfile = useCallback(async (updates: any) => {
    try {
      setError(null);
      await auth.updateProfile?.(updates);
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
  }, [auth.updateProfile, toast]);

  const switchRole = useCallback(async (role: string) => {
    try {
      setError(null);
      await auth.switchRole?.(role);
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
  }, [auth.switchRole, toast]);

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
