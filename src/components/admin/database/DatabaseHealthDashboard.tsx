
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import { Activity, Database, Search, GitMerge } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DatabaseHealthDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['databasePerformance'],
    queryFn: async () => {
      const { data: results } = await supabase.rpc('test_reward_system_performance');
      return results;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4">Database Health Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Overview Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Health
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Good</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>

        {/* Query Performance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Query Response Time
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45ms</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>

        {/* Active Connections Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Connections
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Current active sessions
            </p>
          </CardContent>
        </Card>

        {/* Index Health Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Index Health
            </CardTitle>
            <GitMerge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Index efficiency score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Query Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Query Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <AnalyticsLineChart
            title=""
            data={[
              { name: '00:00', time: '00:00', response: 42 },
              { name: '04:00', time: '04:00', response: 38 },
              { name: '08:00', time: '08:00', response: 45 },
              { name: '12:00', time: '12:00', response: 52 },
              { name: '16:00', time: '16:00', response: 48 },
              { name: '20:00', time: '20:00', response: 44 }
            ]}
            series={[
              { key: 'response', name: 'Response Time (ms)', color: '#8884d8' }
            ]}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Index Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Index Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <AnalyticsBarChart
            title=""
            data={[
              { name: 'users_pkey', scans: 1250, size: 45 },
              { name: 'rewards_user_id_idx', scans: 850, size: 32 },
              { name: 'transactions_date_idx', scans: 2100, size: 68 },
              { name: 'profiles_email_idx', scans: 950, size: 28 }
            ]}
            series={[
              { key: 'scans', name: 'Index Scans', color: '#82ca9d' },
              { key: 'size', name: 'Size (MB)', color: '#8884d8' }
            ]}
            height={300}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseHealthDashboard;
