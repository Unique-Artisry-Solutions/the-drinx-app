// Task 5: Connection Recovery & Monitoring for admin dashboard
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ConnectionMetrics {
  totalConnections: number;
  activeConnections: number;
  failedConnections: number;
  averageLatency: number;
  uptime: number;
  lastOutage?: Date;
  reconnectionRate: number;
  messagesThroughput: number;
  errorRate: number;
}

export interface ConnectionEvent {
  id: string;
  timestamp: Date;
  type: 'connect' | 'disconnect' | 'error' | 'reconnect';
  userId?: string;
  details: string;
  latency?: number;
}

export interface NotificationDeliveryStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  averageDeliveryTime: number;
  channelStats: { [channel: string]: { sent: number; delivered: number; failed: number } };
}

interface UseConnectionMonitoringProps {
  updateInterval?: number;
  retentionPeriod?: number; // in hours
}

export const useConnectionMonitoring = ({
  updateInterval = 30000, // 30 seconds
  retentionPeriod = 24 // 24 hours
}: UseConnectionMonitoringProps = {}) => {
  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    totalConnections: 0,
    activeConnections: 0,
    failedConnections: 0,
    averageLatency: 0,
    uptime: 0,
    reconnectionRate: 0,
    messagesThroughput: 0,
    errorRate: 0
  });

  const [events, setEvents] = useState<ConnectionEvent[]>([]);
  const [deliveryStats, setDeliveryStats] = useState<NotificationDeliveryStats>({
    totalSent: 0,
    totalDelivered: 0,
    totalFailed: 0,
    deliveryRate: 0,
    averageDeliveryTime: 0,
    channelStats: {}
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch connection metrics from Supabase analytics
  const fetchConnectionMetrics = useCallback(async () => {
    try {
      setError(null);
      
      // Query Supabase analytics for connection data
      // This would need to be implemented with actual analytics tables
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - retentionPeriod);

      // Simulated metrics - in real implementation, query actual analytics tables
      const simulatedMetrics: ConnectionMetrics = {
        totalConnections: Math.floor(Math.random() * 1000) + 500,
        activeConnections: Math.floor(Math.random() * 100) + 50,
        failedConnections: Math.floor(Math.random() * 10),
        averageLatency: Math.random() * 200 + 50,
        uptime: 99.5 + Math.random() * 0.4,
        reconnectionRate: Math.random() * 5,
        messagesThroughput: Math.floor(Math.random() * 1000) + 200,
        errorRate: Math.random() * 2
      };

      setMetrics(simulatedMetrics);

      // Fetch recent connection events
      const simulatedEvents: ConnectionEvent[] = Array.from({ length: 10 }, (_, i) => ({
        id: `event-${Date.now()}-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        type: ['connect', 'disconnect', 'error', 'reconnect'][Math.floor(Math.random() * 4)] as any,
        userId: `user-${Math.floor(Math.random() * 100)}`,
        details: 'Connection event details',
        latency: Math.random() * 300 + 50
      }));

      setEvents(prev => {
        // Merge new events and sort by timestamp
        const combined = [...prev, ...simulatedEvents];
        return combined
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 100); // Keep only most recent 100 events
      });

    } catch (error) {
      console.error('Error fetching connection metrics:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch metrics');
    }
  }, [retentionPeriod]);

  // Fetch notification delivery statistics
  const fetchDeliveryStats = useCallback(async () => {
    try {
      // Query notification delivery logs
      const { data: deliveryLogs, error: deliveryError } = await supabase
        .from('notification_delivery_status')
        .select('*')
        .gte('created_at', new Date(Date.now() - retentionPeriod * 60 * 60 * 1000).toISOString());

      if (deliveryError) throw deliveryError;

      // Calculate delivery statistics
      const totalSent = deliveryLogs?.length || 0;
      const delivered = deliveryLogs?.filter(log => log.status === 'delivered').length || 0;
      const failed = deliveryLogs?.filter(log => log.status === 'failed').length || 0;

      // Group by channel
      const channelStats: { [channel: string]: { sent: number; delivered: number; failed: number } } = {};
      
      deliveryLogs?.forEach(log => {
        const channel = log.channel || 'unknown';
        if (!channelStats[channel]) {
          channelStats[channel] = { sent: 0, delivered: 0, failed: 0 };
        }
        
        channelStats[channel].sent++;
        if (log.status === 'delivered') channelStats[channel].delivered++;
        if (log.status === 'failed') channelStats[channel].failed++;
      });

      const stats: NotificationDeliveryStats = {
        totalSent,
        totalDelivered: delivered,
        totalFailed: failed,
        deliveryRate: totalSent > 0 ? (delivered / totalSent) * 100 : 0,
        averageDeliveryTime: 1500, // Would calculate from actual delivery times
        channelStats
      };

      setDeliveryStats(stats);

    } catch (error) {
      console.error('Error fetching delivery stats:', error);
    }
  }, [retentionPeriod]);

  // Get connection health status
  const getConnectionHealth = useCallback((): 'healthy' | 'degraded' | 'critical' => {
    if (metrics.uptime < 95 || metrics.errorRate > 5) return 'critical';
    if (metrics.uptime < 99 || metrics.errorRate > 2) return 'degraded';
    return 'healthy';
  }, [metrics]);

  // Get delivery health status
  const getDeliveryHealth = useCallback((): 'healthy' | 'degraded' | 'critical' => {
    if (deliveryStats.deliveryRate < 90) return 'critical';
    if (deliveryStats.deliveryRate < 95) return 'degraded';
    return 'healthy';
  }, [deliveryStats]);

  // Export metrics for reporting
  const exportMetrics = useCallback(() => {
    const report = {
      timestamp: new Date().toISOString(),
      connectionMetrics: metrics,
      deliveryStats,
      recentEvents: events.slice(0, 50),
      healthStatus: {
        connection: getConnectionHealth(),
        delivery: getDeliveryHealth()
      }
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notification-metrics-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [metrics, deliveryStats, events, getConnectionHealth, getDeliveryHealth]);

  // Clear old events
  const clearOldEvents = useCallback(() => {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - retentionPeriod);
    
    setEvents(prev => prev.filter(event => event.timestamp > cutoff));
  }, [retentionPeriod]);

  // Set up periodic updates
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchConnectionMetrics(),
        fetchDeliveryStats()
      ]);
      setIsLoading(false);
    };

    // Initial fetch
    fetchData();

    // Set up periodic updates
    const interval = setInterval(fetchData, updateInterval);

    // Set up cleanup interval
    const cleanupInterval = setInterval(clearOldEvents, 60 * 60 * 1000); // Every hour

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [updateInterval, fetchConnectionMetrics, fetchDeliveryStats, clearOldEvents]);

  // Real-time event tracking
  useEffect(() => {
    const channel = supabase
      .channel('connection-monitoring')
      .on('broadcast', { event: 'connection_event' }, (payload) => {
        const event: ConnectionEvent = {
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          ...payload.payload
        };

        setEvents(prev => [event, ...prev.slice(0, 99)]);
        
        // Update metrics based on event type
        if (event.type === 'connect') {
          setMetrics(prev => ({
            ...prev,
            activeConnections: prev.activeConnections + 1,
            totalConnections: prev.totalConnections + 1
          }));
        } else if (event.type === 'disconnect') {
          setMetrics(prev => ({
            ...prev,
            activeConnections: Math.max(0, prev.activeConnections - 1)
          }));
        } else if (event.type === 'error') {
          setMetrics(prev => ({
            ...prev,
            failedConnections: prev.failedConnections + 1,
            errorRate: prev.errorRate + 0.1
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    metrics,
    events,
    deliveryStats,
    isLoading,
    error,
    connectionHealth: getConnectionHealth(),
    deliveryHealth: getDeliveryHealth(),
    exportMetrics,
    refresh: () => {
      fetchConnectionMetrics();
      fetchDeliveryStats();
    }
  };
};