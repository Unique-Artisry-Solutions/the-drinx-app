
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const FollowerSystemHealthMonitor = () => {
  // Mock health metrics
  const healthMetrics = [
    {
      name: 'Active Followers',
      value: 1247,
      change: '+12%',
      status: 'healthy',
      icon: Users
    },
    {
      name: 'Engagement Rate',
      value: 87,
      change: '+5%',
      status: 'healthy',
      icon: Activity
    },
    {
      name: 'Growth Rate',
      value: 23,
      change: '-2%',
      status: 'warning',
      icon: TrendingUp
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {healthMetrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.name}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}{metric.name === 'Engagement Rate' ? '%' : ''}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{metric.change} from last month</span>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
          <CardDescription>
            Monitor the overall health of the follower system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Performance</span>
              <span className="text-sm text-muted-foreground">95%</span>
            </div>
            <Progress value={95} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Response Time</span>
              <span className="text-sm text-muted-foreground">120ms</span>
            </div>
            <Progress value={88} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cache Hit Rate</span>
              <span className="text-sm text-muted-foreground">78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Minor performance degradation detected in follower sync</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowerSystemHealthMonitor;
