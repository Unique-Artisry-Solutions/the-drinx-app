
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AudienceRelationshipMapProps {
  segments: any[];
  onFilterChange?: (filter: string) => void;
}

export function AudienceRelationshipMap({ segments }: AudienceRelationshipMapProps) {
  const mockSegments = [
    { id: '1', name: 'High Spenders', size: 250, connections: 3 },
    { id: '2', name: 'Frequent Visitors', size: 180, connections: 2 },
    { id: '3', name: 'New Users', size: 320, connections: 1 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Relationship Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input placeholder="Filter segments..." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSegments.map((segment) => (
              <div key={segment.id} className="p-4 border rounded-lg">
                <h4 className="font-medium">{segment.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline">{segment.size} users</Badge>
                  <span className="text-sm text-muted-foreground">
                    {segment.connections} connections
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <Button>Analyze Relationships</Button>
        </div>
      </CardContent>
    </Card>
  );
}
