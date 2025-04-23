
import { Button } from '@/components/ui/button';
import { Check, RefreshCw } from 'lucide-react';

interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
  onRefresh: () => void;
}

export default function NotificationsHeader({ 
  unreadCount, 
  onMarkAllRead, 
  onRefresh 
}: NotificationsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          {unreadCount > 0 
            ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
            : 'No unread notifications'
          }
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
        >
          <Check className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh notifications</span>
        </Button>
      </div>
    </div>
  );
}
