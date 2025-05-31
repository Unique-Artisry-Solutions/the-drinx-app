import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MoreHorizontal } from 'lucide-react';

interface AudienceSegmentListProps {
  searchTerm: string;
  selectedSegments: string[];
  onSegmentSelect: (segmentId: string) => void;
}

export const AudienceSegmentList = ({ searchTerm, selectedSegments, onSegmentSelect }: AudienceSegmentListProps) => {
  // Mock segments data - preserved as placeholder
  const segments = [
    { id: '1', name: 'High Engagement Users', count: 1245, status: 'active' },
    { id: '2', name: 'New Subscribers', count: 456, status: 'active' },
    { id: '3', name: 'VIP Members', count: 89, status: 'active' }
  ];

  const filteredSegments = segments.filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredSegments.map((segment) => (
        <Card 
          key={segment.id} 
          className={`cursor-pointer transition-colors ${
            selectedSegments.includes(segment.id) ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onSegmentSelect(segment.id)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{segment.name}</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{segment.count.toLocaleString()}</span>
            </div>
            <Badge variant="secondary" className="mt-2">
              {segment.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
