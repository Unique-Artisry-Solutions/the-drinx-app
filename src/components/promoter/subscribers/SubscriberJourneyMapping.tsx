
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SubscriberJourneyMappingProps {
  promoterId: string;
}

const SubscriberJourneyMapping: React.FC<SubscriberJourneyMappingProps> = ({ promoterId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriber Journey Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Subscriber journey mapping and optimization coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default SubscriberJourneyMapping;
