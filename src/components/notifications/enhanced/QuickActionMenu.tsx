import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  CheckCircle,
  Eye,
  Trash2,
  Archive,
  Clock,
  ExternalLink,
  Copy,
  Flag
} from 'lucide-react';
import { Notification } from '@/types/notification';

interface QuickActionMenuProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onSnooze?: (id: string) => void;
  onViewDetails?: (notification: Notification) => void;
  onCopyLink?: (notification: Notification) => void;
  onChangePriority?: (id: string, priority: 'low' | 'medium' | 'high' | 'urgent') => void;
  className?: string;
}

export const QuickActionMenu: React.FC<QuickActionMenuProps> = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onArchive,
  onSnooze,
  onViewDetails,
  onCopyLink,
  onChangePriority,
  className = ""
}) => {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(notification);
    } else if (notification.metadata?.actionUrl) {
      window.open(notification.metadata.actionUrl, '_blank');
    }
  };

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink(notification);
    } else {
      // Fallback: copy notification ID or URL
      const textToCopy = notification.metadata?.actionUrl || `notification-${notification.id}`;
      navigator.clipboard.writeText(textToCopy);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 w-8 p-0 ${className}`}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {/* Read/Unread Toggle */}
        {notification.is_read ? (
          <DropdownMenuItem 
            onClick={() => onMarkAsUnread?.(notification.id)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Mark as Unread
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={() => onMarkAsRead?.(notification.id)}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Read
          </DropdownMenuItem>
        )}

        {/* View Details */}
        <DropdownMenuItem 
          onClick={handleViewDetails}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Priority Actions */}
        {onChangePriority && (
          <>
            <DropdownMenuItem 
              onClick={() => onChangePriority(notification.id, 'urgent')}
              className="flex items-center gap-2"
            >
              <Flag className="h-4 w-4 text-red-500" />
              Mark as Urgent
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onChangePriority(notification.id, 'high')}
              className="flex items-center gap-2"
            >
              <Flag className="h-4 w-4 text-orange-500" />
              Mark as High Priority
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onChangePriority(notification.id, 'low')}
              className="flex items-center gap-2"
            >
              <Flag className="h-4 w-4 text-gray-500" />
              Mark as Low Priority
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Archive */}
        {onArchive && (
          <DropdownMenuItem 
            onClick={() => onArchive(notification.id)}
            className="flex items-center gap-2"
          >
            <Archive className="h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}

        {/* Snooze */}
        {onSnooze && (
          <DropdownMenuItem 
            onClick={() => onSnooze(notification.id)}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Snooze
          </DropdownMenuItem>
        )}

        {/* Copy Link */}
        <DropdownMenuItem 
          onClick={handleCopyLink}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Link
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete */}
        <DropdownMenuItem 
          onClick={() => {
            if (window.confirm('Delete this notification?')) {
              onDelete?.(notification.id);
            }
          }}
          className="flex items-center gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};