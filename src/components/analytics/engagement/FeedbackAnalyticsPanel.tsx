
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, Clock, BarChart3, MessageSquare, CircleSlash } from 'lucide-react';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';
import { useFeedbackAnalytics } from '@/hooks/analytics/useFeedbackAnalytics';

interface FeedbackAnalyticsPanelProps {
  establishmentId: string;
}

const FeedbackAnalyticsPanel: React.FC<FeedbackAnalyticsPanelProps> = ({ establishmentId }) => {
  const {
    averageSentiment,
    totalFeedback,
    responseRate,
    averageResponseTime,
    sentimentDistribution,
    sentimentTrend,
    isLoading,
    error
  } = useFeedbackAnalytics(establishmentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading feedback analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalFeedback === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback Analytics</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <CircleSlash className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-material-on-surface-variant">No feedback data available</p>
          <p className="mt-2 text-material-on-surface-variant">
            Encourage customers to provide feedback to see analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <AnalyticsMetricCard
              title="Average Sentiment" 
              value={averageSentiment.toFixed(1) + " / 5"}
              icon={ThumbsUp}
              iconColor="text-blue-500"
              backgroundColor="bg-blue-50"
            />
            <AnalyticsMetricCard
              title="Total Feedback" 
              value={totalFeedback} 
              icon={MessageSquare}
              iconColor="text-green-500"
              backgroundColor="bg-green-50"
            />
            <AnalyticsMetricCard
              title="Response Rate" 
              value={`${responseRate}%`}
              icon={BarChart3} 
              iconColor="text-purple-500"
              backgroundColor="bg-purple-50"
            />
            <AnalyticsMetricCard
              title="Avg Response Time" 
              value={`${averageResponseTime} hrs`}
              icon={Clock}
              iconColor="text-orange-500"
              backgroundColor="bg-orange-50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsPieChart
              title="Sentiment Distribution"
              description="Breakdown of feedback by sentiment"
              data={sentimentDistribution}
              colors={['#4CAF50', '#FFC107', '#F44336']}
            />
            
            <AnalyticsLineChart
              title="Sentiment & Response Trends"
              description="Sentiment and response rate over time"
              data={sentimentTrend}
              series={[
                { key: 'positive', name: 'Positive', color: '#4CAF50' },
                { key: 'neutral', name: 'Neutral', color: '#FFC107' },
                { key: 'negative', name: 'Negative', color: '#F44336' },
                { key: 'responseRate', name: 'Response Rate (%)', color: '#2196F3' }
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackAnalyticsPanel;
