
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Award, DollarSign } from "lucide-react";
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';

export default function SimpleRewardsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Rewards Program Administration</h1>
        <p className="text-muted-foreground">
          Manage your rewards program configuration, rules, statistics, and reports.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnalyticsMetricCard
              title="Total Users"
              value="2,547"
              icon={Users}
              iconColor="text-blue-500"
              change={12.5}
            />
            <AnalyticsMetricCard
              title="Active Rewards"
              value="34"
              icon={Award}
              iconColor="text-green-500"
              change={8.3}
            />
            <AnalyticsMetricCard
              title="Points Distributed"
              value="45,678"
              icon={TrendingUp}
              iconColor="text-purple-500"
              change={15.2}
            />
            <AnalyticsMetricCard
              title="Revenue Impact"
              value="$12,450"
              icon={DollarSign}
              iconColor="text-orange-500"
              change={22.1}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    Operational
                  </Badge>
                  <span className="text-sm text-muted-foreground">All systems running normally</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest rewards program activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Points awarded today</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rewards redeemed</span>
                    <span className="font-medium">67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New users enrolled</span>
                    <span className="font-medium">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage reward program users and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management features will be added in the next iteration.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Detailed analytics and reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics features will be added in the next iteration.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Settings</CardTitle>
              <CardDescription>Configure rewards program settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings management will be added in the next iteration.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
