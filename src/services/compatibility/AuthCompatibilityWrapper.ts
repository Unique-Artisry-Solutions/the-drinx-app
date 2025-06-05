
// Phase 3 Alternative: Auth Compatibility Wrapper
// Provides a bridge between different auth implementations without breaking existing code

import { useAuth as useContextAuth } from '@/contexts/auth/AuthProvider';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

// Compatibility interface that supports both old and new patterns
export interface CompatibleAuthState {
  // Core state (from context)
  user: any;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: string;
  
  // Extended state (for compatibility)
  authStable?: boolean;
  isReady?: boolean;
  isUsingDevBypass?: boolean;
  error?: string | null;
}

export interface CompatibleAuthActions {
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (formData: any) => Promise<any>;
  signOut: () => Promise<void>;
  updateUserProfile?: (data: any) => Promise<void>;
  refreshSession?: () => Promise<any>;
}

export interface CompatibleAuthReturn {
  // Direct properties (current pattern)
  user: any;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: string;
  
  // Grouped properties (future pattern)
  state: CompatibleAuthState;
  actions: CompatibleAuthActions;
  
  // Legacy compatibility
  authStable: boolean;
  isReady: boolean;
  isUsingDevBypass?: boolean;
}

// Primary compatibility wrapper
export function useCompatibleAuth(): CompatibleAuthReturn {
  const contextAuth = useContextAuth();
  const devBypass = useDevAuthBypass();
  const authenticatedUser = useAuthenticatedUser();
  
  // Use context auth as primary, fall back to others for missing properties
  const user = contextAuth?.user || devBypass?.user || authenticatedUser?.user;
  const isAuthenticated = contextAuth?.isAuthenticated ?? devBypass?.isAuthenticated ?? authenticatedUser?.isAuthenticated ?? false;
  const userType = contextAuth?.userType || devBypass?.userType || authenticatedUser?.userType || 'individual';
  const isLoading = contextAuth?.isLoading ?? devBypass?.isLoading ?? authenticatedUser?.isLoading ?? false;
  
  const state: CompatibleAuthState = {
    user,
    session: contextAuth?.session || null,
    isLoading,
    isAuthenticated,
    userType,
    authStable: contextAuth?.authStable ?? true,
    isReady: !isLoading,
    isUsingDevBypass: devBypass?.isUsingDevBypass,
    error: null
  };
  
  const actions: CompatibleAuthActions = {
    signIn: contextAuth?.signIn || (async () => ({ error: null, data: null })),
    signUp: contextAuth?.signUp || (async () => ({ error: null, data: null })),
    signOut: contextAuth?.signOut || (async () => {}),
    updateUserProfile: contextAuth?.updateUserProfile,
    refreshSession: contextAuth?.refreshSession
  };
  
  return {
    // Direct properties
    user,
    session: state.session,
    isLoading,
    isAuthenticated,
    userType,
    
    // Grouped properties
    state,
    actions,
    
    // Legacy compatibility
    authStable: state.authStable!,
    isReady: state.isReady!,
    isUsingDevBypass: state.isUsingDevBypass
  };
}
