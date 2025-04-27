
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Database, RefreshCcw } from 'lucide-react';
import { RewardsCache } from '@/lib/rewards/system/RewardsCache';
import { useToast } from '@/hooks/use-toast';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';

// Sample cache data for visualization
const cacheStatusData = [
  { name: 'Valid', value: 75 },
  { name: 'Stale', value: 15 },
  { name: 'Empty', value: 10 },
];

const cacheSizeData = [
  { name: 'User Data', value: 45 },
  { name: 'Analytics', value: 25 },
  { name: 'Transactions', value: 20 },
  { name: 'Other', value: 10 },
];

// Cache entries for the table
const cacheEntries = [
  { key: 'reward_analytics_all', lastUpdated: '2 mins ago', status: 'Valid', ttl: '5 minutes' },
  { key: 'user_points_leaderboard', lastUpdated: '10 mins ago', status: 'Valid', ttl: '30 minutes' },
  { key: 'establishment_rewards_123', lastUpdated: '1 hour ago', status: 'Stale', ttl: '1 hour' },
  { key: 'daily_transactions', lastUpdated: '5 hours ago', status: 'Expired', ttl: '4 hours' },
  { key: 'reward_offerings_active', lastUpdated: '12 mins ago', status: 'Valid', ttl: '1 hour' },
];

const CacheManagementTab = () => {
  const { toast } = useToast();
  const [isInvalidating, setIsInvalidating] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);

  const handleInvalidateCache = async (key: string) => {
    setIsInvalidating(key);
    try {
      await RewardsCache.invalidateCache(key);
      toast({
        title: 'Cache invalidated',
        description: `Cache key "${key}" has been successfully invalidated`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error invalidating cache',
        description: 'There was a problem invalidating the cache',
        variant: 'destructive',
      });
      console.error('Error invalidating cache:', error);
    } finally {
      setIsInvalidating(null);
    }
  };

  const handleRefreshCache = async (key: string) => {
    setIsRefreshing(key);
    try {
      await RewardsCache.updateCache(key, 300); // 5 minute TTL
      toast({
        title: 'Cache refreshed',
        description: `Cache key "${key}" has been successfully refreshed`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error refreshing cache',
        description: 'There was a problem refreshing the cache',
        variant: 'destructive',
      });
      console.error('Error refreshing cache:', error);
    } finally {
      setIsRefreshing(null);
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'valid':
        return 'text-green-500';
      case 'stale':
        return 'text-yellow-500';
      case 'expired':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsPieChart
          title="Cache Status"
          description="Current state of cache entries"
          data={cacheStatusData}
          colors={['#22c55e', '#f59e0b', '#94a3b8']}
        />

        <AnalyticsPieChart
          title="Cache Size Distribution"
          description="Memory usage by cache category"
          data={cacheSizeData}
          colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#94a3b8']}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Entries
          </CardTitle>
          <CardDescription>
            Manage and monitor reward system cache entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="grid grid-cols-5 p-4 font-medium">
              <div>Cache Key</div>
              <div>Last Updated</div>
              <div>Status</div>
              <div>TTL</div>
              <div className="text-right">Actions</div>
            </div>
            <Separator />
            {cacheEntries.map((entry, index) => (
              <div key={entry.key}>
                <div className="grid grid-cols-5 p-4 items-center">
                  <div className="font-mono text-sm">{entry.key}</div>
                  <div>{entry.lastUpdated}</div>
                  <div className={getStatusColorClass(entry.status)}>{entry.status}</div>
                  <div>{entry.ttl}</div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleInvalidateCache(entry.key)}
                      disabled={isInvalidating === entry.key}
                    >
                      {isInvalidating === entry.key ? 'Invalidating...' : 'Invalidate'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRefreshCache(entry.key)}
                      disabled={isRefreshing === entry.key}
                      className="flex items-center gap-1"
                    >
                      <RefreshCcw className="h-3 w-3" />
                      {isRefreshing === entry.key ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </div>
                </div>
                {index < cacheEntries.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Clear All</Button>
          <Button>Refresh All</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CacheManagementTab;
