
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { FeatureId, FEATURES, getFeature } from '@/lib/features/registry';
import { checkFeatureAccess, trackFeatureEvent } from '@/lib/features/api';
import { useToast } from '@/hooks/use-toast';

interface FeatureContextType {
  hasAccess: (featureId: FeatureId) => boolean;
  checkAccess: (featureId: FeatureId) => Promise<boolean>;
  trackFeatureUsage: (featureId: FeatureId, eventType?: string, data?: Record<string, any>) => void;
  loading: Record<FeatureId, boolean>;
  featureAccess: Record<FeatureId, boolean>;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get isAdmin value safely (assuming admin users have user_type === 'admin' in their user metadata)
  const isAdmin = user?.user_metadata?.user_type === 'admin' || false;
  
  const [featureAccess, setFeatureAccess] = useState<Record<FeatureId, boolean>>({} as Record<FeatureId, boolean>);
  const [loading, setLoading] = useState<Record<FeatureId, boolean>>({} as Record<FeatureId, boolean>);

  // Check if user has access to a specific feature
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
      const hasAccess = await checkFeatureAccess(featureId);
      setFeatureAccess(prev => ({ ...prev, [featureId]: hasAccess }));
      return hasAccess;
    } catch (error) {
      console.error(`Error checking access for feature ${featureId}:`, error);
      toast({
        title: "Feature Access Error",
        description: `Unable to check access for this feature. Please try again later.`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(prev => ({ ...prev, [featureId]: false }));
    }
  }, [user, isAdmin, toast]);

  const hasAccess = useCallback((featureId: FeatureId): boolean => {
    // Admin override
    if (isAdmin) {
      return true;
    }
    
    // Access already checked and cached
    if (featureId in featureAccess) {
      return featureAccess[featureId];
    }
    
    // Default to feature default setting if not checked yet
    const feature = getFeature(featureId);
    if (!feature) {
      return false;
    }
    
    return feature.defaultEnabled;
  }, [featureAccess, isAdmin]);

  const trackFeatureUsage = useCallback((featureId: FeatureId, eventType: string = 'use', data: Record<string, any> = {}) => {
    trackFeatureEvent(featureId, eventType, data);
  }, []);

  // Load feature access for common features when user state changes
  useEffect(() => {
    if (!user) {
      setFeatureAccess({} as Record<FeatureId, boolean>);
      return;
    }

    const loadCommonFeatures = async () => {
      // Load access for all features
      const featureIds = Object.values(FEATURES);
      const accessResults: Record<FeatureId, boolean> = {} as Record<FeatureId, boolean>;

      for (const featureId of featureIds) {
        try {
          accessResults[featureId] = await checkAccess(featureId);
        } catch (error) {
          console.error(`Error loading feature access for ${featureId}:`, error);
          accessResults[featureId] = false;
        }
      }

      setFeatureAccess(accessResults);
    };

    loadCommonFeatures();
  }, [user, checkAccess]);

  return (
    <FeatureContext.Provider value={{
      hasAccess,
      checkAccess,
      trackFeatureUsage,
      loading,
      featureAccess,
    }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatures = () => {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
};
