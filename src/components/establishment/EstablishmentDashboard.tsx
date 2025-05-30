
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Star, TrendingUp, Calendar } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import QuickNavigation from './QuickNavigation';
import RecentActivityCard from './RecentActivityCard';
import PendingActionsCard from './PendingActionsCard';
import MocktailSuggestionsCard from './MocktailSuggestionsCard';
import SectionContent from './SectionContent';
import { useVisitorStats } from '@/hooks/establishment/useVisitorStats';
import { useAuth } from '@/contexts/auth';

const EstablishmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const establishmentId = user?.id;
  
  // Fix: Correctly use the hook without destructuring
  const visitorStats = useVisitorStats(establishmentId || '');

  const mockActivities = [
    {
      id: 1,
      type: 'review' as const,
      user: 'Sarah M.',
      description: 'Left a 5-star review for "Sunset Spritz"',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'order' as const,
      user: 'Mike R.',
      description: 'Ordered 3 "Berry Bliss" mocktails',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      type: 'checkin' as const,
      user: 'Emma L.',
      description: 'Checked in via QR code',
      timestamp: '6 hours ago'
    }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <DashboardHeader />
        
        <QuickNavigation />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="reviews" className="hidden lg:block">Reviews</TabsTrigger>
                <TabsTrigger value="settings" className="hidden lg:block">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{visitorStats?.totalVisitors || '1,234'}</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{visitorStats?.todayCheckins || '23'}</div>
                      <p className="text-xs text-muted-foreground">+5 from yesterday</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{visitorStats?.averageRating || '4.8'}</div>
                      <p className="text-xs text-muted-foreground">Based on 127 reviews</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{visitorStats?.peakHours || '7-9 PM'}</div>
                      <p className="text-xs text-muted-foreground">Most active period</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentActivityCard activities={mockActivities} />
                  <div className="space-y-4">
                    <PendingActionsCard />
                    <MocktailSuggestionsCard />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <SectionContent 
                  title="Analytics Dashboard"
                  description="Detailed insights about your establishment's performance"
                  visitorStats={visitorStats}
                />
              </TabsContent>

              <TabsContent value="menu">
                <SectionContent 
                  title="Menu Management"
                  description="Manage your mocktail menu and offerings"
                  visitorStats={visitorStats}
                />
              </TabsContent>

              <TabsContent value="events">
                <SectionContent 
                  title="Events Management"
                  description="Organize and track your establishment events"
                  visitorStats={visitorStats}
                />
              </TabsContent>

              <TabsContent value="reviews">
                <SectionContent 
                  title="Customer Reviews"
                  description="Monitor and respond to customer feedback"
                  visitorStats={visitorStats}
                />
              </TabsContent>

              <TabsContent value="settings">
                <SectionContent 
                  title="Establishment Settings"
                  description="Configure your establishment preferences"
                  visitorStats={visitorStats}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <Badge variant="secondary">+15%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Popular Drink</span>
                  <span className="text-sm font-medium">Sunset Spritz</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Busy Day</span>
                  <span className="text-sm font-medium">Friday</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  No upcoming events scheduled
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDashboard;
