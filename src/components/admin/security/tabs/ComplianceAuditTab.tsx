import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  RefreshCw,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import { AnalyticsLineChart, AnalyticsBarChart } from '@/components/charts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ComplianceEvent {
  id: string;
  compliance_type: string;
  action_type: string;
  user_id?: string;
  affected_data_type: string;
  action_details: Record<string, any>;
  performed_by?: string;
  created_at: string;
  compliance_status: string;
  ip_address?: string;
}

interface ComplianceMetrics {
  totalEvents: number;
  gdprEvents: number;
  pciEvents: number;
  complianceRate: number;
  eventTrends: Array<{
    name: string;
    gdpr: number;
    pci: number;
    other: number;
  }>;
  eventTypes: Array<{
    name: string;
    value: number;
  }>;
  recentEvents: ComplianceEvent[];
}

export const ComplianceAuditTab: React.FC = () => {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchComplianceData = async () => {
    try {
      setIsLoading(true);

      // Calculate time range
      const now = new Date();
      const startTime = new Date();
      switch (timeRange) {
        case '24h':
          startTime.setHours(now.getHours() - 24);
          break;
        case '7d':
          startTime.setDate(now.getDate() - 7);
          break;
        case '30d':
          startTime.setDate(now.getDate() - 30);
          break;
        case '90d':
          startTime.setDate(now.getDate() - 90);
          break;
      }

      const { data: auditTrail, error } = await supabase
        .from('compliance_audit_trail')
        .select('*')
        .gte('created_at', startTime.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const events: ComplianceEvent[] = (auditTrail || []).map(event => ({
        ...event,
        action_details: event.action_details as Record<string, any>
      }));

      // Calculate metrics
      const totalEvents = events.length;
      const gdprEvents = events.filter(e => e.compliance_type === 'GDPR').length;
      const pciEvents = events.filter(e => e.compliance_type === 'PCI_DSS' || e.compliance_type === 'PCI').length;
      const compliantEvents = events.filter(e => e.compliance_status === 'compliant').length;
      const complianceRate = totalEvents > 0 ? (compliantEvents / totalEvents) * 100 : 100;

      // Group by day for trends
      const dayGroups = new Map<string, { gdpr: number; pci: number; other: number }>();
      events.forEach(event => {
        const day = new Date(event.created_at).toISOString().slice(0, 10);
        const existing = dayGroups.get(day) || { gdpr: 0, pci: 0, other: 0 };
        
        if (event.compliance_type === 'GDPR') existing.gdpr++;
        else if (event.compliance_type === 'PCI_DSS' || event.compliance_type === 'PCI') existing.pci++;
        else existing.other++;
        
        dayGroups.set(day, existing);
      });

      const eventTrends = Array.from(dayGroups.entries())
        .map(([day, data]) => ({
          name: new Date(day).toLocaleDateString(),
          ...data
        }))
        .slice(-30);

      // Group by event type
      const typeCounts = new Map<string, number>();
      events.forEach(event => {
        const type = event.action_type || 'unknown';
        typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
      });

      const eventTypes = Array.from(typeCounts.entries())
        .map(([name, value]) => ({ 
          name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value 
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      setMetrics({
        totalEvents,
        gdprEvents,
        pciEvents,
        complianceRate: Math.round(complianceRate),
        eventTrends,
        eventTypes,
        recentEvents: events.slice(0, 20)
      });

    } catch (error) {
      console.error('Error fetching compliance data:', error);
      toast.error('Failed to load compliance data');
    } finally {
      setIsLoading(false);
    }
  };

  const exportComplianceReport = async () => {
    try {
      setExportLoading(true);
      
      // This would generate and download a compliance report
      const reportData = {
        generatedAt: new Date().toISOString(),
        timeRange,
        metrics,
        detailedEvents: metrics?.recentEvents
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compliance-report-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Compliance report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export compliance report');
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
    
    // Real-time subscription for compliance events
    const channel = supabase
      .channel('compliance-audit')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'compliance_audit_trail'
      }, () => {
        fetchComplianceData();
      })
      .subscribe();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchComplianceData, 300000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
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
          <h3 className="text-lg font-semibold">Compliance Audit Trail</h3>
          <p className="text-sm text-muted-foreground">
            GDPR, PCI DSS, and other compliance monitoring and reporting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={exportComplianceReport}
            size="sm"
            variant="outline"
            disabled={exportLoading}
          >
            <Download className={`h-4 w-4 mr-2 ${exportLoading ? 'animate-spin' : ''}`} />
            Export Report
          </Button>
          <Button
            onClick={fetchComplianceData}
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
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{metrics?.totalEvents || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">GDPR Events</p>
                <p className="text-2xl font-bold">{metrics?.gdprEvents || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">PCI DSS Events</p>
                <p className="text-2xl font-bold">{metrics?.pciEvents || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {metrics?.complianceRate || 100}%
                  {(metrics?.complianceRate || 100) >= 95 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                  )}
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Event Trends</CardTitle>
            <CardDescription>
              Daily compliance events by type over selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsLineChart
              data={metrics?.eventTrends || []}
              height={300}
              series={[
                { key: 'gdpr', name: 'GDPR', color: '#10b981' },
                { key: 'pci', name: 'PCI DSS', color: '#6366f1' },
                { key: 'other', name: 'Other', color: '#f59e0b' }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Type Distribution</CardTitle>
            <CardDescription>
              Most common types of compliance events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={metrics?.eventTypes || []}
              height={300}
              series={[
                { key: 'value', name: 'Events', color: '#3b82f6' }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Compliance Events
          </CardTitle>
          <CardDescription>
            Latest compliance actions and audit trail entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics?.recentEvents.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No compliance events recorded</p>
              <p className="text-xs text-muted-foreground">All systems operating within compliance</p>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics?.recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      event.compliance_status === 'compliant' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {event.compliance_status === 'compliant' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium">
                          {event.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <Badge variant={
                          event.compliance_type === 'GDPR' ? 'default' :
                          event.compliance_type === 'PCI_DSS' ? 'secondary' : 'outline'
                        }>
                          {event.compliance_type}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span>Data Type: {event.affected_data_type}</span>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {event.user_id ? `User ${event.user_id.slice(0, 8)}...` : 'System'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      event.compliance_status === 'compliant' ? 'default' : 'destructive'
                    }>
                      {event.compliance_status}
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