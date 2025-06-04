import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

const MocktailDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Mocktail Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Mocktail ID: {id}</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MocktailDetailsPage;
