
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, BarChart2, LineChart, PieChart } from 'lucide-react';
import { getFeatureMetrics } from '@/lib/features/api';
import { FEATURES, featureRegistry, featuresByTier } from '@/lib/features/registry';

interface FeatureMetric {
  feature_id: string;
  event_type: string;
  count: number;
  feature_name?: string;
}

interface FeatureUsageSummary {
  feature_id: string;
  feature_name: string;
  total_usage: number;
  view_count: number;
  use_count: number;
  upgrade_prompt_count: number;
  other_events: number;
  tier: string;
}

interface TierUsageSummary {
  tier: string;
  total_usage: number;
  feature_count: number;
  average_usage_per_feature: number;
}

const FeatureAnalyticsTab: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<FeatureMetric[]>([]);
  const [featureSummaries, setFeatureSummaries] = useState<FeatureUsageSummary[]>([]);
  const [tierSummaries, setTierSummaries] = useState<TierUsageSummary[]>([]);
  const [timeRange, setTimeRange] = useState('30days');
  const [sortBy, setSortBy] = useState('usage');
  const [selectedTier, setSelectedTier] = useState('all');

  const loadFeatureMetrics = async () => {
    setIsLoading(true);
    try {
      // This would typically call an API to get metrics for all features
      // For this demo, we'll create some sample data
      const sampleMetrics: FeatureMetric[] = [];
      
      // Generate sample data for each feature in the registry
      Object.values(FEATURES).forEach(featureId => {
        const feature = featureRegistry[featureId];
        if (!feature) return;
        
        // Determine which tier this feature belongs to
        let tier = 'free';
        for (const [currentTier, features] of Object.entries(featuresByTier)) {
          if (features.includes(featureId)) {
            tier = currentTier;
            break;
          }
        }
        
        // Generate view events
        const viewCount = Math.floor(Math.random() * 500) + 50;
        sampleMetrics.push({
          feature_id: featureId,
          event_type: 'view',
          count: viewCount,
          feature_name: feature.name
        });
        
        // Generate use events
        const useCount = Math.floor(Math.random() * viewCount);
        sampleMetrics.push({
          feature_id: featureId,
          event_type: 'use',
          count: useCount,
          feature_name: feature.name
        });
        
        // Generate upgrade_prompt_click events for premium features
        if (tier !== 'free') {
          const upgradeCount = Math.floor(Math.random() * 100);
          sampleMetrics.push({
            feature_id: featureId,
            event_type: 'upgrade_prompt_click',
            count: upgradeCount,
            feature_name: feature.name
          });
        }
      });
      
      setMetrics(sampleMetrics);
      
      // Process data for feature summaries
      const summaries: Record<string, FeatureUsageSummary> = {};
      
      sampleMetrics.forEach(metric => {
        const feature = featureRegistry[metric.feature_id];
        if (!feature) return;
        
        // Determine which tier this feature belongs to
        let tier = 'free';
        for (const [currentTier, features] of Object.entries(featuresByTier)) {
          if (features.includes(metric.feature_id)) {
            tier = currentTier;
            break;
          }
        }
        
        if (!summaries[metric.feature_id]) {
          summaries[metric.feature_id] = {
            feature_id: metric.feature_id,
            feature_name: feature.name,
            total_usage: 0,
            view_count: 0,
            use_count: 0,
            upgrade_prompt_count: 0,
            other_events: 0,
            tier
          };
        }
        
        const summary = summaries[metric.feature_id];
        summary.total_usage += metric.count;
        
        switch (metric.event_type) {
          case 'view':
            summary.view_count += metric.count;
            break;
          case 'use':
            summary.use_count += metric.count;
            break;
          case 'upgrade_prompt_click':
            summary.upgrade_prompt_count += metric.count;
            break;
          default:
            summary.other_events += metric.count;
        }
      });
      
      setFeatureSummaries(Object.values(summaries));
      
      // Process data for tier summaries
      const tierData: Record<string, TierUsageSummary> = {
        free: { tier: 'free', total_usage: 0, feature_count: 0, average_usage_per_feature: 0 },
        basic: { tier: 'basic', total_usage: 0, feature_count: 0, average_usage_per_feature: 0 },
        premium: { tier: 'premium', total_usage: 0, feature_count: 0, average_usage_per_feature: 0 },
        vip: { tier: 'vip', total_usage: 0, feature_count: 0, average_usage_per_feature: 0 },
      };
      
      Object.values(summaries).forEach(summary => {
        const tierSummary = tierData[summary.tier];
        if (tierSummary) {
          tierSummary.total_usage += summary.total_usage;
          tierSummary.feature_count += 1;
        }
      });
      
      // Calculate averages
      Object.values(tierData).forEach(tier => {
        tier.average_usage_per_feature = tier.feature_count > 0 
          ? tier.total_usage / tier.feature_count 
          : 0;
      });
      
      setTierSummaries(Object.values(tierData));
      
    } catch (error) {
      console.error("Error loading feature metrics:", error);
      toast({
        title: "Error",
        description: "Failed to load feature metrics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadFeatureMetrics();
  }, [timeRange]);
  
  // Filter and sort feature summaries
  const getFilteredAndSortedFeatures = () => {
    let filtered = [...featureSummaries];
    
    // Filter by tier if needed
    if (selectedTier !== 'all') {
      filtered = filtered.filter(summary => summary.tier === selectedTier);
    }
    
    // Sort based on selected criteria
    switch (sortBy) {
      case 'usage':
        filtered.sort((a, b) => b.total_usage - a.total_usage);
        break;
      case 'views':
        filtered.sort((a, b) => b.view_count - a.view_count);
        break;
      case 'name':
        filtered.sort((a, b) => a.feature_name.localeCompare(b.feature_name));
        break;
      case 'tier':
        filtered.sort((a, b) => a.tier.localeCompare(b.tier));
        break;
    }
    
    return filtered;
  };
  
  const filteredFeatures = getFilteredAndSortedFeatures();
  
  // Calculate the most popular and least used features
  const mostPopularFeature = featureSummaries.length > 0 
    ? featureSummaries.reduce((prev, current) => 
        (prev.total_usage > current.total_usage) ? prev : current
      ) 
    : null;
    
  const leastUsedFeature = featureSummaries.length > 0 
    ? featureSummaries.reduce((prev, current) => 
        (prev.total_usage < current.total_usage) ? prev : current
      ) 
    : null;
  
  const exportCsv = () => {
    // Prepare CSV content
    const headers = ['Feature ID', 'Feature Name', 'Total Usage', 'Views', 'Uses', 'Upgrade Prompts', 'Other Events', 'Tier'];
    const rows = filteredFeatures.map(feature => [
      feature.feature_id,
      feature.feature_name,
      feature.total_usage,
      feature.view_count,
      feature.use_count,
      feature.upgrade_prompt_count,
      feature.other_events,
      feature.tier
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `feature-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Feature Analytics</CardTitle>
            <CardDescription>Track feature usage and performance across subscription tiers</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="loader">Loading analytics data...</div>
          </div>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tiers">Tiers</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Total Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{featureSummaries.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Total Usage Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {featureSummaries.reduce((acc, feature) => acc + feature.total_usage, 0).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Most Popular</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium">{mostPopularFeature?.feature_name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">
                      {mostPopularFeature?.total_usage.toLocaleString() || 0} events
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Least Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium">{leastUsedFeature?.feature_name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">
                      {leastUsedFeature?.total_usage.toLocaleString() || 0} events
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Features by Usage</CardTitle>
                    <CardDescription>Most frequently used features</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={featureSummaries.sort((a, b) => b.total_usage - a.total_usage).slice(0, 5)}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="feature_name" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="total_usage" name="Total Usage" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Usage by Subscription Tier</CardTitle>
                    <CardDescription>Feature usage distribution across tiers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={tierSummaries}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="tier" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="total_usage" name="Total Usage" fill="#82ca9d" />
                          <Bar dataKey="feature_count" name="Feature Count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="features">
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search features..."
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usage">Usage (high to low)</SelectItem>
                      <SelectItem value="views">Views (high to low)</SelectItem>
                      <SelectItem value="name">Name (A to Z)</SelectItem>
                      <SelectItem value="tier">Tier</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature</th>
                      <th className="text-left p-2">Tier</th>
                      <th className="text-right p-2">Total Usage</th>
                      <th className="text-right p-2">Views</th>
                      <th className="text-right p-2">Uses</th>
                      <th className="text-right p-2">Upgrade Prompts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeatures.map((feature) => (
                      <tr key={feature.feature_id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{feature.feature_name}</td>
                        <td className="p-2 capitalize">{feature.tier}</td>
                        <td className="p-2 text-right">{feature.total_usage.toLocaleString()}</td>
                        <td className="p-2 text-right">{feature.view_count.toLocaleString()}</td>
                        <td className="p-2 text-right">{feature.use_count.toLocaleString()}</td>
                        <td className="p-2 text-right">{feature.upgrade_prompt_count.toLocaleString()}</td>
                      </tr>
                    ))}
                    
                    {filteredFeatures.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-muted-foreground">
                          No feature data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="tiers">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {tierSummaries.map((tier) => (
                  <Card key={tier.tier} className={`
                    ${tier.tier === 'free' ? 'border-gray-300' : ''}
                    ${tier.tier === 'basic' ? 'border-blue-300' : ''}
                    ${tier.tier === 'premium' ? 'border-purple-300' : ''}
                    ${tier.tier === 'vip' ? 'border-amber-300' : ''}
                  `}>
                    <CardHeader>
                      <CardTitle className="capitalize">{tier.tier} Tier</CardTitle>
                      <CardDescription>
                        {tier.feature_count} features available
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Total Usage</div>
                          <div className="text-2xl font-bold">{tier.total_usage.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Avg Usage per Feature</div>
                          <div className="text-2xl font-bold">{Math.round(tier.average_usage_per_feature).toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="text-sm font-medium mb-2">Top Features</div>
                        <ul className="space-y-1">
                          {filteredFeatures
                            .filter(feature => feature.tier === tier.tier)
                            .sort((a, b) => b.total_usage - a.total_usage)
                            .slice(0, 3)
                            .map(feature => (
                              <li key={feature.feature_id} className="flex justify-between items-center text-sm">
                                <span>{feature.feature_name}</span>
                                <span className="text-muted-foreground">{feature.total_usage.toLocaleString()} events</span>
                              </li>
                            ))
                          }
                          
                          {filteredFeatures.filter(feature => feature.tier === tier.tier).length === 0 && (
                            <li className="text-sm text-muted-foreground">No features in this tier</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="charts">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Usage by Feature</CardTitle>
                        <CardDescription>Comparing views and actual usage</CardDescription>
                      </div>
                      <BarChart2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={filteredFeatures.sort((a, b) => b.total_usage - a.total_usage).slice(0, 10)}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="feature_name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={70}
                            interval={0}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="view_count" name="Views" fill="#8884d8" />
                          <Bar dataKey="use_count" name="Uses" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Tier Distribution</CardTitle>
                        <CardDescription>Feature usage across different tiers</CardDescription>
                      </div>
                      <PieChart className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Free', views: tierSummaries.find(t => t.tier === 'free')?.total_usage || 0 },
                            { name: 'Basic', views: tierSummaries.find(t => t.tier === 'basic')?.total_usage || 0 },
                            { name: 'Premium', views: tierSummaries.find(t => t.tier === 'premium')?.total_usage || 0 },
                            { name: 'VIP', views: tierSummaries.find(t => t.tier === 'vip')?.total_usage || 0 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar 
                            dataKey="views" 
                            name="Usage Events" 
                            fill="#8884d8" 
                            label={{ position: 'top' }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureAnalyticsTab;
