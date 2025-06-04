
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AudienceSegment } from '@/types/AudienceTypes';

export interface SegmentTrendsChartProps {
  segments: AudienceSegment[];
  isLoading: boolean;
}

export const SegmentTrendsChart: React.FC<SegmentTrendsChartProps> = ({ segments, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segment Trends</CardTitle>
        <CardDescription>
          Growth and engagement trends for your segments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading trends...</p>
          ) : (
            <p className="text-muted-foreground">
              Segment trends chart placeholder. This component will display
              trends for the selected segments.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentTrendsChart;
