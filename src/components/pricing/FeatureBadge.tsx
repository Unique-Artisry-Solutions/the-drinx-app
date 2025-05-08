
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FeatureBadgeProps {
  tier: 'free' | 'basic' | 'premium' | 'vip';
  className?: string;
  label?: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  tier,
  className,
  label
}) => {
  const variants = {
    free: 'bg-gray-200 text-gray-800',
    basic: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
    vip: 'bg-amber-100 text-amber-800'
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(variants[tier], 'font-medium px-2.5 py-1', className)}
    >
      {label || tier.charAt(0).toUpperCase() + tier.slice(1)}
    </Badge>
  );
};

export default FeatureBadge;
