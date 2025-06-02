
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Users, TrendingUp, DollarSign } from 'lucide-react';

interface AnalyticsHeaderProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  data?: any;
  isLoading?: boolean;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  timeRange,
  onTimeRangeChange,
  data,
  isLoading
}) => {
  const stats = [
    {
      title: "Total Visits",
      value: "2,847",
      change: "+12.3%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+8.1%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Avg. Session",
      value: "4m 32s",
      change: "+2.4%",
      icon: CalendarDays,
      trend: "up"
    },
    {
      title: "Conversion",
      value: "3.2%",
      change: "-0.8%",
      icon: TrendingUp,
      trend: "down"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsHeader;
