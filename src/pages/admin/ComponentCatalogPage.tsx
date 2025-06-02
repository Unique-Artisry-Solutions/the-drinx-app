
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ComponentCatalogPage: React.FC = () => {
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Component Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Component catalog features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ComponentCatalogPage;
