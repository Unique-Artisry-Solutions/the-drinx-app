
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RelationshipMatrix: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relationship Matrix</CardTitle>
        <CardDescription>
          Matrix view of audience member relationships and connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Relationship matrix placeholder. This component will display
            a matrix showing connections between audience members.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipMatrix;
