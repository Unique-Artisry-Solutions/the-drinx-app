
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AudienceSegment } from '@/types/AudienceTypes';

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
  const [_analysisType, setAnalysisType] = useState('overlap');

  if (isLoading) {
    return <div>Loading segment overlap analysis...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center space-x-2">
            <Checkbox
              id={segment.id}
              checked={selectedSegments.includes(segment.id)}
              onCheckedChange={() => onSegmentToggle(segment.id)}
            />
            <label htmlFor={segment.id} className="text-sm font-medium">
              {segment.name}
            </label>
          </div>
        ))}
      </div>

      {selectedSegments.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Overlap analysis for {selectedSegments.length} selected segments will be displayed here.
              </p>
              <Button 
                onClick={() => setAnalysisType('overlap')} 
                className="mt-4"
              >
                Generate Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SegmentOverlapAnalysis;
