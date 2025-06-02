
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FEATURES, featureRegistry } from '@/lib/features/registry';
import { getFeatureMetrics } from '@/lib/features/api';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import { Activity, AlertOctagon, CheckCircle, XCircle } from 'lucide-react';

const FeatureAccessMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data - in a real implementation, this would come from a backend API
  const mockData = [
    { name: 'Advanced Analytics', access_count: 245, user_count: 32, denied_count: 18 },
    { name: 'Bulk Messaging', access_count: 187, user_count: 24, denied_count: 45 },
    { name: 'Social Sharing', access_count: 421, user_count: 53, denied_count: 7 },
    { name: 'User Profiles', access_count: 612, user_count: 124, denied_count: 2 },
    { name: 'Dashboard', access_count: 943, user_count: 156, denied_count: 0 },
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch this data from the API
        // const data = await getFeatureAccessMetrics();
        setTimeout(() => {
          setMetrics(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching feature metrics:', err);
        setError('Failed to fetch feature metrics');
        toast({
          variant: 'destructive',
          title: 'Error loading metrics',
          description: 'Could not load feature access metrics.',
        });
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [toast]);

  const totalAccess = metrics.reduce((sum, item) => sum + item.access_count, 0);
  const totalDenied = metrics.reduce((sum, item) => sum + item.denied_count, 0);
  const totalUsers = metrics.reduce((sum, item) => sum + item.user_count, 0);

  const chartData = metrics.map(item => ({
    name: item.name,
    'Access Count': item.access_count,
    'Unique Users': item.user_count,
    'Access Denied': item.denied_count,
  }));

  const chartSeries = [
    { key: 'Access Count', name: 'Access Count', color: '#3B82F6' },
    { key: 'Unique Users', name: 'Unique Users', color: '#10B981' },
    { key: 'Access Denied', name: 'Access Denied', color: '#EF4444' },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-48">Loading feature metrics...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertOctagon className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsMetricCard 
          title="Total Feature Accesses" 
          value={totalAccess} 
          icon={Activity}
          iconColor="text-blue-500"
          change={8}
        />
        <AnalyticsMetricCard 
          title="Unique Users" 
          value={totalUsers} 
          icon={CheckCircle}
          iconColor="text-green-500"
          change={12}
        />
        <AnalyticsMetricCard 
          title="Access Denied Events" 
          value={totalDenied} 
          icon={XCircle}
          iconColor="text-red-500"
          change={-5}
        />
      </div>

      <AnalyticsBarChart
        title="Feature Access Metrics"
        description="Comparison of access metrics across different features"
        data={chartData}
        series={chartSeries}
        height={350}
      />
    </div>
  );
};

export default FeatureAccessMetrics;
