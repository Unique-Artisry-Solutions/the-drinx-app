
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessageThreadList from '@/components/promoter/communication/MessageThreadList';
import MessageThread from '@/components/promoter/communication/MessageThread';
import { useMessageSystem } from '@/hooks/establishment/useMessageSystem';

const EstablishmentInbox = () => {
  const [activeTab, setActiveTab] = useState('all');
  const {
    threads,
    loading,
    selectedThreadId,
    setSelectedThreadId,
    markThreadAsRead
  } = useMessageSystem('establishment');

  const handleSelectThread = (threadId: string) => {
    markThreadAsRead(threadId);
    setSelectedThreadId(threadId);
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                {loading ? (
                  <div className="text-center py-6">Loading messages...</div>
                ) : (
                  <MessageThreadList 
                    conversations={threads.filter(t => !t.isArchived)} 
                    onSelectConversation={handleSelectThread} 
                  />
                )}
              </div>
              
              <div className="lg:col-span-2">
                {selectedThreadId ? (
                  <MessageThread 
                    threadId={selectedThreadId} 
                    userType="establishment"
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Select a conversation to view messages</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="unread">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                {loading ? (
                  <div className="text-center py-6">Loading messages...</div>
                ) : (
                  <MessageThreadList 
                    conversations={threads.filter(t => !t.isRead && !t.isArchived)} 
                    onSelectConversation={handleSelectThread} 
                  />
                )}
              </div>
              
              <div className="lg:col-span-2">
                {selectedThreadId ? (
                  <MessageThread 
                    threadId={selectedThreadId} 
                    userType="establishment"
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Select a conversation to view messages</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="archived">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                {loading ? (
                  <div className="text-center py-6">Loading messages...</div>
                ) : (
                  <MessageThreadList 
                    conversations={threads.filter(t => t.isArchived)} 
                    onSelectConversation={handleSelectThread} 
                  />
                )}
              </div>
              
              <div className="lg:col-span-2">
                {selectedThreadId ? (
                  <MessageThread 
                    threadId={selectedThreadId} 
                    userType="establishment"
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Select a conversation to view messages</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EstablishmentInbox;
