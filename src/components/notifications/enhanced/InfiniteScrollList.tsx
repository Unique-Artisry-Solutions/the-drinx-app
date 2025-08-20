import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Notification } from '@/types/notification';
import { NotificationGrouping } from './NotificationGrouping';
import { EnhancedNotificationItem } from './EnhancedNotificationItem';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowUp } from 'lucide-react';

interface InfiniteScrollListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  showGrouping?: boolean;
  groupBy?: 'date' | 'type' | 'priority' | 'sender';
  itemsPerPage?: number;
  virtualized?: boolean;
}

export const InfiniteScrollList: React.FC<InfiniteScrollListProps> = ({
  notifications,
  onMarkAsRead,
  showGrouping = false,
  groupBy = 'date',
  itemsPerPage = 20,
  virtualized = false
}) => {
  const [displayedItems, setDisplayedItems] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleNotifications = notifications.slice(0, displayedItems);
  const hasMore = displayedItems < notifications.length;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setDisplayedItems(prev => Math.min(prev + itemsPerPage, notifications.length));
    setIsLoading(false);
  }, [isLoading, hasMore, itemsPerPage, notifications.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loadMore, hasMore, isLoading]);

  // Scroll position tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 200);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Reset displayed items when notifications change
  useEffect(() => {
    setDisplayedItems(itemsPerPage);
  }, [notifications, itemsPerPage]);

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="space-y-2">
          <p className="text-lg font-medium">No notifications found</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Notification Content */}
      <div className="space-y-2">
        {showGrouping ? (
          <NotificationGrouping
            notifications={visibleNotifications}
            groupBy={groupBy}
            onMarkAsRead={onMarkAsRead}
          />
        ) : (
          visibleNotifications.map(notification => (
            <EnhancedNotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading more notifications...</span>
          </div>
        </div>
      )}

      {/* Load more trigger (intersection observer target) */}
      {hasMore && !isLoading && (
        <div ref={observerRef} className="h-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadMore}
            className="text-muted-foreground hover:text-foreground"
          >
            Load more ({notifications.length - displayedItems} remaining)
          </Button>
        </div>
      )}

      {/* End message */}
      {!hasMore && displayedItems > itemsPerPage && (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">You've reached the end of your notifications</p>
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          variant="secondary"
          size="sm"
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 rounded-full shadow-lg z-10"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Stats */}
      {visibleNotifications.length > 0 && (
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Showing {visibleNotifications.length} of {notifications.length} notifications
        </div>
      )}
    </div>
  );
};