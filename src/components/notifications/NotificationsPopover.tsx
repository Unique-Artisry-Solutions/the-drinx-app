
import React from 'react';
import { Bell, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';

const NotificationsPopover = () => {
  const { notifications, unreadCount, isLoading, error, markAsRead, refetch } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 px-2 min-w-[20px] h-5 flex items-center justify-center bg-red-500"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96">
        <div className="px-4 py-2 border-b flex justify-between items-center">
          <h3 className="font-medium">Notifications</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto"
            onClick={() => refetch()}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="px-4 py-2">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 w-full bg-gray-100 rounded-lg" />
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 space-y-2">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                <p className="text-gray-700 font-medium">Error loading notifications</p>
                <p className="text-sm text-gray-500">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetch()}
                >
                  Try Again
                </Button>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">No notifications</p>
                <p className="text-sm text-gray-400">You'll be notified when you have updates</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
