
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, Settings, Megaphone, Calendar, Heart } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'event',
      title: 'New Event Invite',
      message: 'You\'ve been invited to Summer Swig Circuit',
      time: '2 hours ago',
      read: false,
      icon: Calendar
    },
    {
      id: 2,
      type: 'like',
      title: 'Recipe Liked',
      message: 'Someone liked your Virgin Mojito recipe',
      time: '4 hours ago',
      read: false,
      icon: Heart
    },
    {
      id: 3,
      type: 'promotion',
      title: 'Special Offer',
      message: 'Happy Hour at The Spiritless Lounge - 20% off',
      time: '1 day ago',
      read: true,
      icon: Megaphone
    },
    {
      id: 4,
      type: 'system',
      title: 'Account Update',
      message: 'Your profile has been successfully updated',
      time: '2 days ago',
      read: true,
      icon: Bell
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'like': return 'bg-pink-100 text-pink-800';
      case 'promotion': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Stay updated with your latest activities</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Notifications
                </span>
                <Button variant="ghost" size="sm">
                  Mark All Read
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                      notification.read ? 'bg-gray-50' : 'bg-white border-spiritless-pink/20'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      {React.createElement(notification.icon, { className: "h-4 w-4" })}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-spiritless-pink rounded-full"></div>
                          )}
                          <Button variant="ghost" size="sm">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">We'll notify you when something happens</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Event Invites</span>
                <Badge variant="secondary">On</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Recipe Likes</span>
                <Badge variant="secondary">On</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Promotions</span>
                <Badge variant="secondary">On</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">System Updates</span>
                <Badge variant="secondary">On</Badge>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                Customize Settings
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Unread</span>
                <span className="font-medium text-spiritless-pink">2</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Today</span>
                <span className="font-medium">3</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">This Week</span>
                <span className="font-medium">12</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
