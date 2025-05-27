
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';

interface ScarcityIndicatorProps {
  type: 'tickets_remaining' | 'percentage_sold' | 'high_demand' | 'almost_sold_out';
  thresholdValue?: number;
  messageTemplate: string;
  displayStyle?: Record<string, any>;
  priority?: number;
  isActive?: boolean;
  currentValue?: number;
  totalValue?: number;
  className?: string;
}

export const ScarcityIndicator: React.FC<ScarcityIndicatorProps> = ({
  type,
  thresholdValue,
  messageTemplate,
  displayStyle = {},
  priority = 1,
  isActive = true,
  currentValue = 0,
  totalValue = 100,
  className = ""
}) => {
  if (!isActive) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'tickets_remaining':
        return {
          icon: Users,
          color: currentValue <= (thresholdValue || 10) ? 'text-red-600' : 'text-orange-600',
          bgColor: currentValue <= (thresholdValue || 10) ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
        };
      case 'percentage_sold':
        const percentage = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
        return {
          icon: TrendingUp,
          color: percentage >= (thresholdValue || 80) ? 'text-green-600' : 'text-blue-600',
          bgColor: percentage >= (thresholdValue || 80) ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
        };
      case 'high_demand':
        return {
          icon: TrendingUp,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 border-purple-200'
        };
      case 'almost_sold_out':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200'
        };
      default:
        return {
          icon: Users,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const renderContent = () => {
    const interpolatedMessage = messageTemplate
      .replace('{current}', currentValue.toString())
      .replace('{total}', totalValue.toString())
      .replace('{percentage}', Math.round((currentValue / totalValue) * 100).toString());

    switch (type) {
      case 'percentage_sold':
        const percentage = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{interpolatedMessage}</span>
              <span className="text-sm">{Math.round(percentage)}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      
      case 'tickets_remaining':
        const remaining = totalValue - currentValue;
        const remainingPercentage = totalValue > 0 ? (remaining / totalValue) * 100 : 0;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{interpolatedMessage}</span>
              <Badge variant="outline" className={config.color}>
                {remaining} left
              </Badge>
            </div>
            <Progress value={100 - remainingPercentage} className="h-2" />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{interpolatedMessage}</span>
            <Badge variant="outline" className={config.color}>
              High Demand
            </Badge>
          </div>
        );
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${config.bgColor} ${className}`}>
      <div className="flex items-start gap-2">
        <Icon className={`h-4 w-4 ${config.color} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
