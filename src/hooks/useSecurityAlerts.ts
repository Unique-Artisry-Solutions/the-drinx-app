import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'payment' | 'fraud' | 'rate_limit' | 'compliance' | 'system';
  title: string;
  message: string;
  timestamp: string;
  data?: Record<string, any>;
  resolved?: boolean;
}

export interface SecurityMetrics {
  totalPaymentAttempts: number;
  failedPaymentAttempts: number;
  fraudAttempts: number;
  rateLimitViolations: number;
  suspiciousActivities: number;
  activeDevices: number;
  riskScore: number;
}

export const useSecurityAlerts = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalPaymentAttempts: 0,
    failedPaymentAttempts: 0,
    fraudAttempts: 0,
    rateLimitViolations: 0,
    suspiciousActivities: 0,
    activeDevices: 0,
    riskScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSecurityData = async () => {
    try {
      // Fetch recent security events
      const { data: securityEvents, error: eventsError } = await supabase
        .from('security_event_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch payment audit data for metrics
      const { data: paymentAudits, error: paymentError } = await supabase
        .from('payment_audit_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Fetch compliance audit trail
      const { data: complianceEvents, error: complianceError } = await supabase
        .from('compliance_audit_trail')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (eventsError || paymentError || complianceError) {
        console.error('Error fetching security data:', eventsError || paymentError || complianceError);
        return;
      }

      // Process security events into alerts
      const processedAlerts: SecurityAlert[] = (securityEvents || []).map((event: any) => ({
        id: event.id,
        type: event.severity === 'critical' ? 'critical' : 
              event.severity === 'high' ? 'warning' : 'info',
        category: event.event_type?.includes('payment') ? 'payment' :
                 event.event_type?.includes('fraud') ? 'fraud' :
                 event.event_type?.includes('rate') ? 'rate_limit' : 'system',
        title: event.event_type || 'Security Event',
        message: 'Security event detected',
        timestamp: event.created_at,
        data: event.details,
        resolved: false // Security events don't have status field in the current schema
      }));

      // Calculate metrics from payment data
      const totalPayments = paymentAudits?.length || 0;
      const failedPayments = paymentAudits?.filter((p: any) => p.status === 'failed')?.length || 0;
      const fraudAttempts = 0; // Would need separate fraud detection data

      const newMetrics: SecurityMetrics = {
        totalPaymentAttempts: totalPayments,
        failedPaymentAttempts: failedPayments,
        fraudAttempts,
        rateLimitViolations: securityEvents?.filter((e: any) => 
          e.event_type?.includes('rate_limit')
        )?.length || 0,
        suspiciousActivities: securityEvents?.filter((e: any) => 
          e.severity === 'high' || e.severity === 'critical'
        )?.length || 0,
        activeDevices: 0, // To be calculated from device fingerprints
        riskScore: fraudAttempts > 0 ? Math.min(100, (fraudAttempts / totalPayments) * 100) : 0
      };

      setAlerts(processedAlerts);
      setMetrics(newMetrics);
      setIsLoading(false);

    } catch (error) {
      console.error('Error in fetchSecurityData:', error);
      setIsLoading(false);
    }
  };

  // Real-time subscription for security events
  useEffect(() => {
    fetchSecurityData();

    const channel = supabase
      .channel('security-monitoring')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'security_event_logs'
      }, (payload) => {
        console.log('New security event:', payload);
        fetchSecurityData(); // Refresh data on new events
        
        // Show real-time alert for critical events
        if ((payload.new as any)?.severity === 'critical') {
          toast.error(`Critical Security Alert: ${(payload.new as any).event_type}`, {
            description: 'Critical security event detected',
            duration: 10000,
          });
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payment_audit_logs'
      }, () => {
        fetchSecurityData(); // Refresh metrics on payment events
      })
      .subscribe();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSecurityData, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.resolved).length;
  const warningCount = alerts.filter(a => a.type === 'warning' && !a.resolved).length;

  const markAlertResolved = async (alertId: string) => {
    try {
      // Note: security_event_logs table doesn't have status field in current schema
      // This would need to be implemented based on your requirements
      
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ));
      
      toast.success('Alert marked as resolved');
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  return {
    alerts,
    metrics,
    isLoading,
    criticalCount,
    warningCount,
    markAlertResolved,
    refresh: fetchSecurityData
  };
};