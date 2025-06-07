
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TierProgressionTrackingProps {
  promoterId: string;
}

const TierProgressionTracking: React.FC<TierProgressionTrackingProps> = ({ promoterId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tier Progression Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Subscriber tier progression and rewards tracking coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default TierProgressionTracking;
