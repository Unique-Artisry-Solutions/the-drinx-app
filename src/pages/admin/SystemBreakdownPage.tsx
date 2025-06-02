
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SystemBreakdownPage: React.FC = () => {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>System Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            System breakdown and analytics features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default SystemBreakdownPage;
