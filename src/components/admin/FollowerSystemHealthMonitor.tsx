import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SystemHealthMetrics {
  followerCount: number;
  notificationDeliveryRate: number;
  systemUptime: number;
  lastSyncTime: string;
  activeConnections: number;
}

const FollowerSystemHealthMonitor: React.FC = () => {
  const metrics: SystemHealthMetrics = {
    followerCount: 1548,
    notificationDeliveryRate: 0.98,
    systemUptime: 99.99,
    lastSyncTime: '2024-03-15 14:30:00 UTC',
    activeConnections: 235
  };

  const isHealthy = metrics.systemUptime > 99 && metrics.notificationDeliveryRate > 0.95;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follower System Health</CardTitle>
        <CardDescription>Real-time metrics for the follower notification system</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-3">
          {isHealthy ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">System Status</p>
            <p className="text-sm text-muted-foreground">
              {isHealthy ? 'Healthy' : 'Needs Attention'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium leading-none">Follower Count</p>
            <p className="text-lg font-bold">{metrics.followerCount}</p>
            <p className="text-sm text-muted-foreground">Total number of followers</p>
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Notification Delivery Rate</p>
            <p className="text-lg font-bold">{(metrics.notificationDeliveryRate * 100).toFixed(2)}%</p>
            <p className="text-sm text-muted-foreground">Percentage of notifications successfully delivered</p>
          </div>
          <div>
            <p className="text-sm font-medium leading-none">System Uptime</p>
            <p className="text-lg font-bold">{metrics.systemUptime}%</p>
            <p className="text-sm text-muted-foreground">System availability over the last month</p>
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Active Connections</p>
            <p className="text-lg font-bold">{metrics.activeConnections}</p>
            <p className="text-sm text-muted-foreground">Current number of active connections</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Last Sync</Badge>
          <span className="text-sm text-muted-foreground">{metrics.lastSyncTime}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerSystemHealthMonitor;
