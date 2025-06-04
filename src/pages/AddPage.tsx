import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

const AddPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a placeholder for the add new content page.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddPage;
