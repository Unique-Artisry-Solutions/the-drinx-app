
import React from 'react';

interface ImplementationStatsProps {
  implementedFeatures: number;
  partialFeatures: number;
  plannedFeatures: number;
  blockedFeatures: number;
  totalFeatures: number;
}

export const ImplementationStats: React.FC<ImplementationStatsProps> = ({
  implementedFeatures,
  partialFeatures,
  plannedFeatures,
  blockedFeatures,
  totalFeatures,
}) => {
  return (
    <div className="text-sm text-gray-500 mb-6">
      {implementedFeatures} of {totalFeatures} features completed
      {partialFeatures > 0 && `, ${partialFeatures} partial`}
      {plannedFeatures > 0 && `, ${plannedFeatures} planned`}
      {blockedFeatures > 0 && `, ${blockedFeatures} blocked`}
    </div>
  );
};
