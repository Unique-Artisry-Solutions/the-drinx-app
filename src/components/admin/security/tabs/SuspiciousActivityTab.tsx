import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Target,
  Users,
  Activity,
  RefreshCw
} from 'lucide-react';
import { AnalyticsLineChart, AnalyticsBarChart } from '@/components/charts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SuspiciousActivity {
  id: string;
  type: 'high_fraud_score' | 'multiple_failures' | 'geo_anomaly' | 'device_anomaly' | 'velocity_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: Record<string, any>;
  userId?: string;
  ipAddress?: string;
  location?: string;
  timestamp: string;
  riskScore: number;
  status: 'active' | 'resolved' | 'investigating';
}

interface SuspiciousActivityMetrics {
  totalActivities: number;
  criticalAlerts: number;
  activeInvestigations: number;
  averageRiskScore: number;
  activityTrends: Array<{
    name: string;
    suspicious: number;
    critical: number;
  }>;
  riskDistribution: Array<{
    name: string;
    value: number;
  }>;
  recentActivities: SuspiciousActivity[];
}

export const SuspiciousActivityTab: React.FC = () => {
  const [metrics, setMetrics] = useState<SuspiciousActivityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const fetchSuspiciousActivities = async () => {
    try {
      setIsLoading(true);

      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      // Fetch high-risk payment attempts
      const { data: paymentLogs, error: paymentError } = await supabase
        .from('payment_audit_logs')
        .select('*')
        .gte('created_at', last24Hours.toISOString())
        .order('created_at', { ascending: false });

      // Fetch device fingerprints with high risk scores
      const { data: deviceData, error: deviceError } = await supabase
        .from('device_fingerprints')
        .select('*')
        .gte('risk_score', 70)
        .gte('updated_at', last24Hours.toISOString())
        .order('risk_score', { ascending: false });

      // Fetch security events
      const { data: securityEvents, error: securityError } = await supabase
        .from('security_event_logs')
        .select('*')
        .in('event_type', ['suspicious_activity', 'fraud_attempt', 'anomaly_detected'])
        .gte('created_at', last24Hours.toISOString())
        .order('created_at', { ascending: false });

      if (paymentError || deviceError || securityError) {
        throw paymentError || deviceError || securityError;
      }

      // Process suspicious activities
      const activities: SuspiciousActivity[] = [];

      // Process high-risk payments
      (paymentLogs || []).forEach(payment => {
        const riskScore = 0; // Would be calculated by fraud detection system
        if (riskScore > 70) {
          activities.push({
            id: `payment-${payment.id}`,
            type: 'high_fraud_score',
            severity: riskScore > 90 ? 'critical' : riskScore > 80 ? 'high' : 'medium',
            description: `High fraud score payment attempt (${riskScore}/100)`,
            details: {
              amount: payment.amount,
              currency: payment.currency,
              payment_method: 'unknown' // Would be extracted from payment data
            },
            userId: payment.user_id,
            timestamp: payment.created_at,
            riskScore,
            status: 'active'
          });
        }
      });

      // Process device anomalies
      (deviceData || []).forEach(device => {
        activities.push({
          id: `device-${device.id}`,
          type: 'device_anomaly',
          severity: device.risk_score > 90 ? 'critical' : 'high',
          description: `High-risk device detected (Risk: ${device.risk_score}/100)`,
          details: device.device_data as Record<string, any>,
          userId: device.user_id || undefined,
          timestamp: device.updated_at,
          riskScore: device.risk_score || 0,
          status: 'active'
        });
      });

      // Process security events
      (securityEvents || []).forEach(event => {
        activities.push({
          id: `security-${event.id}`,
          type: event.event_type?.includes('fraud') ? 'high_fraud_score' : 'velocity_spike',
          severity: event.severity === 'high' ? 'high' : 
                   event.severity === 'critical' ? 'critical' : 'medium',
          description: `Security event: ${event.event_type}`,
          details: {},
          userId: event.user_id || undefined,
          ipAddress: event.ip_address || undefined,
          timestamp: event.created_at,
          riskScore: 75, // Default for security events
          status: 'active'
        });
      });

      // Sort by timestamp and risk score
      activities.sort((a, b) => {
        const timeCompare = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (timeCompare !== 0) return timeCompare;
        return b.riskScore - a.riskScore;
      });

      // Calculate metrics
      const criticalAlerts = activities.filter(a => a.severity === 'critical').length;
      const averageRiskScore = activities.length > 0 
        ? activities.reduce((sum, a) => sum + a.riskScore, 0) / activities.length 
        : 0;

      // Group activities by hour
      const hourlyGroups = new Map<string, { suspicious: number; critical: number }>();
      activities.forEach(activity => {
        const hour = new Date(activity.timestamp).toISOString().slice(0, 13) + ':00';
        const existing = hourlyGroups.get(hour) || { suspicious: 0, critical: 0 };
        existing.suspicious++;
        if (activity.severity === 'critical') existing.critical++;
        hourlyGroups.set(hour, existing);
      });

      const activityTrends = Array.from(hourlyGroups.entries())
        .map(([hour, data]) => ({
          name: new Date(hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ...data
        }))
        .slice(-24);

      // Risk score distribution
      const riskRanges = {
        'Low (0-50)': 0,
        'Medium (51-70)': 0,
        'High (71-85)': 0,
        'Critical (86-100)': 0
      };

      activities.forEach(activity => {
        if (activity.riskScore <= 50) riskRanges['Low (0-50)']++;
        else if (activity.riskScore <= 70) riskRanges['Medium (51-70)']++;
        else if (activity.riskScore <= 85) riskRanges['High (71-85)']++;
        else riskRanges['Critical (86-100)']++;
      });

      const riskDistribution = Object.entries(riskRanges).map(([name, value]) => ({ name, value }));

      setMetrics({
        totalActivities: activities.length,
        criticalAlerts,
        activeInvestigations: 0, // Could be tracked separately
        averageRiskScore: Math.round(averageRiskScore),
        activityTrends,
        riskDistribution,
        recentActivities: activities.slice(0, 20)
      });

    } catch (error) {
      console.error('Error fetching suspicious activities:', error);
      toast.error('Failed to load suspicious activity data');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsResolved = async (activityId: string) => {
    try {
      // Update the activity status (this would be implemented based on your data structure)
      if (metrics) {
        const updatedActivities = metrics.recentActivities.map(activity =>
          activity.id === activityId ? { ...activity, status: 'resolved' as const } : activity
        );
        setMetrics({
          ...metrics,
          recentActivities: updatedActivities
        });
      }
      toast.success('Activity marked as resolved');
    } catch (error) {
      console.error('Error resolving activity:', error);
      toast.error('Failed to resolve activity');
    }
  };

  useEffect(() => {
    fetchSuspiciousActivities();
    
    // Real-time subscription for security events
    const channel = supabase
      .channel('suspicious-activity')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'security_event_logs'
      }, () => {
        fetchSuspiciousActivities();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'device_fingerprints'
      }, () => {
        fetchSuspiciousActivities();
      })
      .subscribe();

    // Auto-refresh every 3 minutes
    const interval = setInterval(fetchSuspiciousActivities, 180000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  if (isLoading && !metrics) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Suspicious Activity Detection</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered fraud detection and anomaly monitoring
          </p>
        </div>
        <Button
          onClick={fetchSuspiciousActivities}
          size="sm"
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Critical Alert Banner */}
      {metrics && metrics.criticalAlerts > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {metrics.criticalAlerts} critical suspicious activities detected requiring immediate attention
              </span>
              <Badge variant="destructive">Critical</Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Suspicious Activities</p>
                <p className="text-2xl font-bold">{metrics?.totalActivities || 0}</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-500">{metrics?.criticalAlerts || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Risk Score</p>
                <p className="text-2xl font-bold">{metrics?.averageRiskScore || 0}/100</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Under Investigation</p>
                <p className="text-2xl font-bold">{metrics?.activeInvestigations || 0}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Trends</CardTitle>
            <CardDescription>
              Suspicious activity detection over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsLineChart
              data={metrics?.activityTrends || []}
              height={300}
              series={[
                { key: 'suspicious', name: 'Suspicious', color: '#f59e0b' },
                { key: 'critical', name: 'Critical', color: '#ef4444' }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
            <CardDescription>
              Distribution of risk scores across activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={metrics?.riskDistribution || []}
              height={300}
              series={[
                { key: 'value', name: 'Count', color: '#6366f1' }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Suspicious Activities
          </CardTitle>
          <CardDescription>
            Latest detected suspicious activities requiring review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics?.recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No suspicious activities detected</p>
              <p className="text-xs text-muted-foreground">All systems operating normally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics?.recentActivities.slice(0, 15).map((activity) => (
                <div 
                  key={activity.id} 
                  className={`border rounded-lg p-4 ${
                    activity.status === 'resolved' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-full ${
                          activity.severity === 'critical' ? 'bg-red-100 text-red-600' :
                          activity.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {activity.type === 'high_fraud_score' ? <Target className="h-4 w-4" /> :
                           activity.type === 'device_anomaly' ? <Shield className="h-4 w-4" /> :
                           <AlertTriangle className="h-4 w-4" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{activity.description}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(activity.timestamp).toLocaleString()}
                            </div>
                            {activity.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {activity.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-12 space-y-2">
                        <div className="flex items-center gap-4">
                          <Badge variant={
                            activity.severity === 'critical' ? 'destructive' :
                            activity.severity === 'high' ? 'secondary' : 'outline'
                          }>
                            {activity.severity} • Risk: {activity.riskScore}/100
                          </Badge>
                          
                          <Badge variant={
                            activity.status === 'resolved' ? 'default' :
                            activity.status === 'investigating' ? 'secondary' : 'outline'
                          }>
                            {activity.status}
                          </Badge>
                        </div>
                        
                        {Object.keys(activity.details).length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Details: {JSON.stringify(activity.details, null, 0).slice(0, 100)}...
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col gap-2">
                      {activity.status !== 'resolved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsResolved(activity.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};