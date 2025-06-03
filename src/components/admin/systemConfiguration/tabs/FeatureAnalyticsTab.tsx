
import React, { useState, useEffect } from 'react';
import { SettingsTabProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FeatureId, FEATURES, featureRegistry } from '@/lib/features/registry';

// Sample data structure for feature usage stats
interface FeatureUsageStats {
  featureId: string;
  usageCount: number;
  lastUsed: string;
  tierDistribution: {
    [tier: string]: number;
  };
}

const FeatureAnalyticsTab: React.FC<SettingsTabProps> = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<FeatureUsageStats | null>(null);
  const { toast } = useToast();

  // Load feature usage stats when a feature is selected
  useEffect(() => {
    if (selectedFeature) {
      fetchFeatureUsageStats(selectedFeature);
    }
  }, [selectedFeature]);

  const fetchFeatureUsageStats = async (featureId: FeatureId) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with an actual API call in a real implementation
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockStats: FeatureUsageStats = {
        featureId,
        usageCount: Math.floor(Math.random() * 1000),
        lastUsed: new Date().toISOString(),
        tierDistribution: {
          free: Math.floor(Math.random() * 100),
          basic: Math.floor(Math.random() * 100),
          premium: Math.floor(Math.random() * 100),
          vip: Math.floor(Math.random() * 100),
        }
      };
      
      setUsageStats(mockStats);
    } catch (error) {
      console.error('Error fetching feature usage stats:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load stats',
        description: 'Could not load feature usage statistics',
      });
      setUsageStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Analytics</CardTitle>
        <CardDescription>Track feature usage across different subscription tiers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="feature-select" className="text-sm font-medium">Select Feature</label>
            <Select 
              value={selectedFeature || ''} 
              onValueChange={(value) => setSelectedFeature(value as FeatureId)}
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
            <div className="py-12 text-center text-muted-foreground">Loading feature analytics...</div>
          ) : !selectedFeature ? (
            <div className="py-12 text-center text-muted-foreground">
              Select a feature to view usage analytics
            </div>
          ) : usageStats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{usageStats.usageCount}</div>
                    <p className="text-sm text-muted-foreground">Total Usage Count</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {new Date(usageStats.lastUsed).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Last Used</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {Math.max(...Object.values(usageStats.tierDistribution))}
                    </div>
                    <p className="text-sm text-muted-foreground">Peak Usage</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tier Distribution</CardTitle>
                  <CardDescription>Feature usage breakdown by subscription tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(usageStats.tierDistribution).map(([tier, count]) => (
                      <div key={tier} className="flex items-center justify-between">
                        <span className="capitalize">{tier}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-64 h-4 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ 
                                width: `${(count / usageStats.usageCount) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button
                  onClick={() => fetchFeatureUsageStats(selectedFeature)}
                  disabled={isLoading}
                >
                  Refresh Analytics
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No analytics data available for this feature
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureAnalyticsTab;
