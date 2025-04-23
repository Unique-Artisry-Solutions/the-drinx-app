
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NotificationsLayoutProps {
  title: string;
  children: React.ReactNode;
}

const NotificationsLayout = ({ title, children }: NotificationsLayoutProps) => {
  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
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
