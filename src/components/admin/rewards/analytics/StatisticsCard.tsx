
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  formatter?: (value: number | string) => string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon = <TrendingUp className="h-5 w-5 text-muted-foreground" />,
  trend,
  formatter = (val) => val.toString()
}) => {
  const formattedValue = typeof value === 'number' && !Number.isNaN(value) 
    ? formatter(value) 
    : value.toString();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon}
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold">{formattedValue}</div>
          {trend && (
            <div className="mt-1 flex items-center">
              <span
                className={`text-xs ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">from last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
