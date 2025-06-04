
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Edit, Trash2, Users } from 'lucide-react';

export interface AudienceSegmentListProps {
  segments: AudienceSegment[];
  isLoading: boolean;
  onEdit: (segment: AudienceSegment) => void;
  onDelete: (segmentId: string) => void;
}

export const AudienceSegmentList: React.FC<AudienceSegmentListProps> = ({
  segments,
  isLoading,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return <div>Loading segments...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Segments</CardTitle>
        <CardDescription>
          Manage your audience segments and their criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {segments.length === 0 ? (
            <p className="text-muted-foreground">No segments created yet.</p>
          ) : (
            segments.map((segment) => (
              <div key={segment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{segment.name}</h3>
                    <p className="text-sm text-muted-foreground">{segment.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={segment.is_active ? "default" : "secondary"}>
                        {segment.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {segment.memberCount || 0} members
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(segment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDelete(segment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default AudienceSegmentList;
