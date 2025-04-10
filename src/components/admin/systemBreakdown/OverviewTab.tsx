
import React from 'react';
import { FeatureItem, ProgressSnapshot, MonthlyProgressData } from './types';
import { Card } from '@/components/ui/card';
import ImplementationOverview from './ImplementationOverview';
import DevelopmentProgressDashboard from './DevelopmentProgressDashboard';

interface OverviewTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
  monthlyProgressData: MonthlyProgressData[];
  currentSnapshot: ProgressSnapshot | null;
  dataValidation: { isValid: boolean, issues: string[] };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  adminFeatures, 
  establishmentFeatures, 
  individualFeatures,
  promoterFeatures,
  monthlyProgressData,
  currentSnapshot,
  dataValidation
}) => {
  console.log("MainOverviewTab props:", {
    adminCount: adminFeatures.length,
    establishmentCount: establishmentFeatures.length,
    individualCount: individualFeatures.length,
    promoterCount: promoterFeatures.length,
    monthlyProgressDataLength: monthlyProgressData.length,
    hasCurrentSnapshot: !!currentSnapshot,
    dataValid: dataValidation.isValid
  });
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
      
      {!dataValidation.isValid && (
        <Card className="bg-amber-50 border-amber-300 p-4 mb-6">
          <h3 className="text-amber-800 font-semibold">Data Validation Warnings</h3>
          <ul className="mt-2 text-sm text-amber-700 list-disc pl-5">
            {dataValidation.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </Card>
      )}
      
      <ImplementationOverview 
        adminFeatures={adminFeatures}
        establishmentFeatures={establishmentFeatures}
        individualFeatures={individualFeatures}
        promoterFeatures={promoterFeatures}
      />
      
      <DevelopmentProgressDashboard 
        adminFeatures={adminFeatures}
        establishmentFeatures={establishmentFeatures}
        individualFeatures={individualFeatures}
        promoterFeatures={promoterFeatures}
        monthlyProgressData={monthlyProgressData}
        currentSnapshot={currentSnapshot}
      />
    </div>
  );
};

export default OverviewTab;
