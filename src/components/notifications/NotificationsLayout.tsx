
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationsLayoutProps {
  title: string;
  children: React.ReactNode;
  showTestPanel?: boolean;
}

const NotificationsLayout: React.FC<NotificationsLayoutProps> = ({
  title,
  children,
  showTestPanel = false
}) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-700">{title}</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your latest notifications
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
        
        {showTestPanel && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-700">Test Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notification testing panel available for development
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsLayout;
