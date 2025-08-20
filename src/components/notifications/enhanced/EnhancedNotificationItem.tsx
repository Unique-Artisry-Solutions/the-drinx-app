import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  MoreVertical,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Notification } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface EnhancedNotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
  showActions?: boolean;
  className?: string;
}

export const EnhancedNotificationItem: React.FC<EnhancedNotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onArchive,
  onDelete,
  compact = false,
  showActions = true,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = cn(
      "h-5 w-5",
      priority === 'urgent' && "animate-pulse"
    );

    switch (type) {
      case 'success':
        return <CheckCircle className={cn(iconClass, "text-green-500")} />;
      case 'error':
        return <AlertTriangle className={cn(iconClass, "text-red-500")} />;
      case 'warning':
        return <AlertTriangle className={cn(iconClass, "text-yellow-500")} />;
      case 'info':
        return <Info className={cn(iconClass, "text-blue-500")} />;
      default:
        return <Bell className={cn(iconClass, "text-primary")} />;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleActionClick = (action: () => void, event: React.MouseEvent) => {
    event.stopPropagation();
    action();
  };

  const formatTimeAgo = (date: string | Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer group",
        !notification.is_read && "border-l-4 border-l-primary bg-primary/5",
        isHovered && "shadow-md",
        compact && "py-2",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start gap-3">
          {/* Avatar/Icon */}
          <div className="flex-shrink-0">
            {notification.metadata?.sender_avatar ? (
              <Avatar className={cn("h-8 w-8", compact && "h-6 w-6")}>
                <AvatarImage src={notification.metadata.sender_avatar} />
                <AvatarFallback>
                  {notification.metadata?.sender_name?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="p-1">
                {getNotificationIcon(
                  notification.metadata?.type || 'info', 
                  notification.priority || 'medium'
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  "font-medium leading-tight",
                  !notification.is_read && "text-foreground",
                  notification.is_read && "text-muted-foreground",
                  compact && "text-sm"
                )}>
                  {notification.title}
                </h4>
                
                {!compact && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.content}
                  </p>
                )}
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-1">
                  {/* Priority Badge */}
                  {notification.priority && notification.priority !== 'medium' && (
                    <Badge 
                      variant={getPriorityBadgeVariant(notification.priority) as any}
                      className="text-xs"
                    >
                      {notification.priority}
                    </Badge>
                  )}

                  {/* Quick Actions */}
                  <div className={cn(
                    "flex items-center gap-1 transition-opacity",
                    !isHovered && "opacity-0 group-hover:opacity-100"
                  )}>
                    {/* Mark as read/unread */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleActionClick(() => onMarkAsRead(notification.id), e)}
                      className="h-6 w-6 p-0"
                    >
                      {notification.is_read ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>

                    {/* More actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => handleActionClick(() => onMarkAsRead(notification.id), e)}
                        >
                          {notification.is_read ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Mark as unread
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Mark as read
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        {notification.metadata?.action_url && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(notification.metadata.action_url, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open link
                          </DropdownMenuItem>
                        )}

                        {onArchive && (
                          <DropdownMenuItem
                            onClick={(e) => handleActionClick(() => onArchive(notification.id), e)}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}

                        {onDelete && (
                          <DropdownMenuItem
                            onClick={(e) => handleActionClick(() => onDelete(notification.id), e)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(notification.created_at)}</span>
                {notification.metadata?.sender_name && (
                  <>
                    <span>•</span>
                    <span>from {notification.metadata.sender_name}</span>
                  </>
                )}
              </div>

              {/* Read status indicator */}
              {!notification.is_read && (
                <div className="h-2 w-2 bg-primary rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};