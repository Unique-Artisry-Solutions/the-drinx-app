
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AudienceRetentionData } from '@/services/promoterAnalyticsService';

interface AudienceRetentionChartProps {
  retentionData: AudienceRetentionData[];
  isLoading: boolean;
}

const AudienceRetentionChart: React.FC<AudienceRetentionChartProps> = ({
  retentionData,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-80 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const maxValue = 100; // Cohort retention charts always start at 100%

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Retention</CardTitle>
        <CardDescription>
          How well your audience sticks around after initial engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <div>Cohort</div>
            <div className="flex space-x-6 md:space-x-10">
              <div>Month 0</div>
              <div>Month 1</div>
              <div>Month 2</div>
              <div>Month 3</div>
            </div>
          </div>

          {retentionData.map((cohort, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-24 text-sm">{cohort.cohort}</div>
                <div className="flex flex-1 items-center space-x-2">
                  <RetentionCell value={cohort.month0} maxValue={maxValue} />
                  <RetentionCell value={cohort.month1} maxValue={maxValue} />
                  <RetentionCell value={cohort.month2} maxValue={maxValue} />
                  <RetentionCell value={cohort.month3} maxValue={maxValue} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-sm bg-blue-900" />
              <span className="text-sm text-muted-foreground">90-100%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-sm bg-blue-700" />
              <span className="text-sm text-muted-foreground">70-89%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-sm bg-blue-500" />
              <span className="text-sm text-muted-foreground">50-69%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-sm bg-blue-300" />
              <span className="text-sm text-muted-foreground">1-49%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-sm bg-gray-200" />
              <span className="text-sm text-muted-foreground">0%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RetentionCellProps {
  value: number;
  maxValue: number;
}

const RetentionCell: React.FC<RetentionCellProps> = ({ value, maxValue }) => {
  const getBackgroundColor = () => {
    if (value === 0) return 'bg-gray-200';
    if (value >= 90) return 'bg-blue-900';
    if (value >= 70) return 'bg-blue-700';
    if (value >= 50) return 'bg-blue-500';
    return 'bg-blue-300';
  };

  const width = `${(value / maxValue) * 100}%`;
  
  return (
    <div className="h-8 w-full overflow-hidden rounded-md bg-muted">
      <div
        className={`h-full ${getBackgroundColor()}`}
        style={{ width }}
      >
        <span className="flex h-full items-center justify-center text-xs font-medium text-white">
          {value > 0 ? `${value}%` : ''}
        </span>
      </div>
    </div>
  );
};

export default AudienceRetentionChart;
