
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Database, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  Server, 
  AlertTriangle,
  Gauge
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import { toast } from 'sonner';

// Sample cache data
const cacheItems = [
  { name: 'reward_analytics_all', last_updated: '2025-04-27T08:30:00', ttl_seconds: 300, is_invalidated: false, size_kb: 128 },
  { name: 'user_points_balance', last_updated: '2025-04-27T09:15:00', ttl_seconds: 600, is_invalidated: false, size_kb: 256 },
  { name: 'reward_leaderboard', last_updated: '2025-04-27T06:45:00', ttl_seconds: 900, is_invalidated: false, size_kb: 512 },
  { name: 'establishment_rewards', last_updated: '2025-04-27T07:20:00', ttl_seconds: 1200, is_invalidated: true, size_kb: 384 },
  { name: 'transaction_history', last_updated: '2025-04-27T05:10:00', ttl_seconds: 1800, is_invalidated: false, size_kb: 768 }
];

// Sample cache performance data
const cachePerformanceData = [
  { name: '00:00', hit_rate: 85, miss_rate: 15 },
  { name: '04:00', hit_rate: 88, miss_rate: 12 },
  { name: '08:00', hit_rate: 92, miss_rate: 8 },
  { name: '12:00', hit_rate: 78, miss_rate: 22 },
  { name: '16:00', hit_rate: 82, miss_rate: 18 },
  { name: '20:00', hit_rate: 90, miss_rate: 10 },
];

const responseTimeComparisonData = [
  { name: 'Points Lookup', cached: 12, uncached: 85 },
  { name: 'Rewards List', cached: 18, uncached: 125 },
  { name: 'User History', cached: 25, uncached: 210 },
  { name: 'Analytics', cached: 35, uncached: 345 },
  { name: 'Balance Check', cached: 8, uncached: 65 },
];

const CacheManagementTab = () => {
  const [refreshingCache, setRefreshingCache] = useState<string | null>(null);
  
  // This would be replaced with an actual query to get cache metrics
  const { data: cacheMetrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['cacheMetrics'],
    queryFn: async () => {
      // Mock API call
      return { 
        total_items: 5, 
        total_size_kb: 2048, 
        avg_hit_rate: 86.5, 
        avg_ttl_seconds: 960,
        memory_usage_percent: 42
      };
    }
  });

  const handleInvalidateCache = (cacheName: string) => {
    setRefreshingCache(cacheName);
    
    // Simulate cache invalidation
    setTimeout(() => {
      toast.success(`Cache "${cacheName}" has been successfully invalidated.`);
      setRefreshingCache(null);
    }, 1500);
  };

  const handleRefreshAllCaches = () => {
    setRefreshingCache('all');
    
    // Simulate refreshing all caches
    setTimeout(() => {
      toast.success("All caches have been successfully refreshed.");
      setRefreshingCache(null);
      refetchMetrics();
    }, 2500);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Cache Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <p>Loading cache metrics...</p>
            ) : cacheMetrics ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Items:</span>
                    <span className="font-medium">{cacheMetrics.total_items}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Size:</span>
                    <span className="font-medium">{cacheMetrics.total_size_kb.toLocaleString()} KB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Average Hit Rate:</span>
                    <span className="font-medium">{cacheMetrics.avg_hit_rate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Memory Usage:</span>
                    <span className="font-medium">{cacheMetrics.memory_usage_percent}%</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cache Health</span>
                    <span className={`text-sm font-medium ${cacheMetrics.avg_hit_rate > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {cacheMetrics.avg_hit_rate > 80 ? 'Optimal' : 'Needs Optimization'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p>No cache metrics available</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Cache Hit/Miss Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <AnalyticsBarChart
              title=""
              description=""
              data={cachePerformanceData}
              series={[
                { key: 'hit_rate', name: 'Hit Rate %', color: '#22c55e' },
                { key: 'miss_rate', name: 'Miss Rate %', color: '#ef4444' }
              ]}
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Response Time Comparison (Cached vs Uncached)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <AnalyticsBarChart
            title=""
            description=""
            data={responseTimeComparisonData}
            series={[
              { key: 'cached', name: 'Cached (ms)', color: '#22c55e' },
              { key: 'uncached', name: 'Uncached (ms)', color: '#3b82f6' }
            ]}
            height={300}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Cache Entries</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshAllCaches}
            disabled={refreshingCache !== null}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshingCache === 'all' ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Cache Key</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">TTL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {cacheItems.map((item) => (
                  <tr key={item.name} className={item.is_invalidated ? 'bg-red-50' : ''}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {formatTimeAgo(item.last_updated)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {Math.floor(item.ttl_seconds / 60)} min
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {item.size_kb} KB
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.is_invalidated ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Invalidated
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleInvalidateCache(item.name)}
                        disabled={refreshingCache !== null || item.is_invalidated}
                      >
                        {refreshingCache === item.name ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Invalidate'
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter>
          <Alert className="w-full">
            <Server className="h-4 w-4" />
            <AlertTitle>Cache Management</AlertTitle>
            <AlertDescription className="text-sm">
              Invalidating a cache will force the system to refetch fresh data on the next request. This can temporarily increase response times.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CacheManagementTab;
