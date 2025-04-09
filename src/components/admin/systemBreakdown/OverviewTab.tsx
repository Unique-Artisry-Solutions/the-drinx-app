
import React from 'react';
import ImplementationOverview from './ImplementationOverview';
import DevelopmentProgressDashboard from './DevelopmentProgressDashboard';
import { FeatureItem } from './types';

interface OverviewTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures
}) => {
  return (
    <div className="space-y-6">
      <DevelopmentProgressDashboard 
        adminFeatures={adminFeatures}
        establishmentFeatures={establishmentFeatures}
        individualFeatures={individualFeatures}
      />
      
      <ImplementationOverview
        adminFeatures={adminFeatures}
        establishmentFeatures={establishmentFeatures}
        individualFeatures={individualFeatures}
      />
    </div>
  );
};

export default OverviewTab;
