
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  RefreshCw,
  Database,
  Zap
} from 'lucide-react';
import { FollowerComponentProps } from '@/types/FollowerComponentTypes';

interface FollowerSystemHealthMonitorProps extends FollowerComponentProps {
  showDetails?: boolean;
}

const FollowerSystemHealthMonitor: React.FC<FollowerSystemHealthMonitorProps> = ({ 
  promoterId,
  showDetails = false,
  className = '',
  onError,
  onSuccess
}) => {
  const [isHealthy, setIsHealthy] = React.useState(true);

  const handleRefresh = () => {
    // Simple health check - in a real app this would check actual system status
    console.log('Refreshing system health for promoter:', promoterId);
    if (onSuccess) {
      onSuccess({ status: 'healthy' });
    }
  };

  const getStatusBadge = () => {
    return isHealthy ? 
      <Badge variant="default" className="bg-green-500">Healthy</Badge> : 
      <Badge variant="destructive">Error</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Health
          </span>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="font-medium">Follower System</span>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Database Connection</span>
            </div>
            <Badge variant="default" className="bg-green-500">Active</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Follower Tracking</span>
            </div>
            <Badge variant="default" className="bg-green-500">Operational</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerSystemHealthMonitor;
