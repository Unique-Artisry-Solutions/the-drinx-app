
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PhotoModerationPage: React.FC = () => {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Photo Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Photo moderation features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default PhotoModerationPage;
