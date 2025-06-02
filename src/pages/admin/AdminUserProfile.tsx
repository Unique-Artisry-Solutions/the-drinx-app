
import React from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User ID: {id}</p>
          <p className="text-muted-foreground">
            User profile details will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminUserProfile;
