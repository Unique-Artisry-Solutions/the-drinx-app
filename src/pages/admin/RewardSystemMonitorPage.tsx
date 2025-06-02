
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RewardSystemMonitorPage: React.FC = () => {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Reward System Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Reward system monitoring will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default RewardSystemMonitorPage;
