
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BarChart3, Settings, TrendingUp, DollarSign } from 'lucide-react';
import Layout from '@/components/Layout';
import { useEstablishmentProfile } from '@/hooks/useEstablishmentProfile';
import { useUserEstablishment } from '@/hooks/establishment/useUserEstablishment';
import { useAuth } from '@/contexts/auth/AuthProvider';

const EstablishmentDashboard: React.FC = () => {
  const { establishmentId } = useParams<{ establishmentId: string }>();
  const { user } = useAuth();
  const establishmentProfileData = useEstablishmentProfile(establishmentId);
  const userEstablishmentData = useUserEstablishment(user?.id);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange] = useState({ from: new Date(), to: new Date() });

  const mockStats = {
    totalVisitors: 1234,
    weeklyGrowth: 12.5,
    totalRevenue: 15678,
    averageRating: 4.7
  };

  if (establishmentProfileData.isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">Loading establishment data...</div>
        </div>
      </Layout>
    );
  }

  const displayEstablishment = establishmentProfileData.establishment || userEstablishmentData.userEstablishment;

  if (!displayEstablishment) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Establishment not found</h2>
            <p>The establishment you're looking for doesn't exist or you don't have access to it.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{displayEstablishment.name}</h1>
          <p className="text-gray-600">Dashboard Overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{mockStats.weeklyGrowth}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockStats.totalRevenue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.averageRating}/5</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">No recent activity to show.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics data for the selected date range: {dateRange.from.toDateString()} to {dateRange.to.toDateString()}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage your establishment's events and activities.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Establishment Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configure your establishment settings and preferences.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EstablishmentDashboard;
