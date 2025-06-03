
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { FeatureId, getFeature } from '@/lib/features/registry';

/**
 * Simplified hook to check if a user has access to a particular feature
 * Removes complex caching and batch operations for better maintainability
 */
export function useFeatureAccess() {
  const { user } = useAuth();
  // Get isAdmin value safely
  const isAdmin = user?.user_metadata?.user_type === 'admin' || false;

  // Check if a user has access to a specific feature
  const hasAccess = useCallback((featureId: FeatureId): boolean => {
    // Admin override
    if (isAdmin) {
      return true;
    }
    
    // Not logged in
    if (!user) {
      return false;
    }
    
    // Get feature definition
    const feature = getFeature(featureId);
    if (!feature) {
      return false;
    }
    
    // Default to feature default setting
    return feature.defaultEnabled;
  }, [user, isAdmin]);

  // Track feature usage (simplified)
  const trackFeatureUsage = useCallback((featureId: FeatureId, eventType: string = 'use', data: Record<string, any> = {}) => {
    // Simple console logging for now - can be enhanced later
    console.log(`Feature ${featureId} ${eventType}`, data);
  }, []);

  // Simple access check without complex async operations
  const checkAccess = useCallback(async (featureId: FeatureId): Promise<boolean> => {
    return hasAccess(featureId);
  }, [hasAccess]);

  return {
    hasAccess,
    checkAccess,
    trackFeatureUsage,
    loading: {}, // Simplified - no complex loading states
    featureAccess: {}, // Simplified - no complex caching
  };
}
