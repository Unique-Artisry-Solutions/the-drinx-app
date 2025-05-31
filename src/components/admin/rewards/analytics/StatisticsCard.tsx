
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Activity, Gift, Percent } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string;
  change: number;
  icon: 'users' | 'activity' | 'gift' | 'percent';
}

const iconMap = {
  users: Users,
  activity: Activity,
  gift: Gift,
  percent: Percent
};

const StatisticsCard = ({ title, value, change, icon }: StatisticsCardProps) => {
  const IconComponent = iconMap[icon];
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
          )}
          <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(change)}%
          </span>
          <span className="ml-1">from last period</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
