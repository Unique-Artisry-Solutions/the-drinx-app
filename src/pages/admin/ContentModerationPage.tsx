
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContentModerationPage: React.FC = () => {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content moderation features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ContentModerationPage;
