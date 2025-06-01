
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Gift, DollarSign } from 'lucide-react';

const ProgramStatisticsDashboard = () => {
  const [_timeRange, setTimeRange] = useState('30d');

  const programMetrics = [
    {
      title: 'Total Users',
      value: '4,528',
      icon: Users,
      change: '+12.5%',
      isPositive: true,
    },
    {
      title: 'Rewards Redeemed',
      value: '1,245',
      icon: Gift,
      change: '-3.2%',
      isPositive: false,
    },
    {
      title: 'Points Spent',
      value: '87,500',
      icon: DollarSign,
      change: '+8.7%',
      isPositive: true,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Program Statistics</CardTitle>
          <CardDescription>
            Overview of key metrics for your rewards program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={_timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary">
              Updated daily
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-2 inline-block" />
                  {metric.change} from last period
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProgramStatisticsDashboard;
