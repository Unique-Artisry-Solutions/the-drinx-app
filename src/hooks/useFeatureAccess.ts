
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { FeatureId, getFeature } from '@/lib/features/registry';
import { checkFeatureAccess, trackFeatureEvent } from '@/lib/features/api';

/**
 * Hook to check if a user has access to a particular feature
 */
export function useFeatureAccess() {
  const { user } = useAuth();
  // Get isAdmin value safely (assuming admin users have user_type === 'admin' in their user metadata)
  const isAdmin = user?.user_metadata?.user_type === 'admin' || false;
  
  const [featureAccess, setFeatureAccess] = useState<Record<FeatureId, boolean>>({} as Record<FeatureId, boolean>);
  const [loading, setLoading] = useState<Record<FeatureId, boolean>>({} as Record<FeatureId, boolean>);

  // Fetch feature access for a specific feature
  const checkAccess = useCallback(async (featureId: FeatureId): Promise<boolean> => {
    // Admin override
    if (isAdmin) {
      return true;
    }

    // Not logged in
    if (!user) {
      return false;
    }

    setLoading(prev => ({ ...prev, [featureId]: true }));
    
    try {
      // Check feature access
      const hasAccess = await checkFeatureAccess(featureId);
      
      // Update cache
      setFeatureAccess(prev => ({ ...prev, [featureId]: hasAccess }));
      return hasAccess;
    } catch (error) {
      console.error(`Error checking access for feature ${featureId}:`, error);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, [featureId]: false }));
    }
  }, [user, isAdmin]);

  // Check if a user has access to a specific feature
  const hasAccess = useCallback((featureId: FeatureId): boolean => {
    // Admin override
    if (isAdmin) {
      return true;
    }
    
    // Access already checked and cached
    if (featureId in featureAccess) {
      return featureAccess[featureId];
    }
    
    // Feature doesn't exist or is not defined
    const feature = getFeature(featureId);
    if (!feature) {
      return false;
    }
    
    // Default to feature default setting if not checked yet
    return feature.defaultEnabled;
  }, [featureAccess, isAdmin]);

  // Track feature usage
  const trackFeatureUsage = useCallback((featureId: FeatureId, eventType: string = 'use', data: Record<string, any> = {}) => {
    trackFeatureEvent(featureId, eventType, data);
  }, []);

  // Preemptively load feature access flags when user logs in
  useEffect(() => {
    // Don't do anything if no user is logged in
    if (!user) {
      setFeatureAccess({} as Record<FeatureId, boolean>);
      return;
    }
  }, [user]);

  return {
    hasAccess,
    checkAccess,
    trackFeatureUsage,
    loading,
    featureAccess,
  };
}
