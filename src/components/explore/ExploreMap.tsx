
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Establishment } from '@/types/ProfileTypes';

interface ExploreMapProps {
  establishments: Establishment[];
}

export const ExploreMap: React.FC<ExploreMapProps> = ({ establishments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map View</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Found {establishments.length} establishments</p>
        <p>This is a placeholder for the explore map component.</p>
      </CardContent>
    </Card>
  );
};
