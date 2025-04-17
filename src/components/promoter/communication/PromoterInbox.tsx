
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare } from 'lucide-react';
import MessageThreadList from './MessageThreadList';
import { usePromoterMessages } from '@/hooks/promoter/usePromoterMessages';

const PromoterInbox: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    conversations,
    unreadCount,
    activeTab,
    setActiveTab,
    markAsRead
  } = usePromoterMessages();

  const filteredConversations = conversations.filter(
    conv => conv.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>Venue Communications</span>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
              {unreadCount} unread
            </div>
          )}
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <MessageThreadList 
              conversations={filteredConversations} 
              onSelectConversation={markAsRead}
            />
          </TabsContent>

          <TabsContent value="unread">
            <MessageThreadList 
              conversations={filteredConversations.filter(c => !c.isRead)} 
              onSelectConversation={markAsRead}
            />
          </TabsContent>

          <TabsContent value="archived">
            <MessageThreadList 
              conversations={filteredConversations.filter(c => c.isArchived)} 
              onSelectConversation={markAsRead}
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
