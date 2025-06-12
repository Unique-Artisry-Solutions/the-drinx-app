
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BulkMessagingHubProps {
  promoterId: string;
}

const BulkMessagingHub: React.FC<BulkMessagingHubProps> = ({ promoterId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Messaging</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Bulk messaging functionality coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default BulkMessagingHub;
