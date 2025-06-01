import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AudienceRelationshipMapProps {
  onRelationshipSelect?: (relationship: any) => void;
}

export function AudienceRelationshipMap({ onRelationshipSelect }: AudienceRelationshipMapProps) {
  const [viewMode, setViewMode] = useState('network');
  
  // Mock relationship data - preserved as placeholder
  const relationships = [
    { id: '1', source: 'User A', target: 'User B', strength: 0.8 },
    { id: '2', source: 'User B', target: 'User C', strength: 0.6 }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Audience Relationship Map</CardTitle>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="network">Network View</SelectItem>
              <SelectItem value="matrix">Matrix View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Export Map
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Relationship visualization would appear here</p>
            <p className="text-sm text-muted-foreground mt-2">
              {relationships.length} relationships found
            </p>
            {onRelationshipSelect && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => onRelationshipSelect(relationships[0])}
              >
                Select First Relationship
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
