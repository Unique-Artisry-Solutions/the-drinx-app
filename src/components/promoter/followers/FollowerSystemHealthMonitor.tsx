
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Database,
  Zap,
  Users
} from 'lucide-react';
import { useAdaptiveSubscriptions } from '@/hooks/useAdaptiveSubscriptions';
import { FollowerComponentProps } from '@/types/FollowerComponentTypes';
import FollowerErrorBoundary from './FollowerErrorBoundary';

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
  const { systemHealth, usingNewSystem, refetch } = useAdaptiveSubscriptions(promoterId);

  React.useEffect(() => {
    if (systemHealth && onSuccess) {
      onSuccess(systemHealth);
    }
  }, [systemHealth, onSuccess]);

  React.useEffect(() => {
    if (systemHealth?.error && onError) {
      onError(new Error(systemHealth.error));
    }
  }, [systemHealth?.error, onError]);

  const getStatusIcon = (isWorking: boolean | undefined) => {
    if (isWorking === undefined) return <RefreshCw className="h-4 w-4 animate-spin" />;
    return isWorking ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (isWorking: boolean | undefined) => {
    if (isWorking === undefined) return <Badge variant="secondary">Checking...</Badge>;
    return isWorking ? 
      <Badge variant="default" className="bg-green-500">Healthy</Badge> : 
      <Badge variant="destructive">Error</Badge>;
  };

  const handleRefresh = () => {
    refetch();
  };

  // Throw error if system health indicates a critical error
  if (systemHealth?.error) {
    throw new Error(systemHealth.error);
  }

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
        {/* Current System Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="font-medium">
              Current System: {usingNewSystem ? 'New' : 'Legacy'}
            </span>
          </div>
          {getStatusBadge(true)}
        </div>

        {/* System Health Details */}
        {systemHealth && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemHealth.newSystemWorking)}
                <span className="text-sm">New System</span>
              </div>
              {getStatusBadge(systemHealth.newSystemWorking)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemHealth.legacySystemWorking)}
                <span className="text-sm">Legacy System</span>
              </div>
              {getStatusBadge(systemHealth.legacySystemWorking)}
            </div>

            {showDetails && (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>New System Count:</span>
                  <span className="font-mono">{systemHealth.newSystemCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Legacy System Count:</span>
                  <span className="font-mono">{systemHealth.legacySystemCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Systems In Sync:</span>
                  <span className={systemHealth.systemInSync ? 'text-green-600' : 'text-red-600'}>
                    {systemHealth.systemInSync ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sync Warning */}
        {systemHealth && !systemHealth.systemInSync && (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              Data sync issue detected. New system has {systemHealth.newSystemCount} followers, 
              legacy system has {systemHealth.legacySystemCount} followers.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowerSystemHealthMonitor;
