
import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FeatureId, FEATURES } from '@/lib/features/registry';
import { checkFeatureAccess, trackFeatureEvent } from '@/lib/features/api';

interface FeatureContextType {
  hasAccess: (featureId: FeatureId) => boolean;
  checkAccess: (featureId: FeatureId) => Promise<boolean>;
  trackFeatureUsage: (featureId: FeatureId, eventType?: string, data?: Record<string, any>) => void;
  featureAccess: Record<FeatureId, boolean>;
  loading: Record<FeatureId, boolean>;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featureAccess, setFeatureAccess] = useState<Record<FeatureId, boolean>>({} as Record<FeatureId, boolean>);
  const [loading, setLoading] = useState<Record<FeatureId, boolean>>({} as Record<FeatureId, boolean>);
  
  const checkAccessForFeature = useCallback(async (featureId: FeatureId): Promise<boolean> => {
    setLoading(prev => ({ ...prev, [featureId]: true }));
    
    try {
      const hasAccess = await checkFeatureAccess(featureId);
      setFeatureAccess(prev => ({ ...prev, [featureId]: hasAccess }));
      return hasAccess;
    } catch (error) {
      console.error(`Error checking access for feature ${featureId}:`, error);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, [featureId]: false }));
    }
  }, []);
  
  const hasAccessToFeature = useCallback((featureId: FeatureId): boolean => {
    if (featureId in featureAccess) {
      return featureAccess[featureId];
    }
    
    // Default to feature default setting if not checked yet
    return true; // Temporarily always return true
  }, [featureAccess]);
  
  const trackFeatureUsage = useCallback((featureId: FeatureId, eventType: string = 'use', data: Record<string, any> = {}) => {
    trackFeatureEvent(featureId, eventType, data);
  }, []);
  
  return (
    <FeatureContext.Provider
      value={{
        hasAccess: hasAccessToFeature,
        checkAccess: checkAccessForFeature,
        trackFeatureUsage,
        featureAccess,
        loading
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatures = (): FeatureContextType => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
};
