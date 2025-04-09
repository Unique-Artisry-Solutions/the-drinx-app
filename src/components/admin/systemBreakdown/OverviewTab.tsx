
import React from 'react';
import ImplementationOverview from './ImplementationOverview';
import DevelopmentProgressDashboard from './DevelopmentProgressDashboard';
import { FeatureItem, MonthlyProgressData, ProgressSnapshot } from './types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface OverviewTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  monthlyProgressData?: MonthlyProgressData[];
  currentSnapshot?: ProgressSnapshot | null;
  dataValidation?: { isValid: boolean; issues: string[] };
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  monthlyProgressData = [],
  currentSnapshot = null,
  dataValidation = { isValid: true, issues: [] }
}) => {
  return (
    <div className="space-y-6">
      {!dataValidation.isValid && dataValidation.issues.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Validation Warnings</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              {dataValidation.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <DevelopmentProgressDashboard 
        adminFeatures={adminFeatures}
        establishmentFeatures={establishmentFeatures}
        individualFeatures={individualFeatures}
        monthlyProgressData={monthlyProgressData}
        confidenceScore={currentSnapshot?.confidenceScore}
      />
      
      <ImplementationOverview
        adminFeatures={adminFeatures}
        establishmentFeatures={establishmentFeatures}
        individualFeatures={individualFeatures}
        confidenceScore={currentSnapshot?.confidenceScore}
      />
    </div>
  );
};

export default OverviewTab;
