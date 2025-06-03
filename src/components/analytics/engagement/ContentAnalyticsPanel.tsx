
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, MessageSquare, CircleSlash, BarChart3 } from 'lucide-react';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import { useContentAnalytics } from '@/hooks/analytics/useContentAnalytics';

interface ContentAnalyticsPanelProps {
  establishmentId: string;
}

const ContentAnalyticsPanel: React.FC<ContentAnalyticsPanelProps> = ({ establishmentId }) => {
  const {
    totalContent,
    publishedContent,
    engagementRate,
    topContentTypes,
    timeSeriesData,
    isLoading,
    error
  } = useContentAnalytics(establishmentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User-Generated Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading content analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User-Generated Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalContent === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User-Generated Content</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <CircleSlash className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-material-on-surface-variant">No user-generated content available</p>
          <p className="mt-2 text-material-on-surface-variant">
            Encourage customers to leave reviews and share content
          </p>
        </CardContent>
      </Card>
    );
  }

  const contentIcons = {
    Reviews: FileText,
    Photos: Image,
    Comments: MessageSquare
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User-Generated Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <AnalyticsMetricCard
              title="Total Content" 
              value={totalContent}
              icon={BarChart3}
              iconColor="text-blue-500"
              backgroundColor="bg-blue-50"
            />
            <AnalyticsMetricCard
              title="Published Content" 
              value={publishedContent} 
              icon={FileText}
              iconColor="text-green-500"
              backgroundColor="bg-green-50"
            />
            <AnalyticsMetricCard
              title="Engagement Rate" 
              value={`${engagementRate}%`}
              icon={MessageSquare} 
              iconColor="text-purple-500"
              backgroundColor="bg-purple-50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsPieChart
              title="Content Distribution"
              description="Breakdown of content by type"
              data={topContentTypes}
              colors={['#8884d8', '#82ca9d', '#ffc658']}
            />
            
            <AnalyticsBarChart
              title="Content Creation Trends"
              description="User-generated content over time"
              data={timeSeriesData}
              series={[
                { key: 'reviews', name: 'Reviews', color: '#8884d8' },
                { key: 'photos', name: 'Photos', color: '#82ca9d' },
                { key: 'comments', name: 'Comments', color: '#ffc658' }
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentAnalyticsPanel;
