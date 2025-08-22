import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import IndividualNotificationView from '@/components/individual/communication/IndividualNotificationView';
import { useIsMobile } from '@/hooks/use-mobile';

const IndividualAllActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleBackToDashboard = () => {
    navigate('/explore');
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Actions</h1>
            <p className="text-muted-foreground mt-2">
              Manage your notifications and activity
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToDashboard}>
            Back to Explore
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Notifications</span>
                </div>
                <Badge variant="secondary">0 unread</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                System and activity notifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Events</span>
                </div>
                <Badge variant="secondary">0 upcoming</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your event bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Favorites</span>
                </div>
                <Badge variant="secondary">0 saved</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Saved venues and events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Check-ins</span>
                </div>
                <Badge variant="secondary">0 recent</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Recent venue visits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Section - Full Width */}
        <div className="space-y-4">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Activity Center
              </CardTitle>
              <CardDescription>
                View your notifications, bookings, and account activity
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-80px)]">
              <IndividualNotificationView />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default IndividualAllActionsPage;