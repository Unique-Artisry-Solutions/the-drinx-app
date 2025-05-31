import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Overlap, Users } from 'lucide-react';

interface SegmentOverlapAnalysisProps {
  segments: AudienceSegment[];
  selectedSegments: string[];
  onSegmentToggle: (segmentId: string) => void;
  isLoading: boolean;
}

export function SegmentOverlapAnalysis({
  segments,
  selectedSegments,
  onSegmentToggle,
  isLoading
}: SegmentOverlapAnalysisProps) {
  // Mock overlap data - preserved as placeholder
  const overlapData = [
    { segment1: 'High Engagement Users', segment2: 'VIP Members', overlap: 85, size: 120 },
    { segment1: 'New Subscribers', segment2: 'High Engagement Users', overlap: 25, size: 45 },
    { segment1: 'VIP Members', segment2: 'New Subscribers', overlap: 12, size: 18 }
  ];

  const getOverlapPercentage = (overlap: number, total: number) => {
    return ((overlap / total) * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {segments.map((segment) => (
          <Button
            key={segment.id}
            variant={selectedSegments.includes(segment.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onSegmentToggle(segment.id)}
          >
            {segment.name}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {overlapData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Overlap className="h-5 w-5" />
                {item.segment1} × {item.segment2}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Overlap Size</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-2xl font-bold">{item.size}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Overlap Rate</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{getOverlapPercentage(item.overlap, 1000)}%</span>
                    <Badge variant={parseFloat(getOverlapPercentage(item.overlap, 1000)) > 10 ? "default" : "secondary"}>
                      {parseFloat(getOverlapPercentage(item.overlap, 1000)) > 10 ? "High" : "Low"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Similarity Score</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{(Math.random() * 0.8 + 0.2).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
