
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquarePlus, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEstablishmentMessageSystem } from '@/hooks/establishment/useMessageSystem';
import EnhancedMessageThreadList from './EnhancedMessageThreadList';

interface EstablishmentInboxProps {
  onSelectThread?: (threadId: string) => void;
}

const EstablishmentInbox: React.FC<EstablishmentInboxProps> = ({ onSelectThread }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, session, isAuthenticated, authStable } = useAuth();
  const {
    threads,
    loading,
    error,
    markThreadAsRead,
    sendMessage,
    refetchThreads
  } = useEstablishmentMessageSystem('establishment');

  // **PHASE 4 FIX**: Enhanced authentication debugging
  useEffect(() => {
    console.log('🔧 EstablishmentInbox - Auth state:', {
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
      console.warn('🔧 EstablishmentInbox - User not authenticated but auth is stable');
      
      // **PHASE 4 FIX**: Check for session mismatch
      import('@/lib/supabase').then(({ supabase }) => {
        supabase.auth.getSession().then(({ data, error }) => {
          console.log('🔧 EstablishmentInbox - Direct session check:', {
            hasSession: !!data?.session,
            hasUser: !!data?.session?.user,
            sessionUserId: data?.session?.user?.id,
            sessionUserEmail: data?.session?.user?.email,
            error: error?.message
          });
        });
      });
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
    if (onSelectThread) {
      onSelectThread(threadId);
    }
  };

  const handleRefresh = () => {
    refetchThreads();
  };

  const handleSendMessage = async (threadId: string, content: string) => {
    await sendMessage(threadId, content);
    refetchThreads(); // Refresh to show updated threads
  };

  // **PHASE 4 FIX**: Enhanced authentication check with debug info
  if (!user && authStable) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Authentication Required</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>You must be logged in</AlertTitle>
            <AlertDescription>
              Please log in to view your messages and communicate with promoters.
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 text-xs opacity-75 space-y-1">
                  <div>Debug: Auth stable but no user. Check DevBypass login.</div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // **PHASE 4 FIX**: Show loading state while auth is not stable
  if (!authStable) {
    return (
      <Card className="w-full">
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            <span>Promoter Communications</span>
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
      
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <EnhancedMessageThreadList 
              conversations={filteredThreads} 
              onSelectConversation={handleSelectConversation}
              onSendMessage={handleSendMessage}
              isLoading={loading}
              error={error}
              userId={user?.id}
            />
          </TabsContent>

          <TabsContent value="unread">
            <EnhancedMessageThreadList 
              conversations={filteredThreads.filter(c => !c.isRead)} 
              onSelectConversation={handleSelectConversation}
              onSendMessage={handleSendMessage}
              isLoading={loading}
              error={error}
              userId={user?.id}
            />
          </TabsContent>

          <TabsContent value="archived">
            <EnhancedMessageThreadList 
              conversations={filteredThreads.filter(c => c.isArchived)} 
              onSelectConversation={handleSelectConversation}
              onSendMessage={handleSendMessage}
              isLoading={loading}
              error={error}
              userId={user?.id}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EstablishmentInbox;
