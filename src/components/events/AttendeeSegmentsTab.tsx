
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { useState } from 'react'; // Commented out to preserve future functionality

interface AttendeeSegment {
  id: string;
  name: string;
  count: number;
  percentage: number;
  criteria: string;
}

interface AttendeeSegmentsTabProps {
  eventId: string;
  segments?: AttendeeSegment[];
}

const defaultSegments: AttendeeSegment[] = [
  { id: '1', name: 'Regular Attendees', count: 45, percentage: 60, criteria: 'Attended 3+ events' },
  { id: '2', name: 'New Visitors', count: 20, percentage: 27, criteria: 'First time attendee' },
  { id: '3', name: 'VIP Members', count: 10, percentage: 13, criteria: 'Premium subscription' }
];

const AttendeeSegmentsTab: React.FC<AttendeeSegmentsTabProps> = ({ 
  eventId, 
  segments = defaultSegments 
}) => {
  const handleCreateSegment = () => {
    console.log('Creating new segment for event:', eventId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Audience Segments</h3>
        <Button onClick={handleCreateSegment}>Create New Segment</Button>
      </div>

      <div className="grid gap-4">
        {segments.map((segment) => (
          <Card key={segment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{segment.name}</CardTitle>
                <Badge variant="secondary">{segment.percentage}%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{segment.criteria}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{segment.count}</span>
                  <span className="text-sm text-gray-500">attendees</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {segments.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No audience segments created yet. Create your first segment to start analyzing your attendees.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendeeSegmentsTab;
