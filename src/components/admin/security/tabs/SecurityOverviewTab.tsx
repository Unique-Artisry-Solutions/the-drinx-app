import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  CreditCard, 
  Target, 
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useSecurityAlerts } from '@/hooks/useSecurityAlerts';
import { AnalyticsMetricCard } from '@/components/charts';

export const SecurityOverviewTab: React.FC = () => {
  const { metrics, alerts, isLoading } = useSecurityAlerts();

  const recentAlerts = alerts.filter(alert => !alert.resolved).slice(0, 5);
  const riskLevel = metrics.riskScore > 80 ? 'high' : 
                   metrics.riskScore > 50 ? 'medium' : 'low';

  const SecurityMetricsGrid = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <AnalyticsMetricCard
        title="Payment Attempts (24h)"
        value={metrics.totalPaymentAttempts}
        icon={CreditCard}
        iconColor="text-blue-500"
        change={12}
      />
      <AnalyticsMetricCard
        title="Failed Payments"
        value={metrics.failedPaymentAttempts}
        icon={AlertTriangle}
        iconColor="text-orange-500"
        change={-5}
      />
      <AnalyticsMetricCard
        title="Fraud Attempts"
        value={metrics.fraudAttempts}
        icon={Shield}
        iconColor="text-red-500"
        change={-15}
      />
      <AnalyticsMetricCard
        title="Suspicious Activities"
        value={metrics.suspiciousActivities}
        icon={Target}
        iconColor="text-purple-500"
        change={8}
      />
    </div>
  );

  const SecurityStatusCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Status
        </CardTitle>
        <CardDescription>
          Overall security posture and threat assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Risk Level</span>
            <Badge variant={
              riskLevel === 'high' ? 'destructive' : 
              riskLevel === 'medium' ? 'secondary' : 'default'
            }>
              {riskLevel.toUpperCase()}
            </Badge>
          </div>
          <Progress value={metrics.riskScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Risk Score: {Math.round(metrics.riskScore)}/100
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {24 - metrics.suspiciousActivities}
            </div>
            <div className="text-xs text-muted-foreground">Hours Secure</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {Math.round((metrics.totalPaymentAttempts - metrics.failedPaymentAttempts) / Math.max(1, metrics.totalPaymentAttempts) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RecentAlertsCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Recent Alerts
        </CardTitle>
        <CardDescription>
          Latest security alerts requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No active alerts</p>
            <p className="text-xs text-muted-foreground">All systems secure</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <Alert key={alert.id} className={
                alert.type === 'critical' ? 'border-red-500' :
                alert.type === 'warning' ? 'border-orange-500' : 'border-blue-500'
              }>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                    <Badge variant={
                      alert.type === 'critical' ? 'destructive' :
                      alert.type === 'warning' ? 'secondary' : 'default'
                    }>
                      {alert.type}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ThreatTrendsCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Threat Trends
        </CardTitle>
        <CardDescription>
          Security trends over the last 24 hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-sm">Fraud Attempts</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">-15%</div>
              <div className="text-xs text-green-500">Decreasing</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-sm">Failed Logins</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">+8%</div>
              <div className="text-xs text-red-500">Increasing</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Rate Limits</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">±0%</div>
              <div className="text-xs text-muted-foreground">Stable</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SecurityMetricsGrid />
      
      <div className="grid gap-6 md:grid-cols-2">
        <SecurityStatusCard />
        <RecentAlertsCard />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ThreatTrendsCard />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Monitoring
            </CardTitle>
            <CardDescription>
              Real-time monitoring status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Gateway</span>
                <Badge variant="default">
                  <Activity className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fraud Detection</span>
                <Badge variant="default">
                  <Activity className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rate Limiting</span>
                <Badge variant="default">
                  <Activity className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Compliance Auditing</span>
                <Badge variant="default">
                  <Activity className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};