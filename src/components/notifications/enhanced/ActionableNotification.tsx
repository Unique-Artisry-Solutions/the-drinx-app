import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  Check, 
  X, 
  ExternalLink,
  User,
  Calendar,
  Bell,
  Trash2
} from 'lucide-react';
import { Notification } from '@/types/notification';
import { NotificationBadge, PriorityIndicator } from './NotificationBadge';
import { QuickActionMenu } from './QuickActionMenu';
import { ToastActionButtons } from './ToastActionButtons';

interface ActionableNotificationProps {
  notification: Notification;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCustomAction?: (notification: Notification, action: string) => void;
  onViewDetails?: (notification: Notification) => void;
  showActions?: boolean;
  showSelection?: boolean;
  compact?: boolean;
  className?: string;
}

export const ActionableNotification: React.FC<ActionableNotificationProps> = ({
  notification,
  selected = false,
  onSelect,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onCustomAction,
  onViewDetails,
  showActions = true,
  showSelection = false,
  compact = false,
  className = ""
}) => {
  const getNotificationIcon = () => {
    const type = notification.metadata?.type;
    switch (type) {
      case 'friend_request':
        return <User className="h-4 w-4" />;
      case 'event_invitation':
        return <Calendar className="h-4 w-4" />;
      case 'approval_request':
        return <Check className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleClick = () => {
    if (!notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    
    if (onViewDetails) {
      onViewDetails(notification);
    } else if (notification.metadata?.actionUrl) {
      window.open(notification.metadata.actionUrl, '_blank');
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (onSelect) {
      onSelect(notification.id);
    }
  };

  return (
    <Card 
      className={`
        relative transition-all duration-200 cursor-pointer
        ${!notification.is_read ? 'bg-muted/30 border-primary/20' : 'bg-background'}
        ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}
        ${compact ? 'p-3' : 'p-4'}
        hover:shadow-md
        ${className}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Selection Checkbox */}
        {showSelection && (
          <Checkbox
            checked={selected}
            onCheckedChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />
        )}

        {/* Notification Icon */}
        <div className="flex-shrink-0 mt-1">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {getNotificationIcon()}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium ${compact ? 'text-sm' : 'text-base'} truncate`}>
                  {notification.title}
                </h4>
                
                {!notification.is_read && (
                  <NotificationDot visible priority={notification.priority} />
                )}
                
                <PriorityIndicator priority={notification.priority} size="sm" />
              </div>
              
              <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'} line-clamp-2`}>
                {notification.content}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
                
                {notification.metadata?.type && (
                  <Badge variant="outline" className="text-xs">
                    {notification.metadata.type.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <QuickActionMenu
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onMarkAsUnread={onMarkAsUnread}
                  onDelete={onDelete}
                  onViewDetails={onViewDetails}
                />
              </div>
            )}
          </div>

          {/* Embedded Action Buttons */}
          {showActions && (
            <div onClick={(e) => e.stopPropagation()}>
              <ToastActionButtons
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onViewDetails={onViewDetails}
                onCustomAction={onCustomAction}
                onDismiss={onDelete}
                compact={compact}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Notification dot component (extracted from NotificationBadge for reuse)
interface NotificationDotProps {
  visible: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

const NotificationDot: React.FC<NotificationDotProps> = ({ 
  visible, 
  priority = 'medium' 
}) => {
  if (!visible) return null;

  const getColorClass = () => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-primary';
      case 'low':
        return 'bg-gray-400';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={`w-2 h-2 rounded-full ${getColorClass()}`} />
  );
};