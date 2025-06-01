
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, TrendingUp } from 'lucide-react';

const PerformanceMetricsTab = () => {
  // Mock performance data
  const performanceMetrics = [
    {
      name: 'Response Time',
      value: 120,
      unit: 'ms',
      status: 'good',
      change: -5
    },
    {
      name: 'Throughput',
      value: 850,
      unit: 'req/min',
      status: 'excellent',
      change: 12
    },
    {
      name: 'Error Rate',
      value: 0.2,
      unit: '%',
      status: 'good',
      change: -0.1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.name}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}{metric.unit}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className={metric.change > 0 ? 'text-green-600' : 'text-red-600'}>
                  {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}
                </span>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            System performance metrics and health indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">CPU Usage</span>
              <span className="text-sm text-muted-foreground">45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Memory Usage</span>
              <span className="text-sm text-muted-foreground">68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Disk I/O</span>
              <span className="text-sm text-muted-foreground">32%</span>
            </div>
            <Progress value={32} className="h-2" />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Performance trending upward over the last 24 hours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetricsTab;
