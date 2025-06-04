
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationTestingPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Notification Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a placeholder for the notification testing page.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationTestingPage;
