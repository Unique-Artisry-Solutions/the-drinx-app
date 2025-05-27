
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Zap } from 'lucide-react';

interface UrgencyBannerProps {
  message: string;
  type: 'limited_time' | 'limited_quantity' | 'early_bird' | 'last_chance' | 'flash_sale';
  displayConditions?: Record<string, any>;
  className?: string;
  isActive?: boolean;
}

export const UrgencyBanner: React.FC<UrgencyBannerProps> = ({
  message,
  type,
  displayConditions = {},
  className = "",
  isActive = true
}) => {
  if (!isActive) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'limited_time':
        return {
          icon: Clock,
          variant: 'default' as const,
          className: 'border-orange-200 bg-orange-50 text-orange-800',
          badgeText: 'Limited Time'
        };
      case 'limited_quantity':
        return {
          icon: AlertTriangle,
          variant: 'destructive' as const,
          className: 'border-red-200 bg-red-50 text-red-800',
          badgeText: 'Limited Stock'
        };
      case 'early_bird':
        return {
          icon: Zap,
          variant: 'default' as const,
          className: 'border-green-200 bg-green-50 text-green-800',
          badgeText: 'Early Bird'
        };
      case 'last_chance':
        return {
          icon: AlertTriangle,
          variant: 'destructive' as const,
          className: 'border-red-200 bg-red-50 text-red-800',
          badgeText: 'Last Chance'
        };
      case 'flash_sale':
        return {
          icon: Zap,
          variant: 'default' as const,
          className: 'border-purple-200 bg-purple-50 text-purple-800',
          badgeText: 'Flash Sale'
        };
      default:
        return {
          icon: Clock,
          variant: 'default' as const,
          className: 'border-blue-200 bg-blue-50 text-blue-800',
          badgeText: 'Special Offer'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <Alert className={`${config.className} ${className} animate-pulse`}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={config.variant} className="text-xs">
            {config.badgeText}
          </Badge>
          <span className="font-medium">{message}</span>
        </div>
      </AlertDescription>
    </Alert>
  );
};
