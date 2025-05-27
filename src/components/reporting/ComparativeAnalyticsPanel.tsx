
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';
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
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const mockEvents = [
    { id: 'event-1', name: 'Summer Music Festival 2024', date: '2024-07-15' },
    { id: 'event-2', name: 'Tech Conference Downtown', date: '2024-06-22' },
    { id: 'event-3', name: 'Food & Wine Tasting', date: '2024-05-18' },
    { id: 'event-4', name: 'Comedy Night Special', date: '2024-04-30' },
    { id: 'event-5', name: 'Art Gallery Opening', date: '2024-03-12' }
  ];

  const handleEventSelection = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents(prev => [...prev, eventId]);
    } else {
      setSelectedEvents(prev => prev.filter(id => id !== eventId));
    }
  };

  const handleGenerateComparison = () => {
    if (selectedEvents.length >= 2) {
      onGenerateComparison(selectedEvents);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    return change > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-gray-600';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Event Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Compare Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Select 2 or more events to compare their performance metrics
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {mockEvents.map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={event.id}
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={(checked) => handleEventSelection(event.id, !!checked)}
                  />
                  <div className="flex-1">
                    <label htmlFor={event.id} className="text-sm font-medium cursor-pointer">
                      {event.name}
                    </label>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleGenerateComparison}
              disabled={selectedEvents.length < 2 || isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating Comparison...' : `Compare ${selectedEvents.length} Events`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparative Results */}
      {analysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparative Analysis Results</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generated on {new Date(analysis.generatedAt).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              {/* Events Overview */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Events Compared</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.events.map(event => (
                    <Badge key={event.id} variant="outline">
                      {event.name} ({new Date(event.date).toLocaleDateString()})
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Metrics Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Attendance */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Attendance Comparison
                  </h4>
                  {analysis.metrics.attendance.map(metric => {
                    const event = analysis.events.find(e => e.id === metric.eventId);
                    return (
                      <div key={metric.eventId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{event?.name}</div>
                          <div className="text-sm text-muted-foreground">{metric.value} attendees</div>
                        </div>
                        {metric.change !== undefined && (
                          <div className={`flex items-center gap-1 ${getChangeColor(metric.change)}`}>
                            {getChangeIcon(metric.change)}
                            <span className="text-sm font-medium">
                              {metric.change > 0 ? '+' : ''}{formatPercentage(metric.change)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Revenue */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Revenue Comparison
                  </h4>
                  {analysis.metrics.revenue.map(metric => {
                    const event = analysis.events.find(e => e.id === metric.eventId);
                    return (
                      <div key={metric.eventId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{event?.name}</div>
                          <div className="text-sm text-muted-foreground">{formatCurrency(metric.value)}</div>
                        </div>
                        {metric.change !== undefined && (
                          <div className={`flex items-center gap-1 ${getChangeColor(metric.change)}`}>
                            {getChangeIcon(metric.change)}
                            <span className="text-sm font-medium">
                              {metric.change > 0 ? '+' : ''}{formatPercentage(metric.change)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insights */}
              <div>
                <h4 className="font-medium mb-3">Key Insights</h4>
                <div className="space-y-3">
                  {analysis.insights.map((insight, index) => (
                    <div key={index} className="p-4 border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium mb-1">{insight.title}</div>
                          <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {insight.affectedEvents.map(eventId => {
                              const event = analysis.events.find(e => e.id === eventId);
                              return (
                                <Badge key={eventId} variant="secondary" className="text-xs">
                                  {event?.name}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                        <Badge variant={
                          insight.type === 'trend' ? 'default' :
                          insight.type === 'outlier' ? 'destructive' : 'secondary'
                        }>
                          {insight.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!analysis && (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Comparison Available</h3>
            <p className="text-muted-foreground">
              Select events above to generate a comparative analysis
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComparativeAnalyticsPanel;
