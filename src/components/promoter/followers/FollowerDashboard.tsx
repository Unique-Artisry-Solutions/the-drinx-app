
import React from 'react';
import { FollowerList } from './FollowerList';
import { FollowerNotificationCenter } from './FollowerNotificationCenter';
import { FollowerAnalyticsWidgets } from './FollowerAnalyticsWidgets';
import { FollowerSystemHealthMonitor } from './FollowerSystemHealthMonitor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FollowerDashboardProps {
  promoterId: string;
}

export const FollowerDashboard: React.FC<FollowerDashboardProps> = ({ promoterId }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Follower Management</h1>
        <FollowerSystemHealthMonitor promoterId={promoterId} />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FollowerAnalyticsWidgets promoterId={promoterId} />
          </div>
        </TabsContent>

        <TabsContent value="followers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Follower List</CardTitle>
            </CardHeader>
            <CardContent>
              <FollowerList promoterId={promoterId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Center</CardTitle>
            </CardHeader>
            <CardContent>
              <FollowerNotificationCenter promoterId={promoterId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <FollowerAnalyticsWidgets promoterId={promoterId} detailed />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowerDashboard;
