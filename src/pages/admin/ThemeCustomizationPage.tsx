import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

const ThemeCustomizationPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Theme Customization</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Customize App Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is the theme customization page. Functionality will be implemented in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ThemeCustomizationPage;
