import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Layout } from '@/components/Layout';

const SystemConfigurationPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">System Configuration</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Enable Dark Mode</span>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <span>Enable Advanced Analytics</span>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <span>Enable Real-time Updates</span>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SystemConfigurationPage;
