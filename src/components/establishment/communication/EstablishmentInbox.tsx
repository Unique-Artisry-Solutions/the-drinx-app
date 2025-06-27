
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquarePlus, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import MessageThreadList from '@/components/promoter/communication/MessageThreadList';

interface EstablishmentInboxProps {
  onSelectThread?: (threadId: string) => void;
}

const EstablishmentInbox: React.FC<EstablishmentInboxProps> = ({ onSelectThread }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const {
    threads,
    loading,
    error,
    markThreadAsRead,
    refetchThreads
  } = useMessageSystem('establishment');

  // Check authentication status
  useEffect(() => {
    if (!user) {
      console.log('User not authenticated');
    }
  }, [user]);

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

  if (!user) {
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
            </AlertDescription>
          </Alert>
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
            <MessageThreadList 
              conversations={filteredThreads} 
              onSelectConversation={handleSelectConversation}
              isLoading={loading}
              error={error}
            />
          </TabsContent>

          <TabsContent value="unread">
            <MessageThreadList 
              conversations={filteredThreads.filter(c => !c.isRead)} 
              onSelectConversation={handleSelectConversation}
              isLoading={loading}
              error={error}
            />
          </TabsContent>

          <TabsContent value="archived">
            <MessageThreadList 
              conversations={filteredThreads.filter(c => c.isArchived)} 
              onSelectConversation={handleSelectConversation}
              isLoading={loading}
              error={error}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EstablishmentInbox;
