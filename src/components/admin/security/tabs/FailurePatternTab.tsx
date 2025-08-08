import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Target, Users, RefreshCw } from 'lucide-react';
import { AnalyticsPieChart, AnalyticsBarChart } from '@/components/charts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FailurePattern {
  id: string;
  pattern: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  firstSeen: string;
  lastSeen: string;
  affectedUsers: number;
  commonReasons: string[];
}

interface FailureMetrics {
  totalFailures: number;
  uniqueUsers: number;
  mostCommonReasons: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  hourlyFailures: Array<{
    name: string;
    failures: number;
  }>;
  patterns: FailurePattern[];
}

export const FailurePatternTab: React.FC = () => {
  const [metrics, setMetrics] = useState<FailureMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFailureMetrics = async () => {
    try {
      setIsLoading(true);

      // Get failed payments from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: failedPayments, error } = await supabase
        .from('payment_audit_logs')
        .select('*')
        .in('status', ['failed', 'error', 'declined', 'cancelled'])
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Also get payment failure logs if they exist
      const { data: failureLogs } = await supabase
        .from('payment_failure_logs')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      const allFailures = [...(failedPayments || []), ...(failureLogs || [])];

      // Process failure reasons
      const reasonCounts = new Map<string, number>();
      const userSet = new Set<string>();
      
      allFailures.forEach(failure => {
        // For payment_audit_logs, use error_message; for payment_failure_logs, use failure_reason
        const reason = failure.error_message || 
                      (failure as any).failure_reason || 
                      'Unknown';
        reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
        if (failure.user_id) userSet.add(failure.user_id);
      });

      const mostCommonReasons = Array.from(reasonCounts.entries())
        .map(([name, value]) => ({
          name: name.length > 30 ? name.substring(0, 30) + '...' : name,
          value,
          percentage: Math.round((value / allFailures.length) * 100)
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

      // Group by hour for trends
      const hourlyGroups = new Map<string, number>();
      allFailures.forEach(failure => {
        const hour = new Date(failure.created_at).toISOString().slice(0, 13) + ':00';
        hourlyGroups.set(hour, (hourlyGroups.get(hour) || 0) + 1);
      });

      const hourlyFailures = Array.from(hourlyGroups.entries())
        .map(([hour, failures]) => ({
          name: new Date(hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          failures
        }))
        .slice(-24);

      // Detect patterns (simplified pattern detection)
      const patterns: FailurePattern[] = [];
      
      // Pattern 1: High failure rate from same user
      const userFailures = new Map<string, any[]>();
      allFailures.forEach(failure => {
        if (failure.user_id) {
          const existing = userFailures.get(failure.user_id) || [];
          existing.push(failure);
          userFailures.set(failure.user_id, existing);
        }
      });

      for (const [userId, failures] of userFailures) {
        if (failures.length >= 5) {
          patterns.push({
            id: `user-${userId}`,
            pattern: 'Repeated failures from single user',
            frequency: failures.length,
            severity: failures.length >= 10 ? 'critical' : 'high',
            firstSeen: failures[failures.length - 1].created_at,
            lastSeen: failures[0].created_at,
            affectedUsers: 1,
            commonReasons: Array.from(new Set(failures.map(f => 
              f.failure_reason || f.status || 'Unknown'
            ))).slice(0, 3)
          });
        }
      }

      // Pattern 2: High failure rate for specific payment methods
      const methodFailures = new Map<string, any[]>();
      allFailures.forEach(failure => {
        const method = 'unknown'; // Simplified for now - would need proper metadata handling
        const existing = methodFailures.get(method) || [];
        existing.push(failure);
        methodFailures.set(method, existing);
      });

      for (const [method, failures] of methodFailures) {
        if (failures.length >= 10) {
          const uniqueUsers = new Set(failures.map(f => f.user_id).filter(Boolean)).size;
            patterns.push({
            id: `method-${method}`,
            pattern: `High failure rate for ${method} payments`,
            frequency: failures.length,
            severity: failures.length >= 50 ? 'critical' : 'high',
            firstSeen: failures[failures.length - 1].created_at,
            lastSeen: failures[0].created_at,
            affectedUsers: uniqueUsers,
            commonReasons: Array.from(new Set(failures.map(f => 
              f.error_message || (f as any).failure_reason || 'Unknown'
            ))).slice(0, 3)
          });
        }
      }

      // Sort patterns by severity and frequency
      patterns.sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity] || b.frequency - a.frequency;
      });

      setMetrics({
        totalFailures: allFailures.length,
        uniqueUsers: userSet.size,
        mostCommonReasons,
        hourlyFailures,
        patterns: patterns.slice(0, 10) // Top 10 patterns
      });

    } catch (error) {
      console.error('Error fetching failure metrics:', error);
      toast.error('Failed to load failure pattern data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFailureMetrics();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchFailureMetrics, 300000);
    return () => clearInterval(interval);
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
          <h3 className="text-lg font-semibold">Payment Failure Pattern Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Detect and analyze payment failure patterns over the last 7 days
          </p>
        </div>
        <Button
          onClick={fetchFailureMetrics}
          size="sm"
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Failures</p>
                <p className="text-2xl font-bold">{metrics?.totalFailures.toLocaleString() || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
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
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patterns Detected</p>
                <p className="text-2xl font-bold">{metrics?.patterns.length || 0}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Patterns</p>
                <p className="text-2xl font-bold">
                  {metrics?.patterns.filter(p => p.severity === 'critical').length || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Failure Reasons Distribution</CardTitle>
            <CardDescription>
              Most common reasons for payment failures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart
              data={metrics?.mostCommonReasons || []}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failure Trends</CardTitle>
            <CardDescription>
              Payment failures over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={metrics?.hourlyFailures || []}
              height={300}
              series={[
                { key: 'failures', name: 'Failures', color: '#ef4444' }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Detected Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Detected Failure Patterns
          </CardTitle>
          <CardDescription>
            Automated detection of suspicious payment failure patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics?.patterns.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No concerning patterns detected</p>
              <p className="text-xs text-muted-foreground">Payment failures appear to be normal</p>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics?.patterns.map((pattern) => (
                <div key={pattern.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{pattern.pattern}</h4>
                        <Badge variant={
                          pattern.severity === 'critical' ? 'destructive' :
                          pattern.severity === 'high' ? 'secondary' :
                          pattern.severity === 'medium' ? 'outline' : 'default'
                        }>
                          {pattern.severity}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Frequency:</span>
                          <p className="font-medium">{pattern.frequency} failures</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Affected Users:</span>
                          <p className="font-medium">{pattern.affectedUsers}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">First Seen:</span>
                          <p className="font-medium">
                            {new Date(pattern.firstSeen).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Seen:</span>
                          <p className="font-medium">
                            {new Date(pattern.lastSeen).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-muted-foreground text-sm">Common Reasons:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pattern.commonReasons.map((reason, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {pattern.severity === 'critical' ? (
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                      ) : pattern.severity === 'high' ? (
                        <AlertTriangle className="h-6 w-6 text-orange-500" />
                      ) : (
                        <TrendingUp className="h-6 w-6 text-blue-500" />
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