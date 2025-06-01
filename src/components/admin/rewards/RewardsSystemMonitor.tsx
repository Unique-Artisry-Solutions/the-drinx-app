
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const RewardsSystemMonitor = () => {
  const systemStatus = [
    {
      component: 'Reward Engine',
      status: 'healthy',
      uptime: 99.9,
      lastCheck: '2 minutes ago'
    },
    {
      component: 'Points Calculator',
      status: 'healthy',
      uptime: 99.7,
      lastCheck: '1 minute ago'
    },
    {
      component: 'Tier Manager',
      status: 'warning',
      uptime: 98.2,
      lastCheck: '5 minutes ago'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Monitor</CardTitle>
              <CardDescription>
                Real-time monitoring of rewards system components
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemStatus.map((item) => (
              <div key={item.component} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium">{item.component}</p>
                    <p className="text-sm text-muted-foreground">Last checked: {item.lastCheck}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.uptime}% uptime
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for the rewards system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transaction Processing</span>
              <span className="text-sm text-muted-foreground">95%</span>
            </div>
            <Progress value={95} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Response Time</span>
              <span className="text-sm text-muted-foreground">120ms avg</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error Rate</span>
              <span className="text-sm text-muted-foreground">0.1%</span>
            </div>
            <Progress value={1} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSystemMonitor;
