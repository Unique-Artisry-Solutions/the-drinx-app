import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Clock, 
  Shield, 
  Users, 
  RefreshCw,
  Activity
} from 'lucide-react';
import { AnalyticsLineChart, AnalyticsBarChart } from '@/components/charts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RateLimitViolation {
  id: string;
  endpoint: string;
  userId?: string;
  ipAddress: string;
  violationType: string;
  requestCount: number;
  timeWindow: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

interface RateLimitMetrics {
  totalViolations: number;
  uniqueUsers: number;
  uniqueIPs: number;
  mostTargetedEndpoints: Array<{
    name: string;
    value: number;
  }>;
  hourlyViolations: Array<{
    name: string;
    violations: number;
    uniqueIPs: number;
  }>;
  recentViolations: RateLimitViolation[];
}

export const RateLimitTab: React.FC = () => {
  const [metrics, setMetrics] = useState<RateLimitMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRateLimitData = async () => {
    try {
      setIsLoading(true);

      // Calculate time range
      const now = new Date();
      const startTime = new Date();
      switch (timeRange) {
        case '1h':
          startTime.setHours(now.getHours() - 1);
          break;
        case '24h':
          startTime.setHours(now.getHours() - 24);
          break;
        case '7d':
          startTime.setDate(now.getDate() - 7);
          break;
      }

      // Fetch security event logs for rate limiting violations
      const { data: securityEvents, error } = await supabase
        .from('security_event_logs')
        .select('*')
        .eq('event_type', 'rate_limit_violation')
        .gte('created_at', startTime.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process violations
      const violations: RateLimitViolation[] = (securityEvents || []).map(event => ({
        id: event.id,
        endpoint: event.endpoint || 'Unknown',
        userId: event.user_id || undefined,
        ipAddress: event.ip_address || 'Unknown',
        violationType: 'rate_limit',
        requestCount: 0, // Would be in metadata
        timeWindow: '1m',
        timestamp: event.created_at,
        severity: event.severity === 'high' ? 'high' : 
                 event.severity === 'medium' ? 'medium' : 'low'
      }));

      // Calculate metrics
      const uniqueUsers = new Set(violations.map(v => v.userId).filter(Boolean)).size;
      const uniqueIPs = new Set(violations.map(v => v.ipAddress)).size;

      // Group by endpoint
      const endpointCounts = new Map<string, number>();
      violations.forEach(v => {
        endpointCounts.set(v.endpoint, (endpointCounts.get(v.endpoint) || 0) + 1);
      });

      const mostTargetedEndpoints = Array.from(endpointCounts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      // Group by hour
      const hourlyGroups = new Map<string, { violations: number; ips: Set<string> }>();
      violations.forEach(violation => {
        const hour = new Date(violation.timestamp).toISOString().slice(0, 13) + ':00';
        const existing = hourlyGroups.get(hour) || { violations: 0, ips: new Set<string>() };
        existing.violations++;
        existing.ips.add(violation.ipAddress);
        hourlyGroups.set(hour, existing);
      });

      const hourlyViolations = Array.from(hourlyGroups.entries())
        .map(([hour, data]) => ({
          name: new Date(hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          violations: data.violations,
          uniqueIPs: data.ips.size
        }))
        .slice(-24);

      setMetrics({
        totalViolations: violations.length,
        uniqueUsers,
        uniqueIPs,
        mostTargetedEndpoints,
        hourlyViolations,
        recentViolations: violations.slice(0, 20)
      });

    } catch (error) {
      console.error('Error fetching rate limit data:', error);
      toast.error('Failed to load rate limit data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRateLimitData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchRateLimitData, 120000);
    return () => clearInterval(interval);
  }, [timeRange]);

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
          <h3 className="text-lg font-semibold">Rate Limit Monitoring</h3>
          <p className="text-sm text-muted-foreground">
            Track and analyze API rate limit violations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={fetchRateLimitData}
            size="sm"
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Violations</p>
                <p className="text-2xl font-bold">{metrics?.totalViolations || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique IPs</p>
                <p className="text-2xl font-bold">{metrics?.uniqueIPs || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Affected Users</p>
                <p className="text-2xl font-bold">{metrics?.uniqueUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. per Hour</p>
                <p className="text-2xl font-bold">
                  {metrics && metrics.hourlyViolations.length > 0 
                    ? Math.round(metrics.totalViolations / Math.max(1, metrics.hourlyViolations.length))
                    : 0
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Violation Trends</CardTitle>
            <CardDescription>
              Rate limit violations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsLineChart
              data={metrics?.hourlyViolations || []}
              height={300}
              series={[
                { key: 'violations', name: 'Violations', color: '#ef4444' },
                { key: 'uniqueIPs', name: 'Unique IPs', color: '#3b82f6' }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Targeted Endpoints</CardTitle>
            <CardDescription>
              Endpoints with the most rate limit violations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={metrics?.mostTargetedEndpoints || []}
              height={300}
              series={[
                { key: 'value', name: 'Violations', color: '#ef4444' }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Violations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Rate Limit Violations
          </CardTitle>
          <CardDescription>
            Latest rate limit violations requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics?.recentViolations.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No rate limit violations</p>
              <p className="text-xs text-muted-foreground">All API usage within limits</p>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics?.recentViolations.slice(0, 10).map((violation) => (
                <div key={violation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      violation.severity === 'high' ? 'bg-red-100 text-red-600' :
                      violation.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{violation.endpoint}</p>
                      <p className="text-sm text-muted-foreground">
                        IP: {violation.ipAddress} • {new Date(violation.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      violation.severity === 'high' ? 'destructive' :
                      violation.severity === 'medium' ? 'secondary' : 'outline'
                    }>
                      {violation.severity}
                    </Badge>
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