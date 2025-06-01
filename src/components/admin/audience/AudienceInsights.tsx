
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, Target, Activity } from 'lucide-react';

interface Insight {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType;
}

const AudienceInsights = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data
  const insights = [
    {
      title: 'Total Audience Size',
      value: '12,456',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users
    },
    {
      title: 'Active Users (Last 30 Days)',
      value: '8,910',
      change: '-3.5%',
      trend: 'down' as const,
      icon: Activity
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: '+1.1%',
      trend: 'up' as const,
      icon: Target
    },
    {
      title: 'Audience Growth',
      value: '+1,234',
      change: '+12.5%',
      trend: 'up' as const,
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Audience Insights</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="365d">Last 365 Days</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight) => {
          const IconComponent = insight.icon;
          return (
            <Card key={insight.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {insight.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insight.value}</div>
                <div className={`text-xs ${insight.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {insight.change} from last period
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Segment Performance</h3>
        <p className="text-muted-foreground">
          Track the performance of your audience segments
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>High Value Customers</CardTitle>
              <CardDescription>Customers with lifetime value {'>'}$500</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Members</span>
                  <span className="font-medium">1,250</span>
                </div>
                <Progress value={75} />
                <div className="flex items-center justify-between">
                  <span>Conversion Rate</span>
                  <span className="font-medium">4.8%</span>
                </div>
                <Progress value={85} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loyal Customers</CardTitle>
              <CardDescription>Customers with {'>'} 10 purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Members</span>
                  <span className="font-medium">875</span>
                </div>
                <Progress value={60} />
                <div className="flex items-center justify-between">
                  <span>Retention Rate</span>
                  <span className="font-medium">82%</span>
                </div>
                <Progress value={70} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Customers (Last 30 Days)</CardTitle>
              <CardDescription>Customers who made their first purchase in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Members</span>
                  <span className="font-medium">320</span>
                </div>
                <Progress value={45} />
                <div className="flex items-center justify-between">
                  <span>Activation Rate</span>
                  <span className="font-medium">65%</span>
                </div>
                <Progress value={55} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AudienceInsights;
