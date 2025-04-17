import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare } from 'lucide-react';
import MessageThreadList from './MessageThreadList';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PromoterInboxProps {
  onSelectThread?: (threadId: string) => void;
}

const PromoterInbox: React.FC<PromoterInboxProps> = ({ onSelectThread }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const {
    threads,
    loading,
    markThreadAsRead,
  } = useMessageSystem('promoter');

  const filteredThreads = threads.filter(
    conv => 
      conv.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (threadId: string) => {
    markThreadAsRead(threadId);
    if (onSelectThread) {
      onSelectThread(threadId);
    }
  };

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Please log in to view your messages.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>Venue Communications</span>
          </div>
        </CardTitle>
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
            {loading ? (
              <div className="text-center py-6">Loading conversations...</div>
            ) : (
              <MessageThreadList 
                conversations={filteredThreads} 
                onSelectConversation={handleSelectConversation}
              />
            )}
          </TabsContent>

          <TabsContent value="unread">
            <MessageThreadList 
              conversations={filteredThreads.filter(c => !c.isRead)} 
              onSelectConversation={handleSelectConversation}
            />
          </TabsContent>

          <TabsContent value="archived">
            <MessageThreadList 
              conversations={filteredThreads.filter(c => c.isArchived)} 
              onSelectConversation={handleSelectConversation}
            />
          </TabsContent>
          
          <div className="mt-4 flex justify-end">
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PromoterInbox;
