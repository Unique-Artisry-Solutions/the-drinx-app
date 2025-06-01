
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useAdaptiveSubscriptions } from '@/hooks/useAdaptiveSubscriptions';
import { Activity, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

interface FollowerSystemHealthMonitorProps {
  promoterId?: string;
}

const FollowerSystemHealthMonitor: React.FC<FollowerSystemHealthMonitorProps> = ({ 
  promoterId 
}) => {
  const { flags, updateFlag, isLoading: flagsLoading } = useFeatureFlags();
  const { systemHealth, usingNewSystem } = useAdaptiveSubscriptions(promoterId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Follower System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">New Follower System</label>
              <p className="text-xs text-muted-foreground">
                Enable the new follower and notification system
              </p>
            </div>
            <Switch
              checked={flags.useNewFollowerSystem}
              onCheckedChange={(checked) => updateFlag('useNewFollowerSystem', checked)}
              disabled={flagsLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Real-time Notifications</label>
              <p className="text-xs text-muted-foreground">
                Enable real-time notification delivery
              </p>
            </div>
            <Switch
              checked={flags.enableRealTimeNotifications}
              onCheckedChange={(checked) => updateFlag('enableRealTimeNotifications', checked)}
              disabled={flagsLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Advanced Segmentation</label>
              <p className="text-xs text-muted-foreground">
                Enable advanced audience segmentation features
              </p>
            </div>
            <Switch
              checked={flags.enableAdvancedSegmentation}
              onCheckedChange={(checked) => updateFlag('enableAdvancedSegmentation', checked)}
              disabled={flagsLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Legacy Fallback</label>
              <p className="text-xs text-muted-foreground">
                Automatically fallback to legacy system on errors
              </p>
            </div>
            <Switch
              checked={flags.fallbackToLegacyOnError}
              onCheckedChange={(checked) => updateFlag('fallbackToLegacyOnError', checked)}
              disabled={flagsLoading}
            />
          </div>
        </CardContent>
      </Card>

      {promoterId && systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">New System</span>
                <Badge variant={systemHealth.newSystemWorking ? 'default' : 'destructive'}>
                  {systemHealth.newSystemWorking ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {systemHealth.newSystemWorking ? 'Online' : 'Error'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Legacy System</span>
                <Badge variant={systemHealth.legacySystemWorking ? 'default' : 'destructive'}>
                  {systemHealth.legacySystemWorking ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {systemHealth.legacySystemWorking ? 'Online' : 'Error'}
                </Badge>
              </div>
            </div>

            {systemHealth.newSystemCount !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>New System Count:</span>
                  <span>{systemHealth.newSystemCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Legacy System Count:</span>
                  <span>{systemHealth.legacySystemCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Systems in Sync:</span>
                  <Badge variant={systemHealth.systemInSync ? 'default' : 'secondary'}>
                    {systemHealth.systemInSync ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            )}

            {systemHealth.error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{systemHealth.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Active System:</span>
              <Badge variant={usingNewSystem ? 'default' : 'secondary'}>
                {usingNewSystem ? 'New System' : 'Legacy System'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Real-time Notifications:</span>
              <Badge variant={flags.enableRealTimeNotifications ? 'default' : 'secondary'}>
                {flags.enableRealTimeNotifications ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Advanced Segmentation:</span>
              <Badge variant={flags.enableAdvancedSegmentation ? 'default' : 'secondary'}>
                {flags.enableAdvancedSegmentation ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowerSystemHealthMonitor;
