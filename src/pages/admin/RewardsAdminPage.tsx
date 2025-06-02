
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RewardsAdminPage: React.FC = () => {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Rewards Administration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Rewards administration features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default RewardsAdminPage;
