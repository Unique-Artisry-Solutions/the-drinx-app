
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FollowerNotificationCenterProps {
  promoterId: string;
}

const FollowerNotificationCenter: React.FC<FollowerNotificationCenterProps> = ({ promoterId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Center</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Follower notification center coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationCenter;
