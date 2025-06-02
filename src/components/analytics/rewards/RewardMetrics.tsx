
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RewardMetrics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Reward metrics will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
};

export default RewardMetrics;
