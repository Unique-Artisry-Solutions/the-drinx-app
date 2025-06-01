
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, Activity, Server, AlertTriangle } from 'lucide-react';

const DatabaseHealthDashboard = () => {
  const healthMetrics = [
    {
      name: 'Connection Pool',
      value: 85,
      status: 'healthy',
      icon: Database
    },
    {
      name: 'Query Performance',
      value: 92,
      status: 'healthy',
      icon: Activity
    },
    {
      name: 'Server Load',
      value: 65,
      status: 'warning',
      icon: Server
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
                <div className="text-2xl font-bold">{metric.value}%</div>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Performance</CardTitle>
          <CardDescription>
            Monitor database health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Connections</span>
              <span className="text-sm text-muted-foreground">45/100</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Query Response Time</span>
              <span className="text-sm text-muted-foreground">120ms avg</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cache Hit Rate</span>
              <span className="text-sm text-muted-foreground">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Database optimization recommended for peak hours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseHealthDashboard;
