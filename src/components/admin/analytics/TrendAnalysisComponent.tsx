
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendAnalysisComponentProps {
  className?: string;
}

const TrendAnalysisComponent: React.FC<TrendAnalysisComponentProps> = ({ 
  className = '' 
}) => {
  const { trendData, chartData, isLoading, error } = useRealTimeAnalytics();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center">Loading trend analysis...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center text-red-500">Error loading trends: {error}</div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
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
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Trend Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendData.map((trend) => (
          <Card key={trend.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {trend.label}
                </div>
                {getTrendIcon(trend.trend)}
              </div>
              <div className="text-2xl font-bold mb-1">
                {typeof trend.value === 'number' 
                  ? trend.value.toLocaleString() 
                  : trend.value}
              </div>
              <div className={`text-xs flex items-center gap-1 ${getTrendColor(trend.trend)}`}>
                {trend.change > 0 ? '+' : ''}{trend.change}%
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsLineChart
            data={chartData}
            height={300}
            series={[
              { key: 'value', name: 'Trend Value', color: '#3B82F6' },
              { key: 'clicks', name: 'Clicks', color: '#10B981' },
              { key: 'conversions', name: 'Conversions', color: '#F59E0B' }
            ]}
          />
        </CardContent>
      </Card>

      {/* Trend Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Positive Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendData
                .filter(trend => trend.trend === 'up' && trend.change > 0)
                .map((trend) => (
                  <div key={`positive-${trend.label}`} className="flex items-center justify-between">
                    <span className="text-sm">{trend.label}</span>
                    <Badge variant="outline" className="text-green-600">
                      +{trend.change}%
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendData
                .filter(trend => trend.trend === 'down' && trend.change < 0)
                .map((trend) => (
                  <div key={`negative-${trend.label}`} className="flex items-center justify-between">
                    <span className="text-sm">{trend.label}</span>
                    <Badge variant="outline" className="text-red-600">
                      {trend.change}%
                    </Badge>
                  </div>
                ))}
              {trendData.filter(trend => trend.trend === 'stable').map((trend) => (
                <div key={`stable-${trend.label}`} className="flex items-center justify-between">
                  <span className="text-sm">{trend.label}</span>
                  <Badge variant="outline" className="text-gray-600">
                    {trend.change >= 0 ? '+' : ''}{trend.change}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {trendData.filter(trend => trend.trend === 'up').length}
              </div>
              <div className="text-sm text-muted-foreground">Improving Metrics</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {trendData.filter(trend => trend.trend === 'down').length}
              </div>
              <div className="text-sm text-muted-foreground">Declining Metrics</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {trendData.filter(trend => trend.trend === 'stable').length}
              </div>
              <div className="text-sm text-muted-foreground">Stable Metrics</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysisComponent;
