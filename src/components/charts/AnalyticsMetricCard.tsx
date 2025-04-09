
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AnalyticsMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  change?: number;
  backgroundColor?: string;
}

const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-500',
  change,
  backgroundColor = 'bg-background'
}) => {
  return (
    <Card className={backgroundColor}>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <Icon className={`h-5 w-5 ${iconColor} mr-2`} />
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center mt-2 text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from previous period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsMetricCard;
