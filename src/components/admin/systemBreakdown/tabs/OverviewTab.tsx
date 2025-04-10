
import React from 'react';
import { BarChart3, Code, Database } from 'lucide-react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import ProgressCard from '../components/ProgressCard';
import StatusProgressBar from '../components/StatusProgressBar';
import { FeatureItem, ProgressSnapshot } from '../types';

interface OverviewTabProps {
  overallProgressPercentage: number;
  frontendProgressPercentage: number;
  backendProgressPercentage: number;
  implementedFeatures: number;
  partialFeatures: number;
  totalFeatures: number;
  confidenceScore?: number;
  currentSnapshot?: ProgressSnapshot;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  overallProgressPercentage,
  frontendProgressPercentage,
  backendProgressPercentage,
  implementedFeatures,
  partialFeatures,
  totalFeatures,
  confidenceScore,
  currentSnapshot
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProgressCard 
          title="Overall Progress" 
          percentage={overallProgressPercentage} 
          description="All features combined"
          icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
          confidenceScore={confidenceScore}
        />
        <ProgressCard 
          title="Frontend Progress" 
          percentage={frontendProgressPercentage} 
          description="UI components & interactions"
          icon={<Code className="h-5 w-5 text-purple-500" />}
          confidenceScore={confidenceScore}
        />
        <ProgressCard 
          title="Backend Progress" 
          percentage={backendProgressPercentage} 
          description="Database & services"
          icon={<Database className="h-5 w-5 text-green-500" />}
          confidenceScore={confidenceScore}
        />
      </div>
      
      <div className="mt-6 border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-3">Feature Status Breakdown</h3>
        <div className="space-y-3">
          <StatusProgressBar 
            label="Implemented"
            count={implementedFeatures}
            total={totalFeatures}
            color="bg-green-500"
            icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
          />
          <StatusProgressBar 
            label="Partial"
            count={partialFeatures}
            total={totalFeatures}
            color="bg-amber-500"
            icon={<Clock className="h-4 w-4 text-amber-500" />}
          />
          <StatusProgressBar 
            label="Planned/Not Started"
            count={totalFeatures - implementedFeatures - partialFeatures}
            total={totalFeatures}
            color="bg-gray-300"
            icon={<AlertCircle className="h-4 w-4 text-gray-500" />}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
