import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Calendar, Heart, MapPin, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const IndividualNotificationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  // Mock data for demonstration
  const mockNotifications = [
    {
      id: '1',
      type: 'event',
      title: 'New Event Near You',
      message: 'Check out the Friday Night Jazz at The Blue Note',
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off your next visit at Sunset Lounge',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true
    }
  ];

  const mockEvents = [
    {
      id: '1',
      title: 'Jazz Night',
      venue: 'The Blue Note',
      date: new Date(Date.now() + 86400000).toISOString(),
      status: 'attending'
    }
  ];

  const NotificationsTab = () => (
    <div className="space-y-4 p-4">
      {mockNotifications.map((notification) => (
        <Card key={notification.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">{notification.title}</h4>
                  {!notification.isRead && (
                    <Badge variant="default" className="text-xs">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Mark Read
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EventsTab = () => (
    <div className="space-y-4 p-4">
      {mockEvents.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {event.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {event.venue}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const FavoritesTab = () => (
    <div className="p-4 text-center text-muted-foreground">
      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
      <p className="text-sm">Save venues and events to see them here</p>
    </div>
  );

  const CheckInsTab = () => (
    <div className="p-4 text-center text-muted-foreground">
      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No recent check-ins</h3>
      <p className="text-sm">Your venue check-ins will appear here</p>
    </div>
  );

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between p-4">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="notifications" className="text-xs">
                Notifications
                <Badge variant="default" className="ml-1 text-xs">2</Badge>
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs">Favorites</TabsTrigger>
              <TabsTrigger value="checkins" className="text-xs">Check-ins</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="notifications" className="m-0 h-full">
            <NotificationsTab />
          </TabsContent>
          <TabsContent value="events" className="m-0 h-full">
            <EventsTab />
          </TabsContent>
          <TabsContent value="favorites" className="m-0 h-full">
            <FavoritesTab />
          </TabsContent>
          <TabsContent value="checkins" className="m-0 h-full">
            <CheckInsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default IndividualNotificationView;