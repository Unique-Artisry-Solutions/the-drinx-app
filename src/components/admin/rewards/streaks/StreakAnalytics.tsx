
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface StreakMetrics {
  total_streaks: number;
  avg_current_streak_length: number;
  max_streak_length: number;
  streaks_3_plus: number;
  streaks_7_plus: number;
  streaks_30_plus: number;
  streak_type: string;
}

export function StreakAnalytics() {
  const [metrics, setMetrics] = useState<StreakMetrics[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchStreakMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('streak_performance')
        .select('*');

      if (error) {
        console.error('Error fetching streak metrics:', error);
        return;
      }

      if (data) {
        // Transform data to handle null values properly
        const transformedData: StreakMetrics[] = data.map(item => ({
          total_streaks: item.total_streaks || 0,
          avg_current_streak_length: item.avg_current_streak_length || 0,
          max_streak_length: item.max_streak_length || 0,
          streaks_3_plus: item.streaks_3_plus || 0,
          streaks_7_plus: item.streaks_7_plus || 0,
          streaks_30_plus: item.streaks_30_plus || 0,
          streak_type: item.streak_type || 'unknown'
        }));
        
        setMetrics(transformedData);
        
        // Set selected type safely
        if (data.length > 0 && data[0].streak_type) {
          setSelectedType(data[0].streak_type);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakMetrics();
  }, []);

  const currentMetrics = selectedType === 'all' 
    ? metrics.reduce((acc, curr) => ({
        total_streaks: acc.total_streaks + curr.total_streaks,
        avg_current_streak_length: (acc.avg_current_streak_length + curr.avg_current_streak_length) / 2,
        max_streak_length: Math.max(acc.max_streak_length, curr.max_streak_length),
        streaks_3_plus: acc.streaks_3_plus + curr.streaks_3_plus,
        streaks_7_plus: acc.streaks_7_plus + curr.streaks_7_plus,
        streaks_30_plus: acc.streaks_30_plus + curr.streaks_30_plus,
        streak_type: 'all'
      }), {
        total_streaks: 0,
        avg_current_streak_length: 0,
        max_streak_length: 0,
        streaks_3_plus: 0,
        streaks_7_plus: 0,
        streaks_30_plus: 0,
        streak_type: 'all'
      })
    : metrics.find(m => m.streak_type === selectedType);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Streak Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Streak Analytics</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchStreakMetrics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Streak Type Selector */}
            <div className="flex gap-2 flex-wrap">
              <Badge 
                variant={selectedType === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedType('all')}
              >
                All Types
              </Badge>
              {Array.from(new Set(metrics.map(m => m.streak_type))).map((type) => (
                <Badge
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>

            {/* Metrics Display */}
            {currentMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{currentMetrics.total_streaks}</div>
                    <div className="text-sm text-muted-foreground">Total Streaks</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{currentMetrics.avg_current_streak_length.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Avg Length</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{currentMetrics.max_streak_length}</div>
                    <div className="text-sm text-muted-foreground">Max Length</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{currentMetrics.streaks_3_plus}</div>
                    <div className="text-sm text-muted-foreground">3+ Days</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{currentMetrics.streaks_7_plus}</div>
                    <div className="text-sm text-muted-foreground">7+ Days</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{currentMetrics.streaks_30_plus}</div>
                    <div className="text-sm text-muted-foreground">30+ Days</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Breakdown by Type */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Breakdown by Streak Type</h4>
              <div className="space-y-2">
                {metrics.map((metric, index) => {
                  const _entry = metric; // Keep variable to avoid TS6133 error
                  return (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div className="font-medium">{metric.streak_type}</div>
                      <div className="text-right">
                        <div className="font-bold">{metric.total_streaks} streaks</div>
                        <div className="text-sm text-muted-foreground">
                          Avg: {metric.avg_current_streak_length.toFixed(1)} days
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Performance Indicators</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.map((metric, index) => {
                  const _entry = metric; // Keep variable to avoid TS6133 error
                  const retentionRate = metric.total_streaks > 0 ? (metric.streaks_7_plus / metric.total_streaks) * 100 : 0;
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium mb-2">{metric.streak_type}</div>
                        <div className="text-2xl font-bold">{retentionRate.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">7+ Day Retention</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StreakAnalytics;
