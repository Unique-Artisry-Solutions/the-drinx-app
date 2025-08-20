import React, { useMemo } from 'react';
import { Notification } from '@/types/notification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Calendar, Tag, User } from 'lucide-react';
import { format, isToday, isYesterday, subDays } from 'date-fns';
import { EnhancedNotificationItem } from './EnhancedNotificationItem';

interface NotificationGroup {
  key: string;
  title: string;
  notifications: Notification[];
  count: number;
  unreadCount: number;
  icon?: React.ReactNode;
}

interface NotificationGroupingProps {
  notifications: Notification[];
  groupBy: 'date' | 'type' | 'priority' | 'sender';
  onMarkAsRead: (id: string) => void;
  defaultExpandedGroups?: string[];
}

export const NotificationGrouping: React.FC<NotificationGroupingProps> = ({
  notifications,
  groupBy,
  onMarkAsRead,
  defaultExpandedGroups = []
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(defaultExpandedGroups)
  );

  const groups = useMemo(() => {
    const groupMap = new Map<string, Notification[]>();

    notifications.forEach(notification => {
      let groupKey: string;
      let groupTitle: string;

      switch (groupBy) {
        case 'date':
          const date = new Date(notification.created_at);
          if (isToday(date)) {
            groupKey = 'today';
            groupTitle = 'Today';
          } else if (isYesterday(date)) {
            groupKey = 'yesterday';
            groupTitle = 'Yesterday';
          } else if (date >= subDays(new Date(), 7)) {
            groupKey = 'week';
            groupTitle = 'This Week';
          } else if (date >= subDays(new Date(), 30)) {
            groupKey = 'month';
            groupTitle = 'This Month';
          } else {
            groupKey = 'older';
            groupTitle = 'Older';
          }
          break;

        case 'type':
          groupKey = notification.metadata?.type || 'info';
          groupTitle = (notification.metadata?.type || 'info').charAt(0).toUpperCase() + 
                      (notification.metadata?.type || 'info').slice(1);
          break;

        case 'priority':
          groupKey = notification.priority || 'medium';
          groupTitle = (notification.priority || 'medium').charAt(0).toUpperCase() + 
                       (notification.priority || 'medium').slice(1) + ' Priority';
          break;

        case 'sender':
          groupKey = notification.metadata?.sender_id || 'system';
          groupTitle = notification.metadata?.sender_name || 'System';
          break;

        default:
          groupKey = 'all';
          groupTitle = 'All Notifications';
      }

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)!.push(notification);
    });

    // Convert to groups array and sort
    const groupsArray: NotificationGroup[] = Array.from(groupMap.entries()).map(([key, notifications]) => {
      const group = groups.find(g => g.key === key);
      return {
        key,
        title: group?.title || key,
        notifications: notifications.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
        count: notifications.length,
        unreadCount: notifications.filter(n => !n.is_read).length,
        icon: getGroupIcon(groupBy, key)
      };
    });

    // Sort groups by priority/date
    return groupsArray.sort((a, b) => {
      if (groupBy === 'date') {
        const order = ['today', 'yesterday', 'week', 'month', 'older'];
        return order.indexOf(a.key) - order.indexOf(b.key);
      }
      if (groupBy === 'priority') {
        const order = ['urgent', 'high', 'medium', 'low'];
        return order.indexOf(a.key) - order.indexOf(b.key);
      }
      return a.title.localeCompare(b.title);
    });
  }, [notifications, groupBy]);

  const getGroupIcon = (groupBy: string, key: string) => {
    switch (groupBy) {
      case 'date':
        return <Calendar className="h-4 w-4" />;
      case 'type':
        return <Tag className="h-4 w-4" />;
      case 'sender':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const handleGroupMarkAllRead = (groupNotifications: Notification[]) => {
    groupNotifications
      .filter(n => !n.is_read)
      .forEach(n => onMarkAsRead(n.id));
  };

  if (groups.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No notifications to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map(group => (
        <Card key={group.key} className="overflow-hidden">
          <Collapsible
            open={expandedGroups.has(group.key)}
            onOpenChange={() => toggleGroup(group.key)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {expandedGroups.has(group.key) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {group.icon}
                    {group.title}
                    <Badge variant="secondary" className="ml-2">
                      {group.count}
                    </Badge>
                    {group.unreadCount > 0 && (
                      <Badge variant="default" className="ml-1">
                        {group.unreadCount} unread
                      </Badge>
                    )}
                  </CardTitle>
                  
                  {group.unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGroupMarkAllRead(group.notifications);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0 space-y-2">
                {group.notifications.map(notification => (
                  <EnhancedNotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    compact
                  />
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};