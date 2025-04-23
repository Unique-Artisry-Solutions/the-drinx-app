
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import NotificationTestPanel from './NotificationTestPanel';

interface NotificationsLayoutProps {
  title: string;
  children: React.ReactNode;
  showTestPanel?: boolean;
}

const NotificationsLayout = ({ 
  title, 
  children, 
  showTestPanel = false 
}: NotificationsLayoutProps) => {
  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      {showTestPanel && (
        <NotificationTestPanel />
      )}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsLayout;
