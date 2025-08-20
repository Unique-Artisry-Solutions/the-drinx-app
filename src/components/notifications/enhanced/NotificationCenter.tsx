import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCheck, 
  Archive, 
  Trash2,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types/notification';
import { NotificationFilters } from './NotificationFilters';
import { NotificationGrouping } from './NotificationGrouping';
import { InfiniteScrollList } from './InfiniteScrollList';

interface NotificationCenterProps {
  className?: string;
  maxHeight?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  showGrouping?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  className = '',
  maxHeight = '600px',
  showSearch = true,
  showFilters = true,
  showGrouping = true
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'urgent'>('all');
  const [selectedFilters, setSelectedFilters] = useState<{
    priority: string[];
    type: string[];
    dateRange: string;
  }>({
    priority: [],
    type: [],
    dateRange: 'all'
  });

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications || [];

    // Tab filtering
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(n => !n.is_read);
        break;
      case 'urgent':
        filtered = filtered.filter(n => n.priority === 'urgent' || n.priority === 'high');
        break;
    }

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
      );
    }

    // Priority filtering
    if (selectedFilters.priority.length > 0) {
      filtered = filtered.filter(n => 
        selectedFilters.priority.includes(n.priority || 'medium')
      );
    }

    // Type filtering
    if (selectedFilters.type.length > 0) {
      filtered = filtered.filter(n => 
        selectedFilters.type.includes(n.metadata?.type || 'info')
      );
    }

    // Date range filtering
    if (selectedFilters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (selectedFilters.dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(n => 
        new Date(n.created_at) >= cutoff
      );
    }

    return filtered;
  }, [notifications, activeTab, searchQuery, selectedFilters]);

  const handleBulkMarkAsRead = () => {
    const unreadIds = filteredNotifications
      .filter(n => !n.is_read)
      .map(n => n.id);
    
    unreadIds.forEach(id => markAsRead(id));
  };

  const getTabCounts = () => {
    const all = notifications?.length || 0;
    const unread = unreadCount;
    const urgent = notifications?.filter(n => 
      n.priority === 'urgent' || n.priority === 'high'
    ).length || 0;

    return { all, unread, urgent };
  };

  const tabCounts = getTabCounts();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Center
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBulkMarkAsRead}
              disabled={tabCounts.unread === 0}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              {tabCounts.all > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {tabCounts.all}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              Unread
              {tabCounts.unread > 0 && (
                <Badge variant="default" className="ml-1">
                  {tabCounts.unread}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="urgent" className="flex items-center gap-2">
              Urgent
              {tabCounts.urgent > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {tabCounts.urgent}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {showFilters && (
            <div className="mt-4">
              <NotificationFilters
                selectedFilters={selectedFilters}
                onFiltersChange={setSelectedFilters}
              />
            </div>
          )}

          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea style={{ maxHeight }}>
              <InfiniteScrollList
                notifications={filteredNotifications}
                onMarkAsRead={markAsRead}
                showGrouping={showGrouping}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};