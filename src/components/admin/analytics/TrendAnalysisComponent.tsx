
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

interface TrendAnalysisComponentProps {
  eventId?: string;
}

const TrendAnalysisComponent: React.FC<TrendAnalysisComponentProps> = ({
  eventId
}) => {
  const { timeFrameData, chartData, isLoading, error } = useRealTimeAnalytics(eventId);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatChange = (change: number) => {
    const absChange = Math.abs(change);
    const sign = change >= 0 ? '+' : '';
    return `${sign}${absChange.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading trend analysis...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">Error loading trend data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
          <CardDescription>
            Performance trends and comparative analysis over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {timeFrameData.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.label}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.value.toLocaleString()}
                </div>
                <div className={`text-sm ${getTrendColor(metric.trend)}`}>
                  {formatChange(metric.change)} vs previous period
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity Trends</CardTitle>
          <CardDescription>
            Daily activity patterns over the past month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="space-y-4">
              <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium">Activity Chart</p>
                  <p className="text-sm text-gray-500">
                    {chartData.length} data points from {chartData[0]?.date} to {chartData[chartData.length - 1]?.date}
                  </p>
                </div>
              </div>
              
              {/* Summary stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {Math.max(...chartData.map(d => d.value))}
                  </div>
                  <div className="text-xs text-gray-500">Peak Activity</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {Math.min(...chartData.map(d => d.value))}
                  </div>
                  <div className="text-xs text-gray-500">Lowest Activity</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {Math.round(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length)}
                  </div>
                  <div className="text-xs text-gray-500">Daily Average</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {chartData.reduce((sum, d) => sum + d.value, 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total Activity</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No trend data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key insights and recommendations based on current trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeFrameData.map((metric, index) => {
              let insight = '';
              let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';

              if (metric.trend === 'up' && metric.change > 10) {
                insight = `${metric.label} showing strong growth (+${metric.change.toFixed(1)}%)`;
                badgeVariant = 'default';
              } else if (metric.trend === 'down' && metric.change < -10) {
                insight = `${metric.label} needs attention (${metric.change.toFixed(1)}% decline)`;
                badgeVariant = 'destructive';
              } else if (metric.trend === 'stable') {
                insight = `${metric.label} is stable with minimal change`;
                badgeVariant = 'secondary';
              } else if (metric.trend === 'up') {
                insight = `${metric.label} showing modest improvement (+${metric.change.toFixed(1)}%)`;
                badgeVariant = 'outline';
              } else {
                insight = `${metric.label} showing slight decline (${metric.change.toFixed(1)}%)`;
                badgeVariant = 'outline';
              }

              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{insight}</span>
                  <Badge variant={badgeVariant}>
                    {metric.trend === 'up' ? 'Positive' : metric.trend === 'down' ? 'Negative' : 'Stable'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysisComponent;
