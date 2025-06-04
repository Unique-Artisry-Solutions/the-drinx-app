import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

const MocktailSuggestionsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Mocktail Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page will provide mocktail suggestions for your establishment.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MocktailSuggestionsPage;
