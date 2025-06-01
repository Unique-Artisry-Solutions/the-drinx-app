
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SystemHealthMetric } from '@/components/admin/rewards/system-overview/SystemHealthCard';
import { PerformanceTestCard } from '@/components/admin/rewards/system-overview/PerformanceTestCard';

const SystemOverviewTab = () => {
  // Mock system health data with proper typing
  const systemHealth: SystemHealthMetric[] = [
    {
      name: 'Database Performance',
      value: 95,
      status: 'healthy',
      description: 'Query response times within acceptable limits'
    },
    {
      name: 'Cache Hit Rate',
      value: 87,
      status: 'healthy', 
      description: 'Cache performance is optimal'
    },
    {
      name: 'Transaction Processing',
      value: 72,
      status: 'warning',
      description: 'Some delays in transaction processing'
    },
    {
      name: 'System Load',
      value: 45,
      status: 'healthy',
      description: 'Server resources are well utilized'
    }
  ];

  // Mock performance test data
  const mockPerformanceTests = [
    { name: 'Database Query', duration_ms: 45, status: 'success' },
    { name: 'Cache Access', duration_ms: 12, status: 'success' },
    { name: 'API Response', duration_ms: 120, status: 'warning' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing performance tests...');
  };

  const handleExport = () => {
    console.log('Exporting performance test results...');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemHealth.map((metric) => {
          // Ensure metric is not null or undefined
          const safeMetric: SystemHealthMetric = metric || {
            name: 'Unknown Metric',
            value: 0,
            status: 'unknown',
            description: 'No data available'
          };
          
          return (
            <Card key={safeMetric.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {safeMetric.name}
                  <Badge className={getStatusColor(safeMetric.status)}>
                    {safeMetric.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{safeMetric.value}%</div>
                <CardDescription className="text-xs mt-1">
                  {safeMetric.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Overall system health and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Uptime</span>
                <Badge className="bg-green-100 text-green-800">99.9%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Users</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Transactions Today</span>
                <span className="font-medium">3,892</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <PerformanceTestCard 
          performanceTest={mockPerformanceTests}
          isLoading={false}
          error={null}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default SystemOverviewTab;
