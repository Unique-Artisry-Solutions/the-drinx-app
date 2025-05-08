
import React, { useState, useEffect } from 'react';
import { SettingsTabProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { FeatureId, FEATURES, featureRegistry } from '@/lib/features/registry';
import { getFeatureMetrics } from '@/lib/features/api';

// Sample data structure for metrics
interface FeatureMetric {
  id: string;
  feature_id: string;
  user_id: string;
  event_type: string;
  event_data: any;
  created_at: string;
}

// For visualization purposes
interface UsageDataPoint {
  date: string;
  count: number;
}

interface TierUsageData {
  tier: string;
  usage: number;
}

const FeatureAnalyticsTab: React.FC<SettingsTabProps> = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<FeatureMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usageData, setUsageData] = useState<UsageDataPoint[]>([]);
  const [tierUsageData, setTierUsageData] = useState<TierUsageData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFeature) {
      fetchFeatureMetrics(selectedFeature);
    }
  }, [selectedFeature]);

  // Helper function to safely check if a feature ID is a valid FeatureId
  const isValidFeatureId = (id: string | null): id is FeatureId => {
    if (!id) return false;
    return Object.values(FEATURES).includes(id as any);
  };

  const fetchFeatureMetrics = async (featureId: string) => {
    setIsLoading(true);
    try {
      // Validate the feature ID
      if (!isValidFeatureId(featureId)) {
        throw new Error('Invalid feature ID');
      }
      
      const data = await getFeatureMetrics(featureId);
      setMetrics(data || []);
      
      // Process data for charts
      processMetricsForCharts(data || []);
    } catch (error) {
      console.error('Error fetching feature metrics:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load metrics',
        description: 'Could not load feature usage data',
      });
      setMetrics([]);
      setUsageData([]);
      setTierUsageData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const processMetricsForCharts = (data: FeatureMetric[]) => {
    // Process for time-based usage
    const usageByDate = new Map<string, number>();
    const usageByTier = new Map<string, number>();
    
    // Group by date for time series
    data.forEach(metric => {
      const date = new Date(metric.created_at).toISOString().split('T')[0];
      usageByDate.set(date, (usageByDate.get(date) || 0) + 1);
      
      // Extract tier from event data if available
      const tier = metric.event_data?.tier || 'unknown';
      usageByTier.set(tier, (usageByTier.get(tier) || 0) + 1);
    });
    
    // Convert to chart format - time series
    const timeSeriesData = Array.from(usageByDate.entries()).map(([date, count]) => ({
      date,
      count
    }));

    // Convert to chart format - tier usage
    const tierData = Array.from(usageByTier.entries()).map(([tier, usage]) => ({
      tier,
      usage
    }));
    
    setUsageData(timeSeriesData);
    setTierUsageData(tierData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Analytics</CardTitle>
        <CardDescription>Track feature usage and adoption across subscription tiers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="feature-select" className="text-sm font-medium">Select Feature</label>
            <Select 
              value={selectedFeature || ''} 
              onValueChange={(value) => setSelectedFeature(value)}
            >
              <SelectTrigger id="feature-select" className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a feature to analyze" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FEATURES).map(([key, id]) => (
                  <SelectItem key={id} value={id}>
                    {featureRegistry[id]?.name || key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Loading feature metrics...</div>
          ) : !selectedFeature ? (
            <div className="py-12 text-center text-muted-foreground">
              Select a feature to view usage analytics
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Usage Over Time</h3>
                <div className="h-[300px] w-full">
                  {usageData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={usageData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          name="Usage Count"
                          stroke="#8884d8" 
                          fill="#8884d8" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full border rounded-md bg-muted/20">
                      <p className="text-muted-foreground">No usage data available</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Usage By Subscription Tier</h3>
                <div className="h-[300px] w-full">
                  {tierUsageData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={tierUsageData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tier" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="usage" 
                          name="Feature Usage"
                          fill="#82ca9d" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full border rounded-md bg-muted/20">
                      <p className="text-muted-foreground">No tier-specific usage data available</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                {metrics.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Date</th>
                          <th className="p-2 text-left font-medium">Event Type</th>
                          <th className="p-2 text-left font-medium">User ID</th>
                          <th className="p-2 text-left font-medium">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.slice(0, 10).map((metric) => (
                          <tr key={metric.id} className="border-b">
                            <td className="p-2">
                              {new Date(metric.created_at).toLocaleString()}
                            </td>
                            <td className="p-2">{metric.event_type}</td>
                            <td className="p-2">{metric.user_id.substring(0, 8)}...</td>
                            <td className="p-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">No recent activity for this feature</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureAnalyticsTab;
