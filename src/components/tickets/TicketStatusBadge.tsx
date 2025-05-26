
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TicketStatusBadgeProps {
  status: 'purchased' | 'used' | 'cancelled' | 'transferred' | 'refunded';
  className?: string;
}

const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'purchased':
        return 'default';
      case 'used':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'transferred':
        return 'outline';
      case 'refunded':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'purchased':
        return 'Active';
      case 'used':
        return 'Used';
      case 'cancelled':
        return 'Cancelled';
      case 'transferred':
        return 'Transferred';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  return (
    <Badge variant={getStatusColor() as any} className={className}>
      {getStatusText()}
    </Badge>
  );
};

export default TicketStatusBadge;
