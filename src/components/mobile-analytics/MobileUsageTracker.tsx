
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Clock, Eye, AlertTriangle, Users, RotateCcw } from 'lucide-react';
import { MobileUsageMetrics } from '@/services/mobileAnalyticsService';

interface MobileUsageTrackerProps {
  metrics: MobileUsageMetrics;
  promoterId: string;
}

const MobileUsageTracker: React.FC<MobileUsageTrackerProps> = ({ metrics }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getCrashRateColor = (rate: number) => {
    if (rate < 1) return 'text-green-600';
    if (rate < 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRetentionColor = (rate: number) => {
    if (rate > 80) return 'text-green-600';
    if (rate > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Mobile App Usage Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Track user engagement and app performance metrics
        </p>
      </div>

      {/* Usage Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Users active in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatDuration(metrics.sessionDuration)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Average session length
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-500" />
              Screen Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.screenViews.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Total screens viewed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              App Opens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.appOpens.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Times app was opened today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Crash Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getCrashRateColor(metrics.crashRate)}`}>
              {metrics.crashRate.toFixed(2)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              App crashes per session
            </p>
            <Badge 
              variant={metrics.crashRate < 1 ? 'default' : 'destructive'} 
              className="mt-2"
            >
              {metrics.crashRate < 1 ? 'Good' : 'Needs Attention'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-blue-500" />
              Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getRetentionColor(metrics.retentionRate)}`}>
              {metrics.retentionRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              7-day user retention
            </p>
            <Badge 
              variant={metrics.retentionRate > 80 ? 'default' : 'secondary'} 
              className="mt-2"
            >
              {metrics.retentionRate > 80 ? 'Excellent' : 
               metrics.retentionRate > 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileUsageTracker;
