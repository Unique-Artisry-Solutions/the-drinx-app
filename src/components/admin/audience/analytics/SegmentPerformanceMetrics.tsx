
import { DateRange } from 'react-day-picker';
import { AudienceSegment } from '@/types/AudienceTypes';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Target, Zap, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface SegmentPerformanceMetricsProps {
  dateRange?: DateRange;
  segments: AudienceSegment[];
  isLoading: boolean;
}

export function SegmentPerformanceMetrics({ dateRange, segments, isLoading }: SegmentPerformanceMetricsProps) {
  // Mock data - In a real application, this would come from an API
  const getSegmentMetrics = () => {
    return {
      memberCount: Math.floor(Math.random() * 1000) + 500,
      conversionRate: (Math.random() * 15) + 3,
      engagementScore: (Math.random() * 90) + 10,
      growthRate: (Math.random() * 20) - 5
    };
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-[100px] mb-2" />
            <Skeleton className="h-8 w-[80px] mb-4" />
            <Skeleton className="h-4 w-[120px]" />
          </Card>
        ))}
      </div>
    );
  }
  
  if (segments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No segments available. Create segments to view their performance metrics.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">
        Showing metrics for: {dateRange?.from ? `${format(dateRange.from, 'PPP')} to ${format(dateRange.to || new Date(), 'PPP')}` : 'All time'}
      </p>
      
      <div className="space-y-8">
        {segments.map(segment => {
          const metrics = getSegmentMetrics();
          
          return (
            <div key={segment.id} className="space-y-2">
              <h3 className="text-lg font-medium">{segment.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsMetricCard
                  title="Members"
                  value={metrics.memberCount.toLocaleString()}
                  icon={Users}
                  iconColor="text-blue-500"
                  change={metrics.growthRate}
                />
                <AnalyticsMetricCard
                  title="Conversion Rate"
                  value={`${metrics.conversionRate.toFixed(1)}%`}
                  icon={Target}
                  iconColor="text-green-500"
                  change={metrics.conversionRate > 5 ? 1.2 : -0.8}
                />
                <AnalyticsMetricCard
                  title="Engagement Score"
                  value={metrics.engagementScore.toFixed(1)}
                  icon={Zap}
                  iconColor="text-amber-500"
                  change={metrics.engagementScore > 50 ? 3.4 : -1.2}
                />
                <AnalyticsMetricCard
                  title="Growth Rate"
                  value={`${metrics.growthRate.toFixed(1)}%`}
                  icon={TrendingUp}
                  iconColor={metrics.growthRate >= 0 ? "text-green-500" : "text-red-500"}
                  change={metrics.growthRate}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
