
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AudienceSegment } from '@/types/AudienceTypes';

export interface SegmentPerformanceProps {
  segments: AudienceSegment[];
}

export const SegmentPerformance: React.FC<SegmentPerformanceProps> = ({ segments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segment Performance</CardTitle>
        <CardDescription>
          Performance metrics for your audience segments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {segments.length === 0 ? (
            <p className="text-muted-foreground">No performance data available.</p>
          ) : (
            segments.map((segment) => (
              <div key={segment.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{segment.name}</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Members</p>
                    <p className="text-lg font-semibold">{segment.memberCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    <p className="text-lg font-semibold">75%</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentPerformance;
