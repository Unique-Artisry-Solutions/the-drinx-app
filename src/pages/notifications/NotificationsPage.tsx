
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const mockNotifications = [
    {
      id: '1',
      type: 'info',
      title: 'Welcome to Spiritless!',
      message: 'Start exploring amazing non-alcoholic cocktails near you.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Points Earned',
      message: 'You earned 50 points for checking in at The Tipsy Tavern!',
      timestamp: '1 day ago',
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground">Stay updated with your latest activity and rewards</p>
        </div>
        
        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {getIcon(notification.type)}
                  {notification.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.timestamp}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
