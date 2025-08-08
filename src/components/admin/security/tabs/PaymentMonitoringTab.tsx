import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { AnalyticsLineChart, AnalyticsBarChart } from '@/components/charts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentMetrics {
  totalAttempts: number;
  successfulPayments: number;
  failedPayments: number;
  averageAmount: number;
  successRate: number;
  hourlyData: Array<{
    name: string;
    attempts: number;
    successful: number;
    failed: number;
  }>;
  geographicData: Array<{
    name: string;
    attempts: number;
    successRate: number;
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    status: string;
    country: string;
    timestamp: string;
    riskScore?: number;
  }>;
}

export const PaymentMonitoringTab: React.FC = () => {
  const [metrics, setMetrics] = useState<PaymentMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchPaymentMetrics = async () => {
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
        case '30d':
          startTime.setDate(now.getDate() - 30);
          break;
      }

      // Fetch payment audit logs
      const { data: paymentLogs, error } = await supabase
        .from('payment_audit_logs')
        .select('*')
        .gte('created_at', startTime.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data
      const totalAttempts = paymentLogs?.length || 0;
      const successfulPayments = paymentLogs?.filter(p => p.status === 'completed' || p.status === 'success')?.length || 0;
      const failedPayments = paymentLogs?.filter(p => p.status === 'failed' || p.status === 'error')?.length || 0;
      const successRate = totalAttempts > 0 ? (successfulPayments / totalAttempts) * 100 : 0;

      // Calculate average amount
      const totalAmount = paymentLogs?.reduce((sum, p) => {
        const amount = p.amount || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0) || 0;
      const averageAmount = totalAttempts > 0 ? totalAmount / totalAttempts : 0;

      // Group by hour for trend data
      const hourlyGroups = new Map<string, { attempts: number; successful: number; failed: number }>();
      paymentLogs?.forEach(log => {
        const hourKey = new Date(log.created_at).toISOString().slice(0, 13) + ':00:00';
        const existing = hourlyGroups.get(hourKey) || { attempts: 0, successful: 0, failed: 0 };
        existing.attempts++;
        if (log.status === 'completed' || log.status === 'success') existing.successful++;
        if (log.status === 'failed' || log.status === 'error') existing.failed++;
        hourlyGroups.set(hourKey, existing);
      });

      const hourlyData = Array.from(hourlyGroups.entries()).map(([hour, data]) => ({
        name: new Date(hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...data
      })).slice(-24); // Last 24 hours

      // Group by geography (simplified - using IP geolocation data if available)
      const geoGroups = new Map<string, { attempts: number; successful: number }>();
      paymentLogs?.forEach(log => {
        // Use geolocation_data if available, fallback to unknown
        const geoData = log.geolocation_data as any;
        const country = geoData?.country || 'Unknown';
        const existing = geoGroups.get(country) || { attempts: 0, successful: 0 };
        existing.attempts++;
        if (log.status === 'completed' || log.status === 'success') existing.successful++;
        geoGroups.set(country, existing);
      });

      const geographicData = Array.from(geoGroups.entries()).map(([country, data]) => ({
        name: country, // Changed from 'country' to 'name' for chart compatibility
        attempts: data.attempts,
        successRate: data.attempts > 0 ? (data.successful / data.attempts) * 100 : 0
      })).sort((a, b) => b.attempts - a.attempts).slice(0, 10);

      // Recent transactions
      const recentTransactions = (paymentLogs?.slice(0, 20) || []).map(log => {
        const geoData = log.geolocation_data as any;
        return {
          id: log.id,
          amount: log.amount || 0,
          status: log.status || 'unknown',
          country: geoData?.country || 'Unknown',
          timestamp: log.created_at,
          riskScore: undefined // Risk score would be calculated separately
        };
      });

      setMetrics({
        totalAttempts,
        successfulPayments,
        failedPayments,
        averageAmount,
        successRate,
        hourlyData,
        geographicData,
        recentTransactions
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching payment metrics:', error);
      toast.error('Failed to load payment metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMetrics();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('payment-monitoring')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payment_audit_logs'
      }, () => {
        fetchPaymentMetrics(); // Refresh on new payment events
      })
      .subscribe();

    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchPaymentMetrics, 120000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [timeRange]);

  const PaymentMetricsCards = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Attempts</p>
              <p className="text-2xl font-bold">{metrics?.totalAttempts.toLocaleString() || 0}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                {metrics?.successRate.toFixed(1) || 0}%
                <TrendingUp className="h-4 w-4 text-green-500" />
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Failed Attempts</p>
              <p className="text-2xl font-bold">{metrics?.failedPayments || 0}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Amount</p>
              <p className="text-2xl font-bold">${metrics?.averageAmount.toFixed(2) || '0.00'}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading && !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Payment Monitoring</h3>
          <div className="animate-pulse h-10 w-24 bg-muted rounded"></div>
        </div>
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
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Real-time Payment Monitoring</h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
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
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={fetchPaymentMetrics}
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
      <PaymentMetricsCards />

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Trends</CardTitle>
            <CardDescription>
              Payment attempts over time with success/failure breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsLineChart
              data={metrics?.hourlyData || []}
              height={300}
              series={[
                { key: 'attempts', name: 'Total Attempts', color: '#3b82f6' },
                { key: 'successful', name: 'Successful', color: '#10b981' },
                { key: 'failed', name: 'Failed', color: '#ef4444' }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>
              Payment attempts by country
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={metrics?.geographicData || []}
              height={300}
              series={[
                { key: 'attempts', name: 'Attempts', color: '#3b82f6' }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            Latest payment attempts with risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics?.recentTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.status === 'completed' || transaction.status === 'success' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.status === 'completed' || transaction.status === 'success' 
                      ? <CheckCircle className="h-4 w-4" />
                      : <AlertCircle className="h-4 w-4" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleTimeString()}
                      </p>
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{transaction.country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    transaction.status === 'completed' || transaction.status === 'success'
                      ? 'default' : 'destructive'
                  }>
                    {transaction.status}
                  </Badge>
                  {transaction.riskScore && (
                    <Badge variant={transaction.riskScore > 70 ? 'destructive' : 'secondary'}>
                      Risk: {transaction.riskScore}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};