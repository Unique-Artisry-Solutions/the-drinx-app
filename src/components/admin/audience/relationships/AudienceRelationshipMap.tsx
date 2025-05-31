import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RefreshCw, Filter, Users } from 'lucide-react';

interface AudienceRelationshipMapProps {
  segments: Array<{
    id: string;
    name: string;
    memberCount: number;
    relationships: Array<{
      targetId: string;
      strength: number;
      type: string;
    }>;
  }>;
  _onSelectSegment?: (segmentId: string) => void;
  onRefresh?: () => void;
}

export function AudienceRelationshipMap({ 
  segments, 
  onRefresh 
}: AudienceRelationshipMapProps) {
  const [filterStrength, setFilterStrength] = useState([0]);
  const [relationshipType, setRelationshipType] = useState('all');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  // Mock relationship data - preserved as placeholder
  const mockConnections = [
    { source: 'segment-1', target: 'segment-2', strength: 0.8, type: 'overlap' },
    { source: 'segment-2', target: 'segment-3', strength: 0.6, type: 'behavioral' },
    { source: 'segment-1', target: 'segment-3', strength: 0.4, type: 'demographic' }
  ];

  const getSegmentName = (_segmentId: string) => {
    return 'Segment Name'; // Placeholder
  };

  const toggleSegmentSelection = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Audience Relationship Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Controls Panel */}
            <div className="lg:w-1/3 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Relationship Type</label>
                <Select value={relationshipType} onValueChange={setRelationshipType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="overlap">Overlap</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="demographic">Demographic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Minimum Strength: {filterStrength[0]}%
                </label>
                <Slider
                  value={filterStrength}
                  onValueChange={setFilterStrength}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Segments ({selectedSegments.length} selected)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {segments.map((segment) => (
                    <div
                      key={segment.id}
                      className={`p-2 border rounded cursor-pointer transition-colors ${
                        selectedSegments.includes(segment.id)
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleSegmentSelection(segment.id)}
                    >
                      <div className="font-medium text-sm">{segment.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {segment.memberCount.toLocaleString()} members
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="lg:w-2/3">
              <div className="border rounded-lg p-6 h-96 bg-gray-50 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Relationship visualization will appear here</p>
                  <p className="text-sm mt-1">
                    {mockConnections.length} relationships detected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Relationship Summary */}
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Key Relationships</h3>
            <div className="grid gap-3">
              {mockConnections.map((connection, _i) => (
                <div key={`${connection.source}-${connection.target}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {getSegmentName(connection.source)}
                    </span>
                    <span className="text-muted-foreground">↔</span>
                    <span className="text-sm font-medium">
                      {getSegmentName(connection.target)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{connection.type}</Badge>
                    <Badge variant={connection.strength > 0.7 ? 'default' : 'secondary'}>
                      {Math.round(connection.strength * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
