import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquarePlus, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEstablishmentMessageSystem } from '@/hooks/establishment/useMessageSystem';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { MessageThread } from '@/hooks/messages/types';

interface EstablishmentThreadListSidebarProps {
  onSelectThread: (threadId: string) => void;
  selectedThreadId: string | null;
  isMobile: boolean;
}

const EstablishmentThreadListSidebar: React.FC<EstablishmentThreadListSidebarProps> = ({ 
  onSelectThread, 
  selectedThreadId,
  isMobile 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, session, isAuthenticated, authStable } = useAuth();
  const {
    threads,
    loading,
    error,
    markThreadAsRead,
    refetchThreads
  } = useEstablishmentMessageSystem('establishment');

  // Enhanced authentication debugging
  useEffect(() => {
    console.log('🔧 EstablishmentThreadListSidebar - Auth state:', {
      user: !!user,
      userId: user?.id,
      userEmail: user?.email,
      session: !!session,
      isAuthenticated,
      authStable,
      userMetadata: user?.user_metadata,
      timestamp: Date.now()
    });
    
    if (!user && authStable) {
      console.warn('🔧 EstablishmentThreadListSidebar - User not authenticated but auth is stable');
    }
  }, [user, session, isAuthenticated, authStable]);

  const filteredThreads = threads.filter(
    conv => 
      conv.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false
  );

  const handleSelectConversation = (threadId: string) => {
    markThreadAsRead(threadId);
    onSelectThread(threadId);
  };

  const handleRefresh = () => {
    refetchThreads();
  };

  // Authentication check
  if (!user && authStable) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Authentication Required</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>You must be logged in</AlertTitle>
            <AlertDescription>
              Please log in to view your messages and communicate with promoters.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Loading state while auth is not stable
  if (!authStable) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Initializing authentication...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ThreadListItem: React.FC<{ conversation: MessageThread }> = ({ conversation }) => (
    <div 
      key={conversation.id}
      onClick={() => handleSelectConversation(conversation.id)}
      className={cn(
        "p-3 rounded-md transition-colors duration-200 cursor-pointer border",
        selectedThreadId === conversation.id 
          ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20" 
          : conversation.isRead 
            ? "bg-card hover:bg-accent/50" 
            : "bg-primary/5 border-primary/20 hover:bg-primary/10"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-medium truncate",
              selectedThreadId === conversation.id && "text-primary",
              !conversation.isRead && selectedThreadId !== conversation.id && "font-semibold text-primary"
            )}>
              {conversation.venueName}
            </h3>
            {!conversation.isRead && selectedThreadId !== conversation.id && (
              <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
            )}
          </div>
          <p className={cn(
            "text-sm mt-1 line-clamp-2",
            selectedThreadId === conversation.id 
              ? "text-primary/80" 
              : conversation.isRead 
                ? "text-muted-foreground" 
                : "text-foreground"
          )}>
            {conversation.lastMessage}
          </p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
          {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-md w-full"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-2" />
            <p className="text-muted-foreground mb-1">{error}</p>
            <p className="text-sm text-muted-foreground">Please try again later or contact support.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full flex flex-col", isMobile ? "w-full" : "w-full")}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            <span>Messages</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {filteredThreads.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">No messages found</p>
                  <p className="text-sm text-muted-foreground">New messages from promoters will appear here</p>
                </div>
              ) : (
                filteredThreads.map((conversation) => (
                  <ThreadListItem key={conversation.id} conversation={conversation} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="unread" className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {filteredThreads.filter(c => !c.isRead).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">No unread messages</p>
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                filteredThreads.filter(c => !c.isRead).map((conversation) => (
                  <ThreadListItem key={conversation.id} conversation={conversation} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="archived" className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {filteredThreads.filter(c => c.isArchived).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">No archived messages</p>
                  <p className="text-sm text-muted-foreground">Archived conversations will appear here</p>
                </div>
              ) : (
                filteredThreads.filter(c => c.isArchived).map((conversation) => (
                  <ThreadListItem key={conversation.id} conversation={conversation} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EstablishmentThreadListSidebar;