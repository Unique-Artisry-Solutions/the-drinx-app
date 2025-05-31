import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SystemHealthProps {
  onRefresh?: () => void;
}

export function FollowerSystemHealthMonitor({ onRefresh }: SystemHealthProps) {
  // Mock health data - preserved as placeholder
  const healthMetrics = [
    { name: 'System Status', status: 'healthy', value: '99.9%' },
    { name: 'Response Time', status: 'warning', value: '120ms' },
    { name: 'Error Rate', status: 'healthy', value: '0.1%' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthMetrics.map((metric) => (
            <div key={metric.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(metric.status)}
                <span>{metric.name}</span>
              </div>
              <Badge variant={metric.status === 'healthy' ? 'default' : 'secondary'}>
                {metric.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
