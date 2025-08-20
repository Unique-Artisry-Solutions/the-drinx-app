import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showZero?: boolean;
  maxCount?: number;
  className?: string;
  children?: React.ReactNode;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  variant = 'default',
  priority = 'medium',
  position = 'top-right',
  size = 'md',
  animated = true,
  showZero = false,
  maxCount = 99,
  className = '',
  children
}) => {
  // Don't show badge if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return <>{children}</>;
  }

  // Determine badge variant based on priority
  const getBadgeVariant = () => {
    if (priority === 'urgent') return 'destructive';
    if (priority === 'high') return 'default';
    return variant;
  };

  // Format count display
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  // Size classes
  const sizeClasses = {
    sm: 'h-4 min-w-4 text-xs px-1',
    md: 'h-5 min-w-5 text-xs px-1.5',
    lg: 'h-6 min-w-6 text-sm px-2'
  };

  // Position classes for floating badges
  const positionClasses = {
    'top-right': 'absolute -top-1 -right-1',
    'top-left': 'absolute -top-1 -left-1',
    'bottom-right': 'absolute -bottom-1 -right-1',
    'bottom-left': 'absolute -bottom-1 -left-1',
    'inline': 'relative inline-flex'
  };

  // Animation classes
  const animationClasses = animated ? {
    'urgent': 'animate-pulse',
    'high': 'animate-pulse',
    'medium': 'animate-fade-in',
    'low': 'animate-fade-in'
  }[priority] || 'animate-fade-in' : '';

  const badgeElement = (
    <Badge
      variant={getBadgeVariant() as any}
      className={cn(
        'rounded-full flex items-center justify-center font-medium select-none',
        sizeClasses[size],
        position !== 'inline' && positionClasses[position],
        animationClasses,
        priority === 'urgent' && 'ring-2 ring-destructive/20',
        className
      )}
    >
      {displayCount}
    </Badge>
  );

  // If position is inline or no children, just return the badge
  if (position === 'inline' || !children) {
    return badgeElement;
  }

  // Floating badge with children
  return (
    <div className="relative inline-block">
      {children}
      {badgeElement}
    </div>
  );
};

// Specialized badge components
export const UnreadCounter: React.FC<{
  count: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  animated?: boolean;
  children?: React.ReactNode;
}> = ({ count, priority = 'medium', animated = true, children }) => (
  <NotificationBadge
    count={count}
    priority={priority}
    animated={animated}
    position="top-right"
    size="sm"
  >
    {children}
  </NotificationBadge>
);

export const PriorityIndicator: React.FC<{
  priority: 'low' | 'medium' | 'high' | 'urgent';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}> = ({ priority, size = 'sm', showLabel = false, className = '' }) => {
  const priorityConfig = {
    urgent: { variant: 'destructive' as const, label: 'Urgent', pulse: true },
    high: { variant: 'default' as const, label: 'High', pulse: false },
    medium: { variant: 'secondary' as const, label: 'Medium', pulse: false },
    low: { variant: 'outline' as const, label: 'Low', pulse: false }
  };

  const config = priorityConfig[priority];

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'text-xs',
        config.pulse && 'animate-pulse',
        size === 'sm' && 'h-4 px-2',
        size === 'md' && 'h-5 px-2.5',
        size === 'lg' && 'h-6 px-3',
        className
      )}
    >
      {showLabel ? config.label : '•'}
    </Badge>
  );
};

export const NotificationDot: React.FC<{
  visible: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}> = ({ 
  visible, 
  priority = 'medium', 
  position = 'top-right', 
  size = 'md',
  className = '',
  children 
}) => {
  if (!visible) {
    return <>{children}</>;
  }

  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const colorClasses = {
    urgent: 'bg-red-500 animate-pulse',
    high: 'bg-primary',
    medium: 'bg-blue-500',
    low: 'bg-gray-400'
  };

  const positionClasses = {
    'top-right': 'absolute -top-0.5 -right-0.5',
    'top-left': 'absolute -top-0.5 -left-0.5',
    'bottom-right': 'absolute -bottom-0.5 -right-0.5',
    'bottom-left': 'absolute -bottom-0.5 -left-0.5'
  };

  const dotElement = (
    <div
      className={cn(
        'rounded-full',
        sizeClasses[size],
        colorClasses[priority],
        positionClasses[position],
        className
      )}
    />
  );

  if (!children) {
    return dotElement;
  }

  return (
    <div className="relative inline-block">
      {children}
      {dotElement}
    </div>
  );
};