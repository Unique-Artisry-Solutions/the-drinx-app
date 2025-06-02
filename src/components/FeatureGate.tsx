
import React from 'react';
import { useFeatures } from '@/contexts/FeatureContext';

interface FeatureGateProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiresPremium?: boolean;
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
  showUpgradePrompt?: boolean;
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  featureKey,
  children,
  fallback = null,
  requiresPremium = false,
  userType,
  showUpgradePrompt = false
}) => {
  const { features, isLoading } = useFeatures();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  const isFeatureEnabled = features[featureKey];

  if (!isFeatureEnabled) {
    if (showUpgradePrompt) {
      return (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <h3 className="font-semibold text-gray-700 mb-2">Premium Feature</h3>
          <p className="text-gray-600 text-sm mb-3">
            This feature requires a premium subscription to access.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            Upgrade Now
          </button>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default FeatureGate;
