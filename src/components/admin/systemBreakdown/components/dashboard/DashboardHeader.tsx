
import React from 'react';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  overallProgressPercentage: number;
  confidenceScore?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  overallProgressPercentage,
  confidenceScore
}) => {
  return (
    <div className="mb-4">
      <div className="text-3xl font-bold">
        {Math.round(overallProgressPercentage)}%
        <span className="text-sm ml-2 font-normal text-gray-500">implemented</span>
        {confidenceScore !== undefined && (
          <Badge 
            variant={confidenceScore >= 90 ? "outline" : confidenceScore >= 70 ? "secondary" : "destructive"}
            className="ml-2 flex items-center gap-1"
          >
            <Shield className="h-3 w-3" />
            {confidenceScore}% confidence
          </Badge>
        )}
      </div>
    </div>
  );
};
