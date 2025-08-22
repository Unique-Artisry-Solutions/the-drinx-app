import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useAuth } from '@/contexts/auth';
import { cn } from '@/lib/utils';
import MessageLoadingState from './messages/MessageLoadingState';
import MessageErrorBoundary from './messages/MessageErrorBoundary';

interface PromoterThreadListSidebarProps {
  onSelectThread: (threadId: string) => void;
  selectedThreadId: string | null;
}

const PromoterThreadListSidebar: React.FC<PromoterThreadListSidebarProps> = ({
  onSelectThread,
  selectedThreadId
}) => {
  const { user } = useAuth();
  const { 
    threads, 
    loading, 
    error, 
    markThreadAsRead
  } = useMessageSystem('promoter');

  const handleThreadClick = async (threadId: string) => {
    try {
      await markThreadAsRead(threadId);
      onSelectThread(threadId);
    } catch (err) {
      console.error('Error selecting thread:', err);
    }
  };

  const handleRefresh = () => {
    // Refresh functionality can be added later
  };

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Venue Conversations</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <MessageErrorBoundary 
          error={error} 
          onRetry={handleRefresh}
        >
          {loading ? (
            <div className="p-4">
              <MessageLoadingState />
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {threads?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Start messaging venues to see conversations here</p>
                </div>
              ) : (
                threads?.map((thread) => (
                  <Card
                    key={thread.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-sm border",
                      selectedThreadId === thread.id 
                        ? "bg-accent border-primary" 
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => handleThreadClick(thread.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {thread.venueName || 'Unknown Venue'}
                          </h4>
                          {thread.subject && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              Re: {thread.subject}
                            </p>
                          )}
                          {thread.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {thread.lastMessage}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(thread.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-2">
                          {!thread.isRead && (
                            <Badge variant="default" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </MessageErrorBoundary>
      </CardContent>
    </div>
  );
};

export default PromoterThreadListSidebar;