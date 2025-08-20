import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Eye, 
  Clock, 
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { Notification } from '@/types/notification';

interface ToastActionButtonsProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onViewDetails?: (notification: Notification) => void;
  onSnooze?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onCustomAction?: (notification: Notification, action: string) => void;
  compact?: boolean;
}

export const ToastActionButtons: React.FC<ToastActionButtonsProps> = ({
  notification,
  onMarkAsRead,
  onViewDetails,
  onSnooze,
  onDismiss,
  onCustomAction,
  compact = false
}) => {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(notification);
    } else if (notification.metadata?.actionUrl) {
      window.open(notification.metadata.actionUrl, '_blank');
    }
  };

  // Custom actions based on notification type
  const getCustomActions = () => {
    const type = notification.metadata?.type;
    const actions = [];

    switch (type) {
      case 'friend_request':
        actions.push(
          <Button
            key="accept"
            size="sm"
            variant="default"
            onClick={() => onCustomAction?.(notification, 'accept')}
            className="flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            {!compact && 'Accept'}
          </Button>,
          <Button
            key="decline"
            size="sm"
            variant="outline"
            onClick={() => onCustomAction?.(notification, 'decline')}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            {!compact && 'Decline'}
          </Button>
        );
        break;
      
      case 'event_invitation':
        actions.push(
          <Button
            key="going"
            size="sm"
            variant="default"
            onClick={() => onCustomAction?.(notification, 'going')}
            className="flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            {!compact && 'Going'}
          </Button>,
          <Button
            key="maybe"
            size="sm"
            variant="outline"
            onClick={() => onCustomAction?.(notification, 'maybe')}
            className="flex items-center gap-1"
          >
            ?
          </Button>
        );
        break;
      
      case 'approval_request':
        actions.push(
          <Button
            key="approve"
            size="sm"
            variant="default"
            onClick={() => onCustomAction?.(notification, 'approve')}
            className="flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            {!compact && 'Approve'}
          </Button>,
          <Button
            key="reject"
            size="sm"
            variant="destructive"
            onClick={() => onCustomAction?.(notification, 'reject')}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            {!compact && 'Reject'}
          </Button>
        );
        break;
    }

    return actions;
  };

  const customActions = getCustomActions();

  return (
    <div className="flex items-center gap-1 mt-2">
      {/* Custom Type-Based Actions */}
      {customActions.length > 0 && (
        <>
          {customActions}
          <div className="mx-1 h-4 w-px bg-border" />
        </>
      )}

      {/* Standard Actions */}
      {!notification.is_read && onMarkAsRead && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onMarkAsRead(notification.id)}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          {!compact && 'Mark Read'}
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={handleViewDetails}
        className="flex items-center gap-1"
      >
        <ExternalLink className="h-3 w-3" />
        {!compact && 'View'}
      </Button>

      {onSnooze && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSnooze(notification.id)}
          className="flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          {!compact && 'Snooze'}
        </Button>
      )}

      {onDismiss && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDismiss(notification.id)}
          className="flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          {!compact && 'Dismiss'}
        </Button>
      )}
    </div>
  );
};