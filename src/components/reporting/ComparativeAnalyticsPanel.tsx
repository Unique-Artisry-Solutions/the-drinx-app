
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import type { ComparativeAnalysis } from '@/services/reportingService';

interface ComparativeAnalyticsPanelProps {
  analysis: ComparativeAnalysis | null;
  onGenerateComparison: (eventIds: string[]) => Promise<void>;
  isGenerating: boolean;
}

const ComparativeAnalyticsPanel: React.FC<ComparativeAnalyticsPanelProps> = ({
  analysis,
  onGenerateComparison,
  isGenerating
}) => {
  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparative Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparative Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Comparative Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Compare multiple events to identify trends and performance patterns
            </p>
            <Button 
              onClick={() => onGenerateComparison(['event-1', 'event-2'])}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Generate Sample Comparison
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Comparative Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Compare performance across multiple events
          </p>
        </div>
        <Button 
          onClick={() => onGenerateComparison(['event-1', 'event-2'])}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          New Comparison
        </Button>
      </div>

      {/* Comparison Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Comparison</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {analysis.comparedEvents.length} events compared
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-800">Best Attendance</div>
              <div className="text-xl font-bold text-blue-900">
                {analysis.insights.bestPerforming.attendance?.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">
                {analysis.insights.bestPerforming.eventName}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-800">Highest Revenue</div>
              <div className="text-xl font-bold text-green-900">
                ${analysis.insights.bestPerforming.revenue?.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">
                {analysis.insights.bestPerforming.eventName}
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-800">Best Conversion</div>
              <div className="text-xl font-bold text-purple-900">
                {analysis.insights.bestPerforming.conversionRate?.toFixed(1)}%
              </div>
              <div className="text-sm text-purple-600">
                {analysis.insights.bestPerforming.eventName}
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="space-y-3">
            <h4 className="font-medium">Key Insights</h4>
            
            <div className="space-y-2">
              {analysis.insights.trends.map((trend, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {trend.direction === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{trend.metric}</div>
                    <div className="text-sm text-muted-foreground">{trend.description}</div>
                  </div>
                  <Badge variant={trend.direction === 'up' ? 'default' : 'destructive'}>
                    {trend.change}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparativeAnalyticsPanel;
