
import React from 'react';
import { TrendingUp, CircleCheck, Users, Award, DollarSign } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const SystemOverviewTab = () => {
  const handleExportMetrics = () => {
    toast.info("Export functionality coming soon");
  };

  const handleRefreshTests = () => {
    toast.info("Refreshing system tests...");
  };

  // Mock system health data for now
  const systemHealth = {
    status: 'operational',
    uptime: '99.9%',
    lastCheck: new Date().toISOString()
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
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
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  {systemHealth.status}
                </Badge>
                <span className="text-sm text-muted-foreground">All systems running normally</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Uptime: {systemHealth.uptime}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Tests</CardTitle>
            <CardDescription>System performance monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Response</span>
                <span className="font-medium text-green-600">Fast</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API Performance</span>
                <span className="font-medium text-green-600">Optimal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cache Hit Rate</span>
                <span className="font-medium text-green-600">98.2%</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={handleRefreshTests}>
                  Refresh Tests
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportMetrics}>
                  Export Metrics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemOverviewTab;
