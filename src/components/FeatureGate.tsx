
import React, { useEffect } from 'react';
import { useFeatures } from '@/contexts/FeatureContext';
import { FeatureId } from '@/lib/features/registry';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FeatureGateProps {
  feature: FeatureId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  trackingEventName?: string;
}

/**
 * FeatureGate component to conditionally render content based on feature access
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  trackingEventName = 'view',
}) => {
  const { hasAccess, trackFeatureUsage } = useFeatures();
  const { toast } = useToast();
  
  useEffect(() => {
    // Track attempt to access the feature
    trackFeatureUsage(feature, trackingEventName);
  }, [feature, trackFeatureUsage, trackingEventName]);

  // Check if the user has access to the feature
  const userHasAccess = hasAccess(feature);

  if (userHasAccess) {
    // If the user has access, render the children
    return <>{children}</>;
  }

  // Show the fallback content if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show an upgrade prompt if enabled
  if (showUpgradePrompt) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          This feature requires a subscription upgrade.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            trackFeatureUsage(feature, 'upgrade_prompt_click');
            // Navigate to pricing page
            window.location.href = '/pricing';
          }}
        >
          View Pricing
        </Button>
      </div>
    );
  }

  // If no fallback and no upgrade prompt, render nothing
  return null;
};

/**
 * FeatureToggle component to toggle behavior based on feature access
 * Similar to FeatureGate but doesn't render anything, just conditionally executes functions
 */
export const useFeatureToggle = (featureId: FeatureId) => {
  const { hasAccess, trackFeatureUsage } = useFeatures();
  
  const whenEnabled = (callback: Function, fallback?: Function) => {
    if (hasAccess(featureId)) {
      trackFeatureUsage(featureId, 'use');
      return callback();
    } else if (fallback) {
      return fallback();
    }
    return undefined;
  };
  
  return {
    whenEnabled,
    hasAccess: hasAccess(featureId),
    trackUsage: (eventType?: string, data?: Record<string, any>) => 
      trackFeatureUsage(featureId, eventType, data),
  };
};

export default FeatureGate;
