
import React, { useEffect } from 'react';
import { useFeatures } from '@/contexts/FeatureContext';
import { FeatureId } from '@/lib/features/registry';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FeatureGateProps {
  /**
   * The feature ID to check access for
   */
  feature: FeatureId;
  /**
   * The content to render if the user has access to the feature
   */
  children: React.ReactNode;
  /**
   * Optional fallback content to render if the user doesn't have access
   */
  fallback?: React.ReactNode;
  /**
   * Whether to show an upgrade prompt when access is denied
   * @default true
   */
  showUpgradePrompt?: boolean;
  /**
   * Event name to use when tracking feature access attempts
   * @default "view"
   */
  trackingEventName?: string;
}

/**
 * FeatureGate component to conditionally render content based on feature access
 * 
 * This component renders its children only if the user has access to the specified feature.
 * Otherwise, it renders fallback content or an upgrade prompt.
 * 
 * @example
 * <FeatureGate feature={FEATURES.ADVANCED_ANALYTICS}>
 *   <AdvancedAnalytics />
 * </FeatureGate>
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
 * Hook for conditionally executing code based on feature access
 * 
 * @example
 * const { whenEnabled } = useFeatureToggle(FEATURES.BULK_MESSAGING);
 * 
 * whenEnabled(() => {
 *   // This code only runs if the user has access to bulk messaging
 *   sendBulkMessages();
 * }, () => {
 *   // Optional fallback function if access is denied
 *   showUpgradeMessage();
 * });
 */
export const useFeatureToggle = (featureId: FeatureId) => {
  const { hasAccess, trackFeatureUsage } = useFeatures();
  
  /**
   * Conditionally executes a callback if the user has access to the feature
   * @param callback Function to execute if the user has access
   * @param fallback Optional function to execute if the user doesn't have access
   * @returns The result of the executed callback, or undefined
   */
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
