
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Settings,
  Timer,
  Zap,
  Target
} from 'lucide-react';
import { DynamicPricingDashboard } from '@/components/pricing/DynamicPricingDashboard';
import { PricingRulesManager } from '@/components/pricing/PricingRulesManager';
import { UrgencyDashboard } from '@/components/promoter/urgency/UrgencyDashboard';
import RealTimeDashboard from '@/components/promoter/RealTimeDashboard';

const PromoterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for dashboard metrics
  const dashboardMetrics = {
    totalEvents: 12,
    totalAttendees: 1248,
    totalRevenue: 24580,
    conversionRate: 12.5,
    avgTicketPrice: 45.00,
    upcomingEvents: 3
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Promoter Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your events and performance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Dynamic Pricing
          </TabsTrigger>
          <TabsTrigger value="urgency" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Urgency Features
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Real-Time Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div className="text-sm font-medium">Total Events</div>
                </div>
                <div className="text-2xl font-bold mt-1">{dashboardMetrics.totalEvents}</div>
                <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <div className="text-sm font-medium">Total Attendees</div>
                </div>
                <div className="text-2xl font-bold mt-1">{dashboardMetrics.totalAttendees.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                  <div className="text-sm font-medium">Total Revenue</div>
                </div>
                <div className="text-2xl font-bold mt-1">${dashboardMetrics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8% vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <div className="text-sm font-medium">Conversion Rate</div>
                </div>
                <div className="text-2xl font-bold mt-1">{dashboardMetrics.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">+2.1% vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                  <div className="text-sm font-medium">Avg Ticket Price</div>
                </div>
                <div className="text-2xl font-bold mt-1">${dashboardMetrics.avgTicketPrice}</div>
                <p className="text-xs text-muted-foreground">+$3.20 vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <div className="text-sm font-medium">Upcoming Events</div>
                </div>
                <div className="text-2xl font-bold mt-1">{dashboardMetrics.upcomingEvents}</div>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to help you manage your events and campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  Create Event
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Timer className="h-6 w-6" />
                  Add Countdown Timer
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Zap className="h-6 w-6" />
                  Create Urgency Campaign
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <DollarSign className="h-6 w-6" />
                  Setup Pricing Rules
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">New ticket sale for "Summer Music Festival"</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                  <Badge variant="outline">+$45</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Urgency campaign "Last Chance" triggered</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                  <Badge variant="outline">Campaign</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Dynamic pricing adjusted for high demand</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                  <Badge variant="outline">Pricing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <DynamicPricingDashboard promoterId={user?.id || ''} />
          <PricingRulesManager 
            promoterId={user?.id || ''} 
            onCreateRule={() => console.log('Create pricing rule')}
            onEditRule={(rule) => console.log('Edit pricing rule:', rule)}
          />
        </TabsContent>

        <TabsContent value="urgency" className="space-y-6">
          <UrgencyDashboard 
            promoterId={user?.id || ''}
            eventId={undefined}
            swigCircuitId={undefined}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <RealTimeDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>
                Configure your dashboard preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromoterDashboard;
