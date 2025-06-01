
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Users, Network, Filter } from 'lucide-react';

interface ConnectionData {
  source: string;
  target: string;
  strength: number;
  type: 'strong' | 'moderate' | 'weak';
}

const AudienceRelationshipMap = () => {
  const [selectedView, setSelectedView] = useState('network');
  const [_selectedSegment, setSelectedSegment] = useState('all');
  const [_onSelectSegment] = useState(() => (segmentId: string) => {
    setSelectedSegment(segmentId);
  });
  
  const [filterThreshold, _setFilterThreshold] = useState([50]);

  // Mock data for demonstration
  const connections: ConnectionData[] = [
    { source: 'High Spenders', target: 'Frequent Visitors', strength: 85, type: 'strong' },
    { source: 'New Users', target: 'Mobile Users', strength: 72, type: 'strong' },
    { source: 'Loyal Customers', target: 'High Spenders', strength: 68, type: 'moderate' },
    { source: 'Weekend Visitors', target: 'Social Media Users', strength: 45, type: 'moderate' },
  ];

  const segments = [
    { id: 'high-spenders', name: 'High Spenders', size: 1250, connections: 8 },
    { id: 'frequent-visitors', name: 'Frequent Visitors', size: 890, connections: 6 },
    { id: 'new-users', name: 'New Users', size: 2100, connections: 4 },
    { id: 'mobile-users', name: 'Mobile Users', size: 3200, connections: 7 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Audience Relationship Map</h2>
          <p className="text-muted-foreground">
            Visualize connections and overlaps between audience segments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="network">Network View</SelectItem>
              <SelectItem value="matrix">Matrix View</SelectItem>
              <SelectItem value="hierarchy">Hierarchy View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="h-5 w-5 mr-2" />
                Relationship Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Interactive network visualization will be displayed here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing {connections.length} connections between segments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Strength Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Minimum Strength: {filterThreshold[0]}%</label>
                <Slider
                  value={filterThreshold}
                  onValueChange={_setFilterThreshold}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {segments.map((segment) => (
                  <div key={segment.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm">{segment.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {segment.size.toLocaleString()} members
                      </div>
                    </div>
                    <Badge variant="outline">
                      {segment.connections} connections
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strong Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {connections
                  .filter(conn => conn.type === 'strong')
                  .map((connection, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">
                        {connection.source} ↔ {connection.target}
                      </div>
                      <div className="text-muted-foreground">
                        {connection.strength}% strength
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AudienceRelationshipMap;
