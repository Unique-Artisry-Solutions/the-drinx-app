
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Award, DollarSign, Activity, Settings } from "lucide-react";

// Simple metric card component
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  change?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, iconColor, change }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <p className="text-xs text-muted-foreground">
          {change > 0 ? '+' : ''}{change}% from last month
        </p>
      )}
    </CardContent>
  </Card>
);

const CleanRewardsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Rewards Program Administration</h1>
        <p className="text-muted-foreground">
          Manage your rewards program with a clean, simplified interface.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Users"
              value="2,547"
              icon={Users}
              iconColor="text-blue-500"
              change={12.5}
            />
            <MetricCard
              title="Active Rewards"
              value="34"
              icon={Award}
              iconColor="text-green-500"
              change={8.3}
            />
            <MetricCard
              title="Points Distributed"
              value="45,678"
              icon={TrendingUp}
              iconColor="text-purple-500"
              change={15.2}
            />
            <MetricCard
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
                <CardDescription>Current system health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      Operational
                    </Badge>
                    <span className="text-sm text-muted-foreground">All systems running</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Uptime: 99.9%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest program activity</CardDescription>
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

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage reward program participants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Active Users</span>
                  <Badge variant="secondary">2,547</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Premium Members</span>
                  <Badge variant="secondary">847</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">New This Month</span>
                  <Badge variant="secondary">156</Badge>
                </div>
                <Button className="w-full mt-4">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Settings</CardTitle>
              <CardDescription>Configure your rewards program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Point Expiration</span>
                  <Badge variant="outline">12 months</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Minimum Redemption</span>
                  <Badge variant="outline">100 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Welcome Bonus</span>
                  <Badge variant="outline">50 points</Badge>
                </div>
                <Button className="w-full mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CleanRewardsDashboard;
