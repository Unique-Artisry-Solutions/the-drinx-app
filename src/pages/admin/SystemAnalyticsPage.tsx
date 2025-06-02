
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SystemAnalyticsPage: React.FC = () => {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>System Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            System analytics features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default SystemAnalyticsPage;
