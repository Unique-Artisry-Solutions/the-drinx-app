import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  CheckCircle, 
  Archive, 
  Clock,
  X,
  AlertTriangle
} from 'lucide-react';
import { Notification } from '@/types/notification';

interface BulkActionPanelProps {
  selectedNotifications: string[];
  totalNotifications: number;
  notifications: Notification[];
  onSelectAll: () => void;
  onSelectNone: () => void;
  onMarkAsRead: (ids: string[]) => void;
  onMarkAsUnread: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
  onArchive?: (ids: string[]) => void;
  onSnooze?: (ids: string[]) => void;
  className?: string;
}

export const BulkActionPanel: React.FC<BulkActionPanelProps> = ({
  selectedNotifications,
  totalNotifications,
  notifications,
  onSelectAll,
  onSelectNone,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onArchive,
  onSnooze,
  className = ""
}) => {
  const selectedCount = selectedNotifications.length;
  const allSelected = selectedCount === totalNotifications && totalNotifications > 0;
  const hasSelected = selectedCount > 0;

  const selectedNotificationObjects = notifications.filter(n => 
    selectedNotifications.includes(n.id)
  );

  const hasUnread = selectedNotificationObjects.some(n => !n.is_read);
  const hasRead = selectedNotificationObjects.some(n => n.is_read);

  if (!hasSelected) {
    return null;
  }

  return (
    <div className={`bg-muted/50 border rounded-lg p-4 mb-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={allSelected ? onSelectNone : onSelectAll}
            className="p-1"
          >
            {allSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedCount} selected
            </Badge>
            <span className="text-sm text-muted-foreground">
              of {totalNotifications} notifications
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectNone}
          className="p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {hasUnread && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkAsRead(selectedNotifications)}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Read
          </Button>
        )}

        {hasRead && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkAsUnread(selectedNotifications)}
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Mark as Unread
          </Button>
        )}

        <Separator orientation="vertical" className="h-6" />

        {onArchive && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onArchive(selectedNotifications)}
            className="flex items-center gap-2"
          >
            <Archive className="h-4 w-4" />
            Archive
          </Button>
        )}

        {onSnooze && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSnooze(selectedNotifications)}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Snooze
          </Button>
        )}

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (window.confirm(`Delete ${selectedCount} notification${selectedCount > 1 ? 's' : ''}?`)) {
              onDelete(selectedNotifications);
            }
          }}
          className="flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};